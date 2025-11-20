import dbImport from "@newsletter-io/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { CreateUserDto } from "./dto/create.user.dto";
import {
  GetUserDto,
  ListUsersDto,
  ListUsersInput,
  userRole,
} from "./dto/get.user.dto";
import { BadRequestException } from "@/exceptions/BadRequestException";
import { NotFoundException } from "@/exceptions/NotFoundException";

const db = (dbImport as any).default || dbImport;

export default class UserService {
  private readonly model = db.user;

  constructor() {}

  public async getAllUsers(
    user: Express.UserPayload,
    { page, limit }: ListUsersInput
  ): Promise<ListUsersDto> {
    if (user.role !== userRole.ADMIN) {
      throw new BadRequestException("No role permission");
    }

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
      data: data.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      })),
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  public async getUserById(id: string): Promise<GetUserDto> {
    const user = await this.model.findUnique({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException("User not found.");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }

  public async createUser(input: CreateUserDto): Promise<GetUserDto> {
    const existingUser = await this.model.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new BadRequestException("User with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await this.model.create({
      data: {
        ...input,
        password: hashedPassword,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }

  public async login(input: {
    email: string;
    password: string;
  }): Promise<{ token: string; type: string; expires_in: number }> {
    const user = await this.model.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new BadRequestException("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException("Invalid email or password.");
    }

    const token = jwt.sign(
      {
        sub: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    return {
      token: token,
      type: "Bearer",
      expires_in: 3600,
    };
  }

  public async deleteUser(
    user: Express.UserPayload,
    id: string
  ): Promise<void> {
    if (!user || user.role !== userRole.ADMIN) {
      throw new BadRequestException("No role permission");
    }

    const existingUser = await this.model.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException("User not found");
    }

    if (existingUser.role === userRole.ADMIN) {
      const totalUsersAdmin = await this.model.count({
        where: { role: userRole.ADMIN },
      });

      if (totalUsersAdmin === 1) {
        throw new BadRequestException("Cannot delete the last admin user");
      }
    }

    await this.model.softDelete({ id });
  }
}
