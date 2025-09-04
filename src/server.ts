import dotenv from "dotenv";
dotenv.config();

import express from "express";
import userRouter from "./router/authRouter.js";

const app = express();
app.use(express.json());

app.use("/HMS",userRouter)






app.get("/HMS",(req,res)=>{
    res.send("welcome with HMS")
})



const PORT = Number(process.env.PORT) || 8000;

app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}/HMS`);
})
