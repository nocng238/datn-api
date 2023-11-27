export class Meta {
  totalItems: number;
  itemCount: number;
  limit: number;
  offset: number;
}

export class PaginationResponseDto {
  meta: Meta;
}
