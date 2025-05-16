import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend the Request interface to include the 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
    return;
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
    return;
  }
};
