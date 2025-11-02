import { Router, Request, Response } from "express";
import UserService from "./user.service";
import { validateData } from "@/middleware/validate";
import { createUserSchema } from "./dto/create.user.dto";
import { loginUserSchema } from "./dto/login.user.dto";
import { authMiddleware } from "@/middleware/auth";
import { paginationSchema } from "@/interfaces/pagination";

const service = new UserService();
const router = Router();

router.get(
  "/",
  authMiddleware,
  validateData({ query: paginationSchema }),
  async (req: Request, res: Response) => {
    const user = req.user as Express.UserPayload;
    const payload = req.validated;
    const output = await service.getAllUsers(user, payload);
    res.status(200).json(output);
  }
);

router.get("/me", authMiddleware, async (req: Request, res: Response) => {
  const userId = req.user!.sub;

  const output = await service.getUserById(userId);
  res.status(200).json(output);
});

router.post(
  "/register",
  authMiddleware,
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

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  const user = req.user as Express.UserPayload;
  const id = req.params.id as string;

  await service.deleteUser(user, id);
  res.status(204).end();
});

export default router;
