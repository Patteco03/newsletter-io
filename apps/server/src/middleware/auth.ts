import { UnauthorizedException } from "@/exceptions/UnauthorizedException";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const PUBLIC_ROUTES = ["/login", "/feed"];

export function authMiddleware(req: Request, _: Response, next: NextFunction) {
  if (PUBLIC_ROUTES.includes(req.path)) {
    return next();
  }

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
