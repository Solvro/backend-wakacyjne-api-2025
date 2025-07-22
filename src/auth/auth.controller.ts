import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";

import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import { CustomRequest } from "./dto/request.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async signIn(@Body() signInDto: AuthDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("register")
  async register(@Body() signInDto: AuthDto) {
    return this.authService.register(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get("me")
  getProfile(@Request() request: CustomRequest) {
    return request.user;
  }
}
