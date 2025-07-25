import { Module } from "@nestjs/common";

import { DEFAULT_PHOTO_CONFIG, PHOTO_UPLOAD_CONFIG } from "./photos.constants";
import { PhotosController } from "./photos.controller";
import { PhotosService } from "./photos.service";

@Module({
  controllers: [PhotosController],
  providers: [
    PhotosService,
    {
      provide: PHOTO_UPLOAD_CONFIG,
      useValue: DEFAULT_PHOTO_CONFIG,
    },
  ],
  exports: [PhotosService],
})
export class PhotosModule {}
