import { Router, Request, Response } from "express";
import UserService from "./user.service";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const service = new UserService();
  const output = await service.createUser({ email, password, name });
  res.status(201).json(output);
});

export default router;
