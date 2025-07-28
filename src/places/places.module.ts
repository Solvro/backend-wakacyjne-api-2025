import { PhotosModule } from "src/photos/photos.module";
import { PrismaService } from "src/prisma/prisma.service";

import { Module } from "@nestjs/common";

import { PlacesController } from "./places.controller";
import { PlacesService } from "./places.service";

@Module({
  controllers: [PlacesController],
  providers: [PlacesService, PrismaService],
  imports: [PhotosModule],
})
export class PlacesModule {}
