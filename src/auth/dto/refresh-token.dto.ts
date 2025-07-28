import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenDTO {
  @ApiProperty({
    description: "Refresh token that is used to get access token",
  })
  refreshToken: string;
}
