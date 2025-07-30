//ze względu na korzystanie ze swaggera, prismy i zoda:
//  nie da sie zrobić fajnych połączeń zod - swagger - nest, bo @ApiProperty, a w nestjs-zod createZodDTO czy coś podobnego nie działa
//  z prismowych typów nie da się zrobić typów z @ApiProperty, więc trzeba z ręki pisać, aby swagger udokumentował
//najszybciej jak to można robić, to po prostu kopiować typy z prismy z podświetlania i je zamieniać na klasy DTO
import type { Place as PlaceModel } from "@prisma/client";
import { z } from "zod";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export const createPlaceSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  isFavourite: z.boolean().optional(),
});

export class PlaceCreateWithoutOwnerInputDTO {
  @ApiProperty({
    description: "Name of the destination",
    example: "Santorini Sunset View",
    required: true,
  })
  name: string;

  @ApiPropertyOptional({
    description: "Detailed description",
    example:
      "Beautiful sunset views over the caldera with whitewashed buildings",
  })
  description?: string;

  @ApiPropertyOptional({
    description: "URL to an image",
    example: "https://example.com/santorini-sunset.jpg",
    format: "uri",
  })
  imageUrl?: string;

  @ApiPropertyOptional({
    description: "Marks place as favourite",
    example: "true",
  })
  isFavourite?: boolean;
}

export const updatePlaceSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  isFavourite: z.boolean().optional(),
});

export class PlaceUpdateWithoutOwnerInputDTO {
  @ApiPropertyOptional({
    description: "Updated name of the travel destination",
    example: "Santorini Caldera Sunset",
  })
  name?: string;

  @ApiPropertyOptional({
    description: "Updated description",
    example: "Stunning sunset views from Oia village with blue dome churches",
  })
  description?: string;

  @ApiPropertyOptional({
    description: "Updated image URL for the destination",
    example: "https://example.com/santorini-caldera.jpg",
    format: "uri",
  })
  imageUrl?: string;

  @ApiPropertyOptional({
    description: "Marks place as favourite",
    example: "true",
  })
  isFavourite?: boolean;
}

export class PlaceResponseDTO implements Partial<PlaceModel> {
  @ApiProperty({
    description: "Unique identifier of the travel place",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "Name of the travel destination",
    example: "Santorini Sunset View",
  })
  name: string;

  @ApiPropertyOptional({
    description: "Detailed description",
    example:
      "Beautiful sunset views over the caldera with whitewashed buildings",
  })
  description?: string;

  @ApiPropertyOptional({
    description: "Image URL for the destination",
    example: "https://example.com/santorini-sunset.jpg",
    format: "uri",
  })
  imageUrl?: string;

  @ApiPropertyOptional({
    description: "Marks place as favourite",
    example: "true",
  })
  isFavourite?: boolean;

  @ApiProperty({
    description: "Email of the user",
    example: "traveler@example.com",
  })
  ownerEmail: string;
}
