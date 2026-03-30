# Pre-Interview Setup — Please complete before your interview

Estimated setup time: **10–15 minutes**

---

## Required Software

### 1. Node.js v20 or later
Check your version:
```bash
node --version   # should print v20.x.x or higher
```
Download from: https://nodejs.org (choose LTS)

### 2. npm v9 or later (comes with Node)
```bash
npm --version    # should print 9.x.x or higher
```

### 3. Claude Code CLI
This is the AI tool you'll use during the interview.

Install:
```bash
npm install -g @anthropic-ai/claude-code
```

Verify:
```bash
claude --version
```

You'll need to authenticate with your Anthropic account. Run `claude` once before the interview to complete the login flow.

> If you don't have an Anthropic account, sign up at https://claude.ai — a free account works.

### 4. Git
```bash
git --version
```
Git is pre-installed on most systems. If not: https://git-scm.com

### 5. A terminal you're comfortable with
Any terminal works — Terminal.app, iTerm2, Windows Terminal, etc.

### 6. A code editor
VS Code is recommended (Claude Code has a VS Code extension), but any editor works.

---

## System Requirements

- **OS:** macOS, Linux, or Windows (WSL2 recommended on Windows)
- **RAM:** 8 GB minimum
- **Disk:** 1 GB free space
- **Internet:** Required (for Claude Code API calls)

---

## Pre-Interview Checklist

Run through this the day before:

- [ ] `node --version` prints v20+
- [ ] `npm --version` prints 9+
- [ ] `claude --version` works and you're logged in
- [ ] You can run `claude` in a terminal and get a response
- [ ] Your code editor is open and ready

---

## On the Day

You will receive a zip file or repo link at the start of the interview.

The only setup command you'll need to run is:
```bash
npm run setup   # installs all dependencies
npm run dev     # starts the app
```

The app opens at **http://localhost:5173** — no database setup, no environment variables, no external services required.

---

## Questions?

If you run into setup issues before the interview, reach out to your interviewer so we can resolve them in advance — not during the session.
