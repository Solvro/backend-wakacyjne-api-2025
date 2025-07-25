import { Prisma, Task } from "@prisma/client";
import { AuthGuard } from "src/auth/auth.guard";
import { CustomRequest } from "src/auth/dto/request.dto";
import { ZodValidationPipe } from "src/zod-validation/zod-validation.pipe";

import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { PaginatedDTO } from "./dto/paginated.dto";
import {
  TaskCreateWithoutOwnerInputDTO,
  TaskResponseDTO,
  TaskUpdateWithoutOwnerInputDTO,
  createTaskSchema,
  updateTaskSchema,
} from "./dto/tasks.dto";
import { TasksService } from "./tasks.service";

@ApiTags()
@UseGuards(AuthGuard)
@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createTaskSchema))
  @ApiOkResponse()
  @ApiOperation({
    summary: "Create a new task",
    description: "Add new task for logged in user",
  })
  async create(
    @Request() request: CustomRequest,
    @Body() data: TaskCreateWithoutOwnerInputDTO,
  ) {
    return this.tasksService.create(request.user.email, data);
  }

  @Get()
  @ApiOkResponse({ type: PaginatedDTO<Task> })
  @ApiOperation({
    summary: "Get paginated tasks with filtering",
    description:
      "Find with pagination, filtering and sorting tasks for current logged in user",
  })
  async findMany(
    @Request() request: CustomRequest,
    @Query("page", new ParseIntPipe({ optional: true })) page = 0,
    @Query("perPage", new ParseIntPipe({ optional: true })) perPage = 10,
    @Query("sort") sort: "asc" | "desc" = "asc",
    @Query() query: Record<string, unknown>,
    @Query("sortBy") sortBy?: [keyof Task],
  ): Promise<PaginatedDTO<Task>> {
    const validTaskProperties = new Set<keyof Task>([
      "content",
      "done",
      "id",
      "ownerEmail",
    ]);

    let orderBy: Record<string, "asc" | "desc"> | undefined;
    if (
      sortBy !== undefined &&
      validTaskProperties.has(sortBy as unknown as keyof Task)
    ) {
      orderBy = { [sortBy as unknown as string]: sort };
    }

    const where: Prisma.TaskWhereInput = {
      ownerEmail: request.user.email,
    };

    for (const [key, value] of Object.entries(query)) {
      if (validTaskProperties.has(key as keyof Task)) {
        if (key === "done") {
          where[key] = value === "true";
        } else if (key === "id") {
          where[key] = Number(value);
        } else {
          where[key] = value;
        }
      }
    }

    const total = await this.tasksService.count(where);

    const results = await this.tasksService.findMany({
      skip: page * perPage,
      take: perPage,
      orderBy,
      where,
    });

    return {
      total,
      page,
      perPage,
      results,
    };
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get a specific task",
    description:
      "Retrieves a task by ID. Users can only access their own tasks.",
  })
  @ApiResponse({
    status: 200,
    description: "Task found",
    type: TaskResponseDTO,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Task belongs to another user",
  })
  @ApiResponse({ status: 404, description: "Task not found" })
  async findOne(
    @Param("id", ParseIntPipe) id: number,
    @Request() request: CustomRequest,
  ) {
    const task = await this.tasksService.findOne({ id });

    if (task === null) {
      throw new NotFoundException("Task not found");
    }

    if (task.ownerEmail !== request.user.email) {
      throw new ForbiddenException("You can only access your own tasks");
    }
    return task;
  }

  @Put(":id")
  @UsePipes(new ZodValidationPipe(updateTaskSchema))
  @ApiOperation({
    summary: "Update a task",
    description: "Updates a task by ID. Users can only update their own tasks.",
  })
  @ApiResponse({
    status: 200,
    description: "Task updated",
    type: TaskResponseDTO,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Task belongs to another user",
  })
  @ApiResponse({ status: 404, description: "Task not found" })
  async update(
    @Request() request: CustomRequest,
    @Body() data: TaskUpdateWithoutOwnerInputDTO,
    @Param("id", ParseIntPipe) id: number,
  ) {
    const task = await this.tasksService.findOne({ id });

    if (task === null) {
      throw new NotFoundException("Task not found");
    }

    if (task.ownerEmail !== request.user.email) {
      throw new ForbiddenException("You can only update your own tasks");
    }

    return this.tasksService.update({ id }, data);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete a task",
    description: "Deletes a task by ID. Users can only delete their own tasks.",
  })
  @ApiResponse({
    status: 204,
    description: "Task deleted",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Task belongs to another user",
  })
  @ApiResponse({ status: 404, description: "Task not found" })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Request() request: CustomRequest,
    @Param("id", ParseIntPipe) id: number,
  ) {
    const task = await this.tasksService.findOne({ id });

    if (task === null) {
      throw new NotFoundException("Task not found");
    }

    if (task.ownerEmail !== request.user.email) {
      throw new ForbiddenException("You can only delete your own tasks");
    }

    await this.tasksService.remove({ id });

    return {};
  }
}
