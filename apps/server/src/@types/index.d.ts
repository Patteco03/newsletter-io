import "express";

declare global {
  namespace Express {
    export interface UserPayload {
      sub: string;  
      name: string;  
      email: string;
      role: string;
    }

    export interface Request {
      user?: UserPayload;
      validated: any
    }
  }
}