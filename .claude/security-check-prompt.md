# Security Audit — Automated Weekly Check

You are running a security audit on this repository inside GitHub Actions.
Your goal: identify real security issues and write a structured JSON report.
Be thorough but precise — no false positives, but don't miss anything critical.

Note: This is a Discord bot application. It has no package.json or dependency lockfile.
Skip the dependency audit entirely and focus on code analysis.

## 1. Hardcoded Secrets & Credentials

- Scan all source files for patterns: Discord bot tokens, API keys, webhook URLs, passwords, private keys
- Check if `.env` files are committed to the repo (should be in `.gitignore`)
- Look for hardcoded Discord token strings or application IDs with associated secrets
- Check for secrets in config files or test fixtures

## 2. Discord Bot Security

- Verify bot token is loaded from environment variables, never hardcoded
- Check command handlers for proper permission validation before executing privileged actions
- Look for missing guild/channel permission checks on sensitive commands
- Verify user input from Discord messages is sanitized before use
- Check for command injection risks in any shell exec or system calls triggered by bot commands

## 3. Code Security Patterns

- **Injection:** Command injection (unsanitized input in shell commands or eval)
- **SSRF:** User-controlled URLs in fetch/request calls without validation
- **Path Traversal:** Unsanitized file path construction from user input
- **eval() / Function():** Dynamic code execution from user-controlled input
- **Prototype Pollution:** Unsafe object merging with user input
- **Insecure Crypto:** Weak algorithms, hardcoded IVs/salts

## 4. Configuration & Infrastructure

- Check for debug/development settings that should not be in production
- Verify `.gitignore` properly excludes sensitive files
- Review any Dockerfile or deployment configs for security issues

## 5. Output

Write a file named `security-report.json` in the repository root with this exact JSON schema:

```json
{
  "repo": "repository-name",
  "scan_date": "2024-01-01T00:00:00Z",
  "summary": "Human-readable 1-3 sentence summary of findings",
  "risk_level": "clean|low|medium|high|critical",
  "issues": [
    {
      "id": "SEC-001",
      "category": "secret|code|config",
      "severity": "critical|high|medium|low|info",
      "title": "Short descriptive title",
      "description": "Detailed description of the issue and its impact",
      "file": "path/to/file.ts",
      "line": 42,
      "recommendation": "Specific steps to fix this issue",
      "references": ["https://cve.mitre.org/..."]
    }
  ],
  "dependency_audit": {
    "ran": false,
    "critical": 0,
    "high": 0,
    "medium": 0,
    "low": 0
  },
  "files_scanned": 0
}
```

## Rules

- Only report real, verifiable issues. Do not speculate or invent problems.
- If no issues are found, return an empty `issues` array and set `risk_level` to `"clean"`.
- The JSON must be valid and parseable. No markdown, no comments in the JSON file.
- Focus on actionable findings. Informational notes should use severity `"info"`.
- Set `risk_level` based on the highest severity found.
- Number issues sequentially: SEC-001, SEC-002, etc.
- Always set `dependency_audit.ran` to `false` for this repository.
