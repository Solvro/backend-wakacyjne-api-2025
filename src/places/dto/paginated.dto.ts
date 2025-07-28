import { ApiProperty } from "@nestjs/swagger";

export class PaginatedDTO<TData> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  perPage: number;

  results: TData[];
}
