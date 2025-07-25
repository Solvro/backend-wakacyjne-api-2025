import { z } from "zod";

import type { PipeTransform } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodType) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof z.ZodError) {
        //tutaj dodać coś ala wyświetlanie błędu zodowego
        throw new BadRequestException("Validation failed");
      }
    }
  }
}
