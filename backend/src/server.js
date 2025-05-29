import { config } from "dotenv";
import express from "express";
import transactionsRoutes from "./routes/route.transactions.js";
import { initDB } from "./config/db.js";
import ratelimiter from "./middleware/rateLimiter.js";
import job from "./config/cron.js";
import cors from "cors";
config();

const PORT = process.env.PORT || 5001;

const app = express();

if(process.env.NODE_ENV==="production")job.start();

//middleware
app.use(ratelimiter);
app.use(express.json());
app.use(cors());

app.get("/api/health",(req,res)=>{
  res.status(200).json({status:"ok"})
})

//routes
app.use("/api/transactions",transactionsRoutes);


initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ SERVER sTARTED AT PORT ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
