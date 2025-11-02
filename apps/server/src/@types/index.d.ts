import "express";
import { userRole } from "../user/dto/get.user.dto";

declare global {
  namespace Express {
    export interface UserPayload {
      sub: string;
      name: string;
      email: string;
      role: keyof typeof userRole;
    }

    export interface Request {
      user?: UserPayload;
      validated: any
    }
  }
}
