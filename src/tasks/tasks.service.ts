import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

import { Injectable } from "@nestjs/common";

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(
    userEmail: string,
    { content, done }: Prisma.TaskCreateWithoutOwnerInput,
  ) {
    return this.prisma.task.create({
      data: {
        content,
        done,
        owner: {
          connect: {
            email: userEmail,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.task.findMany();
  }

  async findMany(parameters: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TaskWhereUniqueInput;
    where?: Prisma.TaskWhereInput;
    orderBy?: Prisma.TaskOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = parameters;
    return this.prisma.task.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(where: Prisma.TaskWhereUniqueInput) {
    return this.prisma.task.findUnique({ where });
  }

  async update(
    where: Prisma.TaskWhereUniqueInput,
    data: Prisma.TaskUpdateInput,
  ) {
    return this.prisma.task.update({ where, data });
  }

  async remove(where: Prisma.TaskWhereUniqueInput) {
    return this.prisma.task.delete({ where });
  }

  async count(where: Prisma.TaskWhereInput) {
    return this.prisma.task.count({ where });
  }
}
