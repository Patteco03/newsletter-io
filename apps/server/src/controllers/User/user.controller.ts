import { Router, Request, Response } from "express";
import UserService from "./user.service";
import { validateData } from "@/middleware/validate";
import { createUserSchema } from "./dto/create.user.dto";

const router = Router();

router.post(
  "/register",
  validateData({ body: createUserSchema }),
  async (req: Request, res: Response) => {
    const payload = req.body;

    const service = new UserService();
    const output = await service.createUser(payload);
    res.status(201).json(output);
  }
);

export default router;
