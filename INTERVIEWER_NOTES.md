# Interviewer Notes — DO NOT share with candidate

---

## The 3 Bugs

### Bug 1 — DB: Missing `ON CONFLICT` in holdings upsert
**File:** `backend/src/db/database.ts` — `upsertHolding()` function

**What happens:** The `holdings` table has `UNIQUE(symbol)`. When a user tries to add a second transaction for a stock they already hold (e.g. buying more AAPL), the plain `INSERT` throws:
```
UNIQUE constraint failed: holdings.symbol
```
The error surfaces in the UI as a red error banner.

**The fix (2 lines):**
```sql
-- Replace the INSERT with:
INSERT INTO holdings (id, symbol, name, quantity, average_cost, total_cost)
VALUES (@id, @symbol, @name, @quantity, @averageCost, @totalCost)
ON CONFLICT(symbol) DO UPDATE SET
  quantity     = excluded.quantity,
  average_cost = excluded.average_cost,
  total_cost   = excluded.total_cost
```

---

### Bug 2 — BE: Average cost divided by `lots.length` instead of `totalQuantity`
**File:** `backend/src/services/transactionService.ts` — `computeFIFOLots()` function (last few lines)

**What happens:** After fixing Bug 1, transactions save successfully. But the average cost shown in the holdings table is wildly wrong. Example:
- User buys 5 more AAPL @ $170 (on top of existing 10 @ $150)
- Expected average cost: (10×150 + 5×170) / 15 = **$156.67**
- Buggy result: (1500 + 850) / **2** (lots.length) = **$1,175.00**

**The fix (1 character):**
```typescript
// Change:
const averageCost = totalQuantity > 0 ? totalCost / lots.length : 0;
// To:
const averageCost = totalQuantity > 0 ? totalCost / totalQuantity : 0;
```

---

### Bug 3 — FE: Wrong React Query invalidation key
**File:** `frontend/src/components/AddTransactionForm.tsx` — `handleSubmit()` function

**What happens:** After fixing Bugs 1 and 2, the transaction saves correctly and the DB has correct data. But the holdings table in the UI never refreshes after submitting the form. The user sees stale data and thinks nothing happened.

The form invalidates `['portfolio']` — a key no query uses. The holdings query key is `['holdings']`.

**The fix (1 word):**
```typescript
// Change:
await queryClient.invalidateQueries({ queryKey: ["portfolio"] });
// To:
await queryClient.invalidateQueries({ queryKey: ["holdings"] });
```

---

## Bug Discovery Flow

The bugs must be fixed in order — each one reveals the next:

```
Add BUY for AAPL (already held)
        ↓
  Red error banner: "UNIQUE constraint failed"  → Bug 1 visible
        ↓  (fix Bug 1)
  Transaction saves, but avg cost = $1,175      → Bug 2 visible
        ↓  (fix Bug 2)
  Correct avg cost in DB, but UI shows old data  → Bug 3 visible
        ↓  (fix Bug 3)
  Holdings table refreshes with correct data ✓
```

---

## How to Validate (as interviewer)

After all 3 fixes:
1. Open http://localhost:5173 — should show 3 holdings (AAPL, TSLA, MSFT)
2. Click "+ Add Transaction"
3. Select AAPL, BUY, qty=5, price=170, fee=0 → submit
4. Holdings table should refresh and show:
   - AAPL: 15 shares, avg cost **$156.67**, value $2,625 (at mock price $175)
5. Add another BUY for TSLA qty=5 @ $240 → table refreshes, TSLA shows 10 shares @ $220 avg

---

## Scoring

| Score | Description |
|---|---|
| 1/5 | Found 1 bug only, relied entirely on AI output, can't explain fixes |
| 2/5 | Found 2 bugs, partial understanding of what went wrong |
| 3/5 | Found all 3 bugs, applied correct fixes, basic explanation |
| 4/5 | Found all 3 bugs, explained the root cause of each clearly |
| 5/5 | All above + explained financial implications (wrong avg cost → wrong P/L reporting) and considered edge cases |

**Green flags:**
- Reads the error message before asking the AI anything
- Uses AI to explain unfamiliar concepts, then validates
- Catches Bug 2 by reasoning about FIFO math, not just accepting AI output
- Asks "are there other places this function is called?" for Bug 2

**Red flags:**
- First action is asking AI to "find and fix all bugs"
- Accepts AI output that compiles without reading it
- Can't explain what average cost means or why the division is wrong
- Doesn't verify the fix produces the right number before moving on
