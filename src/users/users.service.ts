import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async find(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({ where });
  }

  async update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ) {
    return this.prisma.user.update({ where, data });
  }

  async delete(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.delete({ where });
  }
}
