import { config } from "dotenv";
import express from "express";
import transactionsRoutes from "./routes/route.transactions.js";
import { initDB } from "./config/db.js";
import ratelimiter from "./middleware/rateLimiter.js";


config();

const PORT = process.env.PORT || 5001;



const app = express();

//middleware
app.use(ratelimiter);
app.use(express.json());

//routes
app.use("/api/transactions",transactionsRoutes);


initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ SERVER sTARTED AT PORT ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
