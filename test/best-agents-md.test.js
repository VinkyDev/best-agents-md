import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const cli = fileURLToPath(new URL("../bin/cli.js", import.meta.url));
const standard = readFileSync(new URL("../AGENTS.md", import.meta.url), "utf8").trimEnd();
const start = "<!-- best-agents-md:start -->";
const end = "<!-- best-agents-md:end -->";
const managed = `${start}\n\n${standard}\n\n${end}\n`;

function inProject(callback) {
  const cwd = mkdtempSync(join(tmpdir(), "best-agents-md-"));
  try {
    const run = (...args) => spawnSync(process.execPath, [cli, ...args], { cwd, encoding: "utf8" });
    callback({ cwd, target: join(cwd, "AGENTS.md"), run });
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
}

test("creates AGENTS.md and leaves it unchanged on a second run", () => {
  inProject(({ target, run }) => {
    assert.match(run().stdout, /Created AGENTS\.md\./);
    assert.equal(readFileSync(target, "utf8"), managed);
    assert.match(run().stdout, /AGENTS\.md is already up to date\./);
    assert.equal(readFileSync(target, "utf8"), managed);
  });
});

test("appends the standard, preserving project lines, trailing spaces, and CRLF line endings", () => {
  inProject(({ target, run }) => {
    const existing = "# My repo\r\n\r\nRun the project checks.  \r\n";
    writeFileSync(target, existing);
    assert.match(run().stdout, /Added best-agents-md to AGENTS\.md\./);
    assert.equal(readFileSync(target, "utf8"), existing + "\r\n" + managed.replaceAll("\n", "\r\n"));
  });
});

test("replaces only the installed block, preserving surrounding content and a BOM", () => {
  inProject(({ target, run }) => {
    const after = "\n## Local conventions\n\nAlways run the project checks.";
    for (const before of ["# Project\n\n", "\uFEFF"]) {
      writeFileSync(target, `${before}${start}\nOld standard.\n${end}\n${after}`);
      assert.match(run().stdout, /Updated AGENTS\.md\./);
      assert.equal(readFileSync(target, "utf8"), before + managed + after);
      assert.match(run().stdout, /AGENTS\.md is already up to date\./);
    }
  });
});

test("adopts a manually copied standard instead of adding a second copy", () => {
  inProject(({ target, run }) => {
    writeFileSync(target, `# Project\n\n${standard}\n`);
    run();
    assert.equal(readFileSync(target, "utf8"), `# Project\n\n${managed}`);
  });
});

test("updates the file behind a symlinked AGENTS.md and keeps the link", () => {
  inProject(({ cwd, target, run }) => {
    const linked = join(cwd, "CLAUDE.md");
    writeFileSync(linked, "# Project\n");
    symlinkSync("CLAUDE.md", target);
    run();
    assert.equal(lstatSync(target).isSymbolicLink(), true);
    assert.equal(readFileSync(linked, "utf8"), `# Project\n\n${managed}`);
  });
});

test("rejects malformed or repeated markers without changing AGENTS.md", () => {
  inProject(({ target, run }) => {
    for (const existing of [
      `${start}\nMissing end marker.\n`,
      `${end}\n${start}\n`,
      `${start}\nOld standard.\n${end}\n\n${start}\nAnother block.\n${end}\n`,
    ]) {
      writeFileSync(target, existing);
      const result = run();
      assert.equal(result.status, 1, existing);
      assert.match(result.stderr, /Malformed best-agents-md markers/);
      assert.equal(readFileSync(target, "utf8"), existing);
    }
  });
});

test("shows help and rejects unknown options without creating AGENTS.md", () => {
  inProject(({ target, run }) => {
    assert.match(run("--help").stdout, /Usage:\s+npx best-agents-md\b/);
    const result = run("--lang=zh");
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Unknown option: --lang=zh/);
    assert.equal(existsSync(target), false);
  });
});

test("ships a SKILL.md whose frontmatter is valid and body stays in sync with AGENTS.md", () => {
  const skill = readFileSync(new URL("../skills/coding-standard/SKILL.md", import.meta.url), "utf8");
  const match = skill.match(/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/);
  assert.ok(match, "SKILL.md should start with YAML frontmatter followed by a blank line");
  const [, frontmatter, body] = match;
  assert.match(frontmatter, /^name:\s*coding-standard$/m);
  assert.match(frontmatter, /^description:\s*\S.+$/m);
  assert.equal(body.trimEnd(), standard);
});
