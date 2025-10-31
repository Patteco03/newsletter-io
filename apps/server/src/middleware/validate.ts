import { z, ZodError } from "zod";
import { NextFunction, Request, Response } from "express";

type ValidationSchema = {
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
};

export function validateData(schema: ValidationSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      if (schema.query) {
        req.query = schema.query.parse(req.query) as any;
      }

      if (schema.params) {
        req.params = schema.params.parse(req.params) as any
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: any) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        res.status(422).json({ error: "Invalid data", details: errorMessages });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
}
