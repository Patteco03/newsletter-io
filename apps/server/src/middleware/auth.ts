import { UnauthorizedException } from "@/exceptions/UnauthorizedException";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, _: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new UnauthorizedException("No token provided");
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decoded) {
      throw new UnauthorizedException("Invalid token");
    }

    req.user = decoded as Express.UserPayload;
    next();
  } catch (error) {
    throw new UnauthorizedException("Invalid or expired token.");
  }
}
