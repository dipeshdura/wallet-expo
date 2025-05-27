import { config } from "dotenv";
import express from "express";
import { sql } from "./config/db.js";

config();

const PORT = process.env.PORT || 5001;

const initDB = async () => {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;
    console.log("DATABASE initialized successfully");
  } catch (error) {
    console.log("ERROR initializing DB", error);
    process.exit(1); // status code 1 means failure, 0 success
  }
};

const app = express();
app.use(express.json());

// app.use("/api/")
app.get("/api/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const transaction = await sql`
            SELECT * FROM  transactions WHERE user_id=${userId} ORDER BY created_at DESC;
        `;

    res.status(201).json(transaction);
  } catch (error) {
    console.log("Error getting  the transaction", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.post("/api/transactions", async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;
    if (!title || !amount === undefined || !category || !user_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await sql`
            INSERT INTO transactions(user_id, title, amount, category)
            VALUES (${user_id}, ${title},${amount}, ${category})
            RETURNING * 
        `;
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating the transaction", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid transactions Id" });
    }

    const transaction = await sql`
            DELETE  FROM  transactions WHERE id=${id} RETURNING *;
        `;
    if (transaction.length === 0) {
      res.status(400).json({ message: "Transaction not found" });
    }
    res.status(201).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log("Error deleting  the transaction", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.get("/api/transactions/summary/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
    SELECT COALESCE(SUM(CAST(amount AS NUMERIC)), 0) as balance FROM transactions 
    WHERE user_id = ${userId}
`;

    const incomeResult = await sql`
    SELECT COALESCE(SUM(CAST(amount AS NUMERIC)), 0) as income FROM transactions 
    WHERE user_id = ${userId} AND CAST(amount AS NUMERIC) > 0
`;

    const expensesResult = await sql`
    SELECT COALESCE(SUM(CAST(amount AS NUMERIC)), 0) as expenses FROM transactions 
    WHERE user_id = ${userId} AND CAST(amount AS NUMERIC) < 0
`;

    //income  + exppense - amount > 0 amount < 0

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.log("Error getting  the summary", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`SERVER sTARTED AT PORT ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
