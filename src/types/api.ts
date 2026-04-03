import type {ApiResponse} from '@/lib/api-response';

export type ServerActionResult<T> = Promise<ApiResponse<T>>;

export interface QueryPagination {
  page?: number;
  limit?: number;
}

export interface SearchQuery {
  search?: string;
}
