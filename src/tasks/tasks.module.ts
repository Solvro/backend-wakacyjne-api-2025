import { PrismaService } from "src/prisma/prisma.service";

import { Module } from "@nestjs/common";

import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService],
})
export class TasksModule {}
