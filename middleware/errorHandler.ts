import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;

  // Handle Mongoose validation errors
  let message = err.message || "Server Error";

  if (err.name === "ValidationError") {
    // Collect all validation messages
    message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(", ");
  }

  // Safely log the error
  console.error(
    typeof err === "object" ? JSON.stringify(err, null, 2) : err
  );

  res.status(status).json({ success: false, message });
};
