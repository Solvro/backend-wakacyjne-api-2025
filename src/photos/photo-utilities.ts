export type PhotoExtension =
  | "jpg"
  | "jpeg"
  | "png"
  | "gif"
  | "webp"
  | "svg"
  | "bmp"
  | "tiff";

export type PhotoMimeType =
  | "image/jpeg"
  | "image/png"
  | "image/gif"
  | "image/webp"
  | "image/svg+xml"
  | "image/bmp"
  | "image/tiff";

export const PHOTO_MIME_MAP: Record<PhotoExtension, PhotoMimeType> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  bmp: "image/bmp",
  tiff: "image/tiff",
} as const;

export const DEFAULT_MIME_TYPE = "application/octet-stream" as const;

export const COMMON_PHOTO_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
] as const;

export type CommonPhotoMimeType = (typeof COMMON_PHOTO_MIME_TYPES)[number];

export function isCommonPhotoType(
  mimeType: string,
): mimeType is CommonPhotoMimeType {
  return (COMMON_PHOTO_MIME_TYPES as readonly string[]).includes(mimeType);
}

export function getFileExtension(mimeType: CommonPhotoMimeType): string {
  const extensionMap: Record<CommonPhotoMimeType, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
  };
  return extensionMap[mimeType];
}
