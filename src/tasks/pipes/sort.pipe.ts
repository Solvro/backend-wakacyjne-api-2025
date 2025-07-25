import type { PipeTransform } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common";

export class SortPipe implements PipeTransform {
  transform(value: unknown) {
    if (!(value === "asc" || value === "desc" || value === undefined)) {
      throw new BadRequestException("Validation failed");
    }
    return value;
  }
}
