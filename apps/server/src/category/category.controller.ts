import { Router, Request, Response } from "express";
import CategoryService from "./category.service";
import { validateData } from "@/middleware/validate";
import { paginationSchema } from "@/interfaces/pagination";
import { createCategorySchema } from "./dto/create.category.dto";

const service = new CategoryService();
const router = Router();

router.get(
  "/",
  validateData({ query: paginationSchema }),
  async (req: Request, res: Response) => {
    const { page, limit } = req.validated;
    const output = await service.getAll({ page, limit });
    return res.status(200).json(output);
  }
);

router.post(
  "/",
  validateData({ body: createCategorySchema }),
  async (req: Request, res: Response) => {
    const payload = req.body;
    const output = await service.create(payload);
    return res.status(201).json(output);
  }
);

router.put(
  "/:id",
  validateData({ body: createCategorySchema }),
  async (req: Request, res: Response) => {
    const { id } = req.params as any
    const payload = req.body;
    const output = await service.update(id, payload);
    return res.status(201).json(output);
  }
);

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params as any;
  await service.delete(id);
  return res.status(204).end();
});

export default router;
