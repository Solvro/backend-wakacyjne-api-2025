import * as bcrypt from "bcrypt";

import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { UsersService } from "../users/users.service";
import { bcryptConstants } from "./constants";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.find({ email });

    if (user === null) {
      throw new NotFoundException();
    }

    const result = await bcrypt.compare(password, user.hashedPassword);

    if (!result) {
      throw new UnauthorizedException("Wrong password");
    }

    const refreshToken = await this.getRefreshToken(user.id);

    const payload = { email: user.email };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken,
    };
  }

  async register(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const existingUser = await this.usersService.find({ email });
    if (existingUser !== null) {
      throw new ConflictException("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, bcryptConstants.rounds);

    const user = await this.usersService.create({
      email,
      hashedPassword,
    });

    const refreshToken = await this.getRefreshToken(user.id);

    const payload = { email: user.email };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken,
    };
  }

  private async getRefreshToken(userId: number): Promise<string> {
    const refreshTokenInDatabase = await this.usersService.find({ id: userId });

    //zepsuty lint :)
    if (
      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      refreshTokenInDatabase !== null &&
      refreshTokenInDatabase.refreshToken !== null
    ) {
      return refreshTokenInDatabase.refreshToken;
    }

    const refreshToken = this.jwtService.sign({}, { expiresIn: "7d" });

    await this.usersService.update(
      { id: userId },
      {
        refreshToken,
      },
    );

    return refreshToken;
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      await this.jwtService.verifyAsync(refreshToken);

      const user = await this.usersService.find({ refreshToken });

      if (user === null) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const payload = { email: user.email };

      return {
        accessToken: this.jwtService.sign(payload),
      };
    } catch {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }
  }
}
