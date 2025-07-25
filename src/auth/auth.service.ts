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
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.find({ email });

    if (user === null) {
      throw new NotFoundException();
    }

    const result = await bcrypt.compare(password, user.hashedPassword);

    if (!result) {
      throw new UnauthorizedException("Wrong password");
    }

    const payload = { email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const existingUser = await this.usersService.find({ email });
    if (existingUser !== null) {
      throw new ConflictException("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, bcryptConstants.rounds);

    const user = await this.usersService.create({
      email,
      hashedPassword,
    });

    const payload = { email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
