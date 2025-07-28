import { Place, Prisma } from "@prisma/client";
import { AuthGuard } from "src/auth/auth.guard";
import { CustomRequest } from "src/auth/dto/request.dto";
import { PhotosService } from "src/photos/photos.service";
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
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { PaginatedDTO } from "./dto/paginated.dto";
import {
  PlaceCreateWithoutOwnerInputDTO,
  PlaceResponseDTO,
  PlaceUpdateWithoutOwnerInputDTO,
  createPlaceSchema,
  updatePlaceSchema,
} from "./dto/places.dto";
import { PlacesService } from "./places.service";

@ApiTags("places")
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller("places")
export class PlacesController {
  constructor(
    private readonly placesService: PlacesService,
    private readonly photosService: PhotosService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createPlaceSchema))
  @ApiOkResponse({ type: PlaceResponseDTO })
  @ApiOperation({
    summary: "Create a new travel place",
    description: "Add a new travel destination for the logged in user",
  })
  @ApiResponse({
    status: 201,
    description: "Place created",
    type: PlaceResponseDTO,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 404,
    description: "Photo not found in uploaded photos",
  })
  async create(
    @Request() request: CustomRequest,
    @Body() data: PlaceCreateWithoutOwnerInputDTO,
  ): Promise<PlaceResponseDTO> {
    if (
      data.imageUrl !== null &&
      !this.photosService.existsPhoto(data.imageUrl)
    ) {
      throw new NotFoundException("Photo not found in uploaded photos");
    }

    return this.placesService.create(request.user.email, data);
  }

  @Get()
  @ApiOkResponse({ type: PaginatedDTO<Place> })
  @ApiOperation({
    summary: "Get paginated travel places with filtering",
    description:
      "Find with pagination, filtering and sorting travel destinations for current logged in user",
  })
  async findMany(
    @Request() request: CustomRequest,
    @Query("page", new ParseIntPipe({ optional: true })) page = 0,
    @Query("perPage", new ParseIntPipe({ optional: true })) perPage = 10,
    @Query("sort") sort: "asc" | "desc" = "asc",
    @Query() query: Record<string, unknown>,
    @Query("sortBy") sortBy?: [keyof Place],
  ): Promise<PaginatedDTO<Place>> {
    const validPlaceProperties = new Set<keyof Place>([
      "name",
      "description",
      "id",
      "ownerEmail",
      "imageUrl",
    ]);

    let orderBy: Record<string, "asc" | "desc"> | undefined;
    if (
      sortBy !== undefined &&
      validPlaceProperties.has(sortBy as unknown as keyof Place)
    ) {
      orderBy = { [sortBy as unknown as string]: sort };
    }

    const where: Prisma.PlaceWhereInput = {
      ownerEmail: request.user.email,
    };

    for (const [key, value] of Object.entries(query)) {
      if (validPlaceProperties.has(key as keyof Place)) {
        where[key] = key === "id" ? Number(value) : value;
      }
    }

    const total = await this.placesService.count(where);

    const results = await this.placesService.findMany({
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
    summary: "Get a specific travel place",
    description:
      "Retrieves a travel destination by ID. Users can only access their own places.",
  })
  @ApiResponse({
    status: 200,
    description: "Place found",
    type: PlaceResponseDTO,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Place belongs to another user",
  })
  @ApiResponse({ status: 404, description: "Place not found" })
  async findOne(
    @Param("id", ParseIntPipe) id: number,
    @Request() request: CustomRequest,
  ): Promise<PlaceResponseDTO> {
    const place = await this.placesService.findOne({ id });

    if (place === null) {
      throw new NotFoundException("Place not found");
    }

    if (place.ownerEmail !== request.user.email) {
      throw new ForbiddenException(
        "You can only access your own travel places",
      );
    }
    return place;
  }

  @Put(":id")
  @UsePipes(new ZodValidationPipe(updatePlaceSchema))
  @ApiOperation({
    summary: "Update a travel place",
    description:
      "Updates a travel destination by ID. Users can only update their own places.",
  })
  @ApiResponse({
    status: 200,
    description: "Place updated",
    type: PlaceResponseDTO,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Place belongs to another user",
  })
  @ApiResponse({ status: 404, description: "Place not found" })
  @ApiResponse({
    status: 404,
    description: "Photo not found in uploaded photos",
  })
  async update(
    @Request() request: CustomRequest,
    @Body() data: PlaceUpdateWithoutOwnerInputDTO,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<PlaceResponseDTO> {
    const place = await this.placesService.findOne({ id });

    if (place === null) {
      throw new NotFoundException("Place not found");
    }

    if (place.ownerEmail !== request.user.email) {
      throw new ForbiddenException(
        "You can only update your own travel places",
      );
    }

    if (
      data.imageUrl !== null &&
      !this.photosService.existsPhoto(data.imageUrl)
    ) {
      throw new NotFoundException("Photo not found in uploaded photos");
    }

    return this.placesService.update(
      { id },
      {
        name: data.name ?? undefined,
        description: data.description ?? undefined,
        imageUrl: data.imageUrl ?? undefined,
      },
    );
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete a travel place",
    description:
      "Deletes a travel destination by ID. Users can only delete their own places.",
  })
  @ApiResponse({
    status: 204,
    description: "Place deleted",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Place belongs to another user",
  })
  @ApiResponse({ status: 404, description: "Place not found" })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Request() request: CustomRequest,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<void> {
    const place = await this.placesService.findOne({ id });

    if (place === null) {
      throw new NotFoundException("Place not found");
    }

    if (place.ownerEmail !== request.user.email) {
      throw new ForbiddenException(
        "You can only delete your own travel places",
      );
    }

    await this.placesService.remove({ id });
  }
}
