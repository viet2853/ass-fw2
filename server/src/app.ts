import dotenv from "dotenv";
import express, { Application } from "express";
import morgan from "morgan";
import connectDB from "./config/database";
import cors from "cors";

import authRouter from "./routes/auth";
import productRouter from "./routes/product";
import categoryRouter from "./routes/category";
import userRouter from "./routes/user";
import uploadRouter from "./routes/upload";

const app: Application = express();
dotenv.config();

// Khởi tạo kết nối với cơ sở dữ liệu
connectDB(process.env.MONGO_URI || "ass_reactjs");

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

app.use("/api", productRouter);
app.use("/api", categoryRouter);
app.use("/api", userRouter);
app.use("/api", authRouter);
app.use("/api", uploadRouter);

export const viteNodeApp: Application = app;
