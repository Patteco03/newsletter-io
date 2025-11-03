import db from "@newsletter-io/db";
import { BadRequestException } from "@/exceptions/BadRequestException";
import { NotFoundException } from "@/exceptions/NotFoundException";
import { CreateCategoryDto } from "./dto/create.category.dto";
import {
  GetCategoryDto,
  ListCategoriesDto,
  ListCategoryInput,
} from "./dto/get.category.dto";

export default class CategoryService {
  constructor(private readonly model: typeof db.category = db.category) {}

  public async getAll({
    page,
    limit,
  }: ListCategoryInput): Promise<ListCategoriesDto> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.model.count(),
    ]);

    return {
      data: data.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description || null,
        created_at: category.createdAt,
        updated_at: category.updatedAt,
      })),
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  public async findOne(id: string): Promise<GetCategoryDto> {
    const category = await this.model.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return {
      id: category.id,
      name: category.name,
      description: category.description || null,
      created_at: category.createdAt,
      updated_at: category.updatedAt,
    };
  }

  public async create(input: CreateCategoryDto): Promise<GetCategoryDto> {
    const checkCategory = await this.model.findUnique({
      where: { name: input.name },
    });

    if (checkCategory) {
      throw new BadRequestException("Category with this name already exists.");
    }

    const category = await this.model.create({ data: input });

    return {
      id: category.id,
      name: category.name,
      description: category.description ?? null,
      created_at: category.createdAt,
      updated_at: category.updatedAt,
    };
  }

  public async update(
    id: string,
    input: Partial<CreateCategoryDto>
  ): Promise<GetCategoryDto> {
    const category = await this.model.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException("Category not found.");
    }

    const updated = await this.model.update({
      data: input,
      where: { id },
    });

    return {
      id: updated.id,
      name: updated.name,
      description: updated.description ?? null,
      created_at: updated.createdAt,
      updated_at: updated.updatedAt,
    };
  }

  public async delete(id: string): Promise<void> {
    const category = await this.model.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException("Category not found.");
    }

    await this.model.softDelete({ id });
  }
}
