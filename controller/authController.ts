import { Request, Response, NextFunction } from "express";
import z from "zod";
import User from "../model/User";
import generateToken from "../utils/generateToken";
const registerSchema = z.object({
email: z.string().email(),
password: z.string().min(6),
names: z.string().min(2),
});
const loginSchema = z.object({
email: z.string().email(),
password: z.string().min(1),
});
export const register = async (req: Request, res: Response, next: NextFunction) => {
try {
const { email, password, names } = registerSchema.parse(req.body);
const exists = await User.findOne({ email });
if (exists) return res.status(409).json({ message: "Email taken" });

const user = await User.create({ email, password, names });
const token = generateToken(user._id.toString());


res.cookie("urwallet", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

res.status(201).json({ user: { id: user._id, email, names } });
} catch (e) {
next(e);
}
};
export const login = async (req: Request, res: Response, next: NextFunction) => {
try {
const { email, password } = loginSchema.parse(req.body);
const user = await User.findOne({ email }).select("+password");
if (!user || !(await user.comparePassword(password)))
return res.status(401).json({ message: "Invalid credentials" });
const token = generateToken(user._id.toString());
res.cookie("urwallet", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

res.json({ user: { id: user._id, email: user.email, names: user.names } });
} catch (e) {
next(e);
}
};
export const verify2FA = async (req: Request, res: Response) => {
// stub – TOTP verification will be added later
res.json({ message: "2FA not implemented yet" });
};