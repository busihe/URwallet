import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export interface AuthReq extends Request {
user?: { id: string };
}
export const protect = (req: AuthReq, res: Response, next: NextFunction) => {
const token = req.cookies.urwallet;
if (!token) return res.status(401).json({ message: "Unauthorized" });
try {
const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
req.user = decoded;
next();
} catch {
return res.status(401).json({ message: "Token failed" });
}
};