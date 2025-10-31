import { Router, Request, Response } from "express";
import UserService from "./user.service";
import { validateData } from "@/middleware/validate";
import { createUserSchema } from "./dto/create.user.dto";
import { loginUserSchema } from "./dto/login.user.dto";

const service = new UserService();
const router = Router();

router.post(
  "/register",
  validateData({ body: createUserSchema }),
  async (req: Request, res: Response) => {
    const payload = req.body;

    const output = await service.createUser(payload);
    res.status(201).json(output);
  }
);

router.post(
  "/login",
  validateData({ body: loginUserSchema }),
  async (req: Request, res: Response) => {
    const payload = req.body;

    const output = await service.login(payload);
    res.status(200).json(output);
  }
);

export default router;
