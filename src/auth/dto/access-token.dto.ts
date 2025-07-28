import { ApiProperty } from "@nestjs/swagger";

export class AccessTokenDTO {
  @ApiProperty({
    description: "Access token to be used for accessing API",
  })
  accessToken: string;
}
