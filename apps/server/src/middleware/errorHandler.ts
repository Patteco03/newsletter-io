import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/HttpException";

export function errorHandler(
  err: any,
  _: Request,
  res: Response,
  __: NextFunction
) {
  if (err instanceof HttpException) {
    return res.status(err.status).json({
      statusCode: err.status,
      message: err.message,
    });
  }

  console.error("Unhandled error:", err);

  return res.status(500).json({
    statusCode: 500,
    message: "Internal Server Error",
  });
}
