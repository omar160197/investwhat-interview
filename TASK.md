# InvestWhat — Technical Screening

## Context

You're joining the InvestWhat engineering team. This is a simplified version of our portfolio management feature — users can view their stock holdings and add buy/sell transactions.

**The feature is currently broken.** Users are reporting:
- Errors when trying to add transactions
- Wrong numbers showing in the portfolio after transactions
- The portfolio not updating after a successful transaction

Your job is to find and fix all the issues.

---

## Setup

```bash
npm run setup     # installs all dependencies (run once)
npm run dev       # starts backend on :3001 and frontend on :5173
```

Open your browser at **http://localhost:5173**

---

## Your Task

1. Run the app and reproduce the reported problems
2. Use the **AI CLI** to investigate and fix the issues
3. Validate that everything works end-to-end after your fixes

You should be able to:
- Add a transaction for a stock you already hold (e.g. AAPL)
- See the holdings table update with the correct average cost
- Add multiple transactions and confirm the numbers are right

---

## Rules

- You **must** use the AI CLI to assist your work
- Do not just ask "fix everything" — understand what each bug is before accepting a fix
- Be ready to explain each fix to the interviewer
- The fix for each bug is **small** — you won't need to rewrite anything

---

## Files to focus on

```
backend/src/
  db/database.ts          ← database layer
  services/transactionService.ts   ← business logic
frontend/src/
  components/AddTransactionForm.tsx  ← transaction form
```

Good luck.
