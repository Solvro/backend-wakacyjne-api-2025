import { Response } from "express";
import { Readable } from "node:stream";

import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { PhotoResponseDTO } from "./dto/response-photo.dto";
import { PhotosService } from "./photos.service";

@ApiTags("Photos")
@Controller("photos")
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post("upload")
  @ApiOperation({
    summary: "Upload a photo",
    description: `Uploads a photo file to the server. Returns metadata including the generated filename.`,
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({ status: 201, type: PhotoResponseDTO })
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor("file"))
  uploadPhoto(@UploadedFile() file: Express.Multer.File): PhotoResponseDTO {
    return this.photosService.uploadPhoto(file);
  }

  @Get(":filename")
  @ApiOkResponse()
  @ApiOperation({ summary: "Download a photo" })
  getPhoto(
    @Param("filename") filename: string,
    @Res({ passthrough: true }) response: Response,
  ): StreamableFile {
    const { stream } = this.photosService.getPhotoStream(filename);
    const readable = Readable.from(stream);
    const mimeType = this.photosService.getMimeType(filename);

    response.set({
      "Content-Type": mimeType,
      "Content-Disposition": `inline; filename="${filename}"`,
    });

    return new StreamableFile(readable);
  }

  @Delete(":filename")
  @ApiOkResponse({})
  @ApiOperation({ summary: "Delete a photo" })
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePhoto(@Param("filename") filename: string) {
    this.photosService.deletePhoto(filename);

    return {};
  }
}
