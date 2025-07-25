import { ApiProperty } from "@nestjs/swagger";

export class MeDTO {
  @ApiProperty({
    example: "test@gmail.com",
    description: "Email address of the registered user",
  })
  email: string;

  @ApiProperty()
  iat: number;

  @ApiProperty()
  exp: number;
}
