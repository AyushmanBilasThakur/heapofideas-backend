require("dotenv").config();
import express from "express";
import cors from "cors";
import "./utils/dbConnect";
import indexRouter from "./routes/indexRouter";

import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();
const PORT = process.env.PORT || 3000 

app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(indexRouter);


app.listen(PORT, ()=> {
    console.log(`Backend running on port ${PORT}`);
})