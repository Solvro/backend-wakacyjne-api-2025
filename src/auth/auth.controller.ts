import { ZodValidationPipe } from "src/zod-validation/zod-validation.pipe";

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { AuthDto, authSchema } from "./dto/auth.dto";
import { MeDTO } from "./dto/me.dto";
import { CustomRequest } from "./dto/request.dto";

@ApiTags()
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(authSchema))
  @Post("login")
  @ApiOperation({
    summary: "User login",
    description: "Authenticates user and returns access token",
  })
  @ApiBody({
    type: AuthDto,
    description: "User credentials",
    examples: {
      example1: {
        summary: "Sample login",
        value: {
          email: "user@example.com",
          password: "securePassword123",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Successfully logged in",
    schema: {
      example: {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Invalid request body or validation failed",
  })
  @ApiResponse({
    status: 401,
    description: "Invalid credentials",
  })
  async signIn(@Body() signInDto: AuthDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(authSchema))
  @Post("register")
  @ApiOperation({
    summary: "User registration",
    description: "Creates a new user account",
  })
  @ApiBody({
    type: AuthDto,
    description: "New user details",
    examples: {
      example1: {
        summary: "Sample registration",
        value: {
          email: "newuser@example.com",
          password: "securePassword123",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "User successfully registered",
    schema: {
      example: {
        id: 1,
        email: "user@example.com",
        createdAt: "2023-01-01T00:00:00.000Z",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Invalid request body or validation failed",
  })
  @ApiResponse({
    status: 409,
    description: "User with this email already exists",
  })
  async register(@Body() signInDto: AuthDto) {
    return this.authService.register(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get("me")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get current user profile",
    description: "Returns authenticated user profile data",
  })
  @ApiResponse({
    status: 200,
    description: "User profile retrieved successfully",
    type: MeDTO,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Missing or invalid token",
  })
  getProfile(@Request() request: CustomRequest) {
    return request.user;
  }
}
