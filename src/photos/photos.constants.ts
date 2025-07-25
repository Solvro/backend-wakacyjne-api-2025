// inaczej nie działa lol (albo import { join } from "node:path";)
// eslint-disable-next-line unicorn/import-style
import * as path from "node:path";

import { COMMON_PHOTO_MIME_TYPES } from "./photo-utilities";

export const PHOTO_UPLOAD_CONFIG = "PHOTO_UPLOAD_CONFIG";

export interface PhotoUploadConfig {
  uploadDirectory: string;
  maxFileSize: number;
  allowedMimeTypes: typeof COMMON_PHOTO_MIME_TYPES;
}

export const DEFAULT_PHOTO_CONFIG: PhotoUploadConfig = {
  uploadDirectory: path.join(process.cwd(), "uploads", "photos"),
  maxFileSize: 5 * 1024 * 1024,
  allowedMimeTypes: [...COMMON_PHOTO_MIME_TYPES],
};
