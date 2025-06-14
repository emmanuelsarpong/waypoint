import express, { Request, Response } from "express";
import { createSetupIntent } from "../controllers/billingController";

const router = express.Router();

router.post("/create-setup-intent", (req: Request, res: Response) => {
  createSetupIntent(req, res);
});

export default router;