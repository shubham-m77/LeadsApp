import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Smart Leads API is running",
    environment: process.env.NODE_ENV || "development"
  });
});

export default router;