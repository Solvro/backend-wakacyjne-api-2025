//ze względu na generowanie dokumentacji swaggerem i chęć korzystania z zoda, na ten moment nie ma fajnych solucji na połączenie tego...
import { z } from "zod";

import { ApiProperty } from "@nestjs/swagger";

export const authSchema = z
  .object({ email: z.email(), password: z.string() })
  .required();

export class AuthDto {
  @ApiProperty({
    example: "test@gmail.com",
    description: "Email address of the registered user",
  })
  email: string;

  @ApiProperty({ example: "strongPassword123", description: "User password" })
  password: string;
}
