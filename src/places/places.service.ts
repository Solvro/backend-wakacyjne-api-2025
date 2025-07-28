import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

import { Injectable } from "@nestjs/common";

@Injectable()
export class PlacesService {
  constructor(private prisma: PrismaService) {}

  async create(
    userEmail: string,
    { name, description, imageUrl }: Prisma.PlaceCreateWithoutOwnerInput,
  ) {
    return this.prisma.place.create({
      data: {
        name,
        description,
        imageUrl,
        owner: {
          connect: {
            email: userEmail,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.place.findMany();
  }

  async findMany(parameters: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PlaceWhereUniqueInput;
    where?: Prisma.PlaceWhereInput;
    orderBy?: Prisma.PlaceOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = parameters;
    return this.prisma.place.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(where: Prisma.PlaceWhereUniqueInput) {
    return this.prisma.place.findUnique({ where });
  }

  async update(
    where: Prisma.PlaceWhereUniqueInput,
    data: Prisma.PlaceUpdateWithoutOwnerInput,
  ) {
    return this.prisma.place.update({ where, data });
  }

  async remove(where: Prisma.PlaceWhereUniqueInput) {
    return this.prisma.place.delete({ where });
  }

  async count(where: Prisma.PlaceWhereInput) {
    return this.prisma.place.count({ where });
  }
}
