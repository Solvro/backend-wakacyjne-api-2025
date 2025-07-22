import { ApiProperty } from "@nestjs/swagger";

export class AuthDto {
  @ApiProperty({
    example: "test@gmail.com",
    description: "Email address of the registered user",
  })
  email: string;

  @ApiProperty({ example: "strongPassword123", description: "User password" })
  password: string;
}
