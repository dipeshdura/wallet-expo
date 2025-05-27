import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getSummaryByUserId,
  getTransactionsByUserId,
} from "../controllers/controller.transactions.js";

const router = express.Router();

router.post("/", createTransaction);
router.get("/:userId", getTransactionsByUserId);

router.delete("/:id", deleteTransaction);
router.get("/summary/:userId", getSummaryByUserId);

export default router;
