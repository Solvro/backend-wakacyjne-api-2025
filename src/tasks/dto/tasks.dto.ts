//ze względu na korzystanie ze swaggera, prismy i zoda:
//  nie da sie zrobić fajnych połączeń zod - swagger - nest, bo @ApiProperty, a w nestjs-zod createZodDTO czy coś podobnego nie działa
//  z prismowych typów nie da się zrobić typów z @ApiProperty, więc trzeba z ręki pisać, aby swagger udokumentował
//najszybciej jak to można robić, to po prostu kopiować typy z prismy z podświetlania i je zamieniać na klasy DTO
import { Task as TaskModel } from "@prisma/client";
import { z } from "zod";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export const createTaskSchema = z.object({
  content: z.string(),

  done: z.boolean().optional(),
});

export class TaskCreateWithoutOwnerInputDTO {
  @ApiProperty({
    description: "Content to be put inside task in todo list",
  })
  content: string;

  @ApiPropertyOptional({
    description: "Is this task done",
  })
  done?: boolean;
}

export const updateTaskSchema = z.object({
  content: z.string().optional(),
  done: z.boolean().optional(),
});

export class TaskUpdateWithoutOwnerInputDTO {
  @ApiPropertyOptional({
    description: "Content to be put inside task in todo list",
  })
  content?: string;

  @ApiPropertyOptional({
    description: "Is this task done",
  })
  done?: boolean;
}

export class TaskResponseDTO implements Partial<TaskModel> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  done: boolean;

  @ApiProperty()
  ownerEmail: string;
}
