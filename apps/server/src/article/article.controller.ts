import { Router, Request, Response } from "express";
import ArticleService from "./article.service";
import { validateData } from "@/middleware/validate";
import { createArticleSchema } from "./dto/create.article.dto";
import { paginationSchema } from "@/interfaces/pagination";

const service = new ArticleService();
const router = Router();

router.get(
  "/",
  validateData({ query: paginationSchema }),
  async (req: Request, res: Response) => {
    const user = req.user;
    const payload = req.validated;
    const output = await service.getArticlesByUser(user?.sub!, payload);
    return res.status(200).json(output);
  }
);

router.get(
  "/feed",
  validateData({ query: paginationSchema }),
  async (req: Request, res: Response) => {
    const payload = req.validated;
    const output = await service.getFeed(payload);
    return res.status(200).json(output);
  }
);

router.get(
  "/:id",
  async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const output = await service.getOne(id);
    return res.status(200).json(output);
  }
);

router.post(
  "/",
  validateData({ body: createArticleSchema }),
  async (req: Request, res: Response) => {
    const user = req.user;
    const payload = req.body;
    const output = await service.create(user?.sub!, payload);
    return res.status(201).json(output);
  }
);

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params as any;
  const payload = req.body;
  const output = await service.update(id, payload);
  return res.status(200).json(output);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params as any;
  await service.delete(id);
  return res.status(204).end();
});

export default router;
