import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

import { Injectable } from "@nestjs/common";

import { nullToUndefined } from "./utils/null-to-undefined";

@Injectable()
export class PlacesService {
  constructor(private prisma: PrismaService) {}

  async create(
    userEmail: string,
    {
      name,
      description,
      imageUrl,
      isFavourite,
    }: Prisma.PlaceCreateWithoutOwnerInput,
  ) {
    const result = await this.prisma.place.create({
      data: {
        name,
        description,
        imageUrl,
        isFavourite,
        owner: {
          connect: {
            email: userEmail,
          },
        },
      },
    });

    return nullToUndefined(result);
  }

  async findAll() {
    return nullToUndefined(await this.prisma.place.findMany());
  }

  async findMany(parameters: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PlaceWhereUniqueInput;
    where?: Prisma.PlaceWhereInput;
    orderBy?: Prisma.PlaceOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = parameters;
    const result = await this.prisma.place.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });

    return nullToUndefined(result);
  }

  async findOne(where: Prisma.PlaceWhereUniqueInput) {
    return nullToUndefined(await this.prisma.place.findUnique({ where }));
  }

  async update(
    where: Prisma.PlaceWhereUniqueInput,
    data: Prisma.PlaceUpdateWithoutOwnerInput,
  ) {
    return nullToUndefined(await this.prisma.place.update({ where, data }));
  }

  async remove(where: Prisma.PlaceWhereUniqueInput) {
    return nullToUndefined(await this.prisma.place.delete({ where }));
  }

  async count(where: Prisma.PlaceWhereInput) {
    return nullToUndefined(await this.prisma.place.count({ where }));
  }
}
