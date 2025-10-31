import db from "@newsletter-io/db";
import bcrypt from "bcryptjs";
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
}
