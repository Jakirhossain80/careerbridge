import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const ignoredFiles = new Set(["pnpm-lock.yaml", "check-secrets.mjs"]);
const placeholderPattern =
  /(example|placeholder|fake|do-not-use|replace-with|localhost|127\.0\.0\.1|000000)/i;
const checks = [
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ["MongoDB credentials", /mongodb(?:\+srv)?:\/\/[^\s:/]+:[^\s@/]+@/i],
  [
    "assigned secret",
    /^\s*[A-Z0-9_]*(?:SECRET|TOKEN|PASSWORD|PRIVATE_KEY|API_KEY)\s*=\s*["']?[^\s"']{12,}/i,
  ],
];

const findings = [];

async function scanTrackedFiles() {
  const trackedFiles = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    {
    cwd: root,
    encoding: "utf8",
    }
  )
    .split("\0")
    .filter(Boolean);

  for (const relativePath of trackedFiles) {
    if (ignoredFiles.has(path.basename(relativePath))) continue;
    const absolutePath = path.join(root, relativePath);

    let contents;
    try {
      contents = await readFile(absolutePath, "utf8");
    } catch {
      continue;
    }

    contents.split(/\r?\n/).forEach((line, index) => {
      if (placeholderPattern.test(line)) return;
      for (const [category, pattern] of checks) {
        if (pattern.test(line)) {
          findings.push({
            category,
            file: path.relative(root, absolutePath),
            line: index + 1,
          });
        }
      }
    });
  }
}

await scanTrackedFiles();

if (findings.length > 0) {
  console.error(
    "Potential secrets detected (matched values are intentionally hidden):"
  );
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.line} [${finding.category}]`);
  }
  process.exitCode = 1;
} else {
  console.log("No common committed-secret patterns detected.");
}
