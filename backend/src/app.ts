import express from "express";
import cors from "cors";
import transactionsRouter from "./routes/transactions";
import holdingsRouter from "./routes/holdings";
import { seedIfEmpty } from "./db/seed";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionsRouter);
app.use("/api/holdings", holdingsRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

seedIfEmpty();

app.listen(PORT, () => {
  console.log(`[backend] Running at http://localhost:${PORT}`);
});
