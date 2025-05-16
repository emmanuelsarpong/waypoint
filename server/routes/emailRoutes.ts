import express from "express";
import { sendEmailHandler } from "../controllers/emailController";
import { catchAsync } from "../utils/catchAsync";

const router = express.Router();

router.post("/send", catchAsync(sendEmailHandler));

export default router;
