import {
  createReadStream,
  existsSync,
  mkdirSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
// inaczej nie działa lol (albo import { join } from "node:path";)
// eslint-disable-next-line unicorn/import-style
import * as path from "node:path";
import { v4 as uuidv4 } from "uuid";

import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

import { PhotoResponseDTO } from "./dto/response-photo.dto";
import {
  COMMON_PHOTO_MIME_TYPES,
  DEFAULT_MIME_TYPE,
  PHOTO_MIME_MAP,
  PhotoExtension,
  PhotoMimeType,
  getFileExtension,
  isCommonPhotoType,
} from "./photo-utilities";
import { PHOTO_UPLOAD_CONFIG, PhotoUploadConfig } from "./photos.constants";

@Injectable()
export class PhotosService {
  constructor(
    @Inject(PHOTO_UPLOAD_CONFIG) private readonly config: PhotoUploadConfig,
  ) {
    if (!existsSync(this.config.uploadDirectory)) {
      mkdirSync(this.config.uploadDirectory, { recursive: true });
    }
  }

  uploadPhoto(file: Express.Multer.File): PhotoResponseDTO {
    if (typeof file !== "object") {
      throw new BadRequestException("No file was uploaded");
    }

    if (typeof file.mimetype !== "string" || !file.mimetype) {
      throw new BadRequestException("Invalid file MIME type");
    }

    if (typeof file.originalname !== "string" || !file.originalname) {
      throw new BadRequestException("Invalid file name");
    }

    if (!Buffer.isBuffer(file.buffer)) {
      throw new BadRequestException("Invalid file content");
    }

    if (!isCommonPhotoType(file.mimetype)) {
      throw new BadRequestException(
        `Unsupported photo type. Allowed types: ${COMMON_PHOTO_MIME_TYPES.join(", ")}`,
      );
    }

    if (typeof file.size !== "number" || file.size <= 0) {
      throw new BadRequestException("Invalid file size");
    }

    if (file.size > this.config.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum of ${this.config.maxFileSize.toString()} bytes`,
      );
    }

    try {
      const fileId = uuidv4();
      const extension = getFileExtension(file.mimetype);
      const filename = `${fileId}.${extension}`;
      const filePath = path.join(this.config.uploadDirectory, filename);

      if (!existsSync(this.config.uploadDirectory)) {
        mkdirSync(this.config.uploadDirectory, { recursive: true });
      }

      writeFileSync(filePath, file.buffer);

      return {
        id: fileId,
        filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: filePath,
        createdAt: new Date(),
      };
    } catch {
      throw new InternalServerErrorException("Failed to save the photo");
    }
  }

  getAllUploadedPhotos(): string[] {
    const filesDirectory = this.config.uploadDirectory;

    return readdirSync(filesDirectory, "utf8");
  }

  existsPhoto(filename: string): boolean {
    let filePath = "";
    try {
      filePath = path.join(this.config.uploadDirectory, filename);
    } catch {
      throw new NotFoundException("Photo not found");
    }

    if (!existsSync(filePath)) {
      throw new NotFoundException("Photo not found");
    }

    return true;
  }

  getPhotoStream(filename: string): {
    stream: NodeJS.ReadableStream;
    mimeType: string;
  } {
    let filePath = "";
    try {
      filePath = path.join(this.config.uploadDirectory, filename);
    } catch {
      throw new NotFoundException("Photo not found");
    }

    if (!existsSync(filePath)) {
      throw new NotFoundException("Photo not found");
    }

    const stream = createReadStream(filePath);
    const mimeType = this.getMimeType(filename);

    return { stream, mimeType };
  }

  deletePhoto(filename: string): void {
    const filePath = path.join(this.config.uploadDirectory, filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException("Photo not found");
    }

    unlinkSync(filePath);
  }

  getMimeType(filename: string): PhotoMimeType | typeof DEFAULT_MIME_TYPE {
    const extension = filename.split(".").pop()?.toLowerCase() as
      | PhotoExtension
      | undefined;

    if (extension) {
      return PHOTO_MIME_MAP[extension];
    }

    return DEFAULT_MIME_TYPE;
  }
}
