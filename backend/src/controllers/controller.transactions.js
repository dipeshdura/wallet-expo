import { sql } from "../config/db.js";

export const createTransaction=async (req, res) => {
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
}

export const getTransactionsByUserId=async (req, res) => {
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
}

export const getSummaryByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
    SELECT COALESCE(SUM(CAST(amount AS NUMERIC)), 0) as balance FROM transactions 
    WHERE user_id = ${userId}
`;
    console.log(balanceResult);
    
    const incomeResult = await sql`
    SELECT COALESCE(SUM(CAST(amount AS NUMERIC)), 0) as income FROM transactions 
    WHERE user_id = ${userId} AND CAST(amount AS NUMERIC) > 0
`;
    console.log(incomeResult);

const expensesResult = await sql`
    SELECT COALESCE(SUM(CAST(amount AS NUMERIC)), 0) as expenses FROM transactions 
    WHERE user_id = ${userId} AND CAST(amount AS NUMERIC) < 0
`;
console.log(expensesResult);

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
}

export const deleteTransaction =async (req, res) => {
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
}