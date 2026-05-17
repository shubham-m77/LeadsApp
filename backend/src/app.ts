import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import cors from "cors"
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import healthRoutes from "./routes/health.routes"
import { errorMiddleware } from "./middlewares/error.middleware";
import { notFoundMiddleware } from "./middlewares/notFound.middleware";
import authRoutes from "./routes/auth.routes";
import leadRoutes from "./routes/lead.routes";

const app:Application = express();
app.use(helmet());
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/health", healthRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/leads",leadRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
export default app;