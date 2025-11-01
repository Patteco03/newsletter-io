import db from "@newsletter-io/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { CreateUserDto } from "./dto/create.user.dto";
import { GetUserDto } from "./dto/get.user.dto";
import { BadRequestException } from "@/exceptions/BadRequestException";

export default class UserService {
  constructor(private readonly model: typeof db.user = db.user) {}

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

    const token = jwt.sign({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }, process.env.JWT_SECRET as string, {
      expiresIn:  "1h",
    });

    return {
      token: token,
      type: "Bearer",
      expires_in: 3600,
    };
  }
}
