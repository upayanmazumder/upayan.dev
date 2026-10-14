// Cross-cutting TS types. Feature-local types stay colocated with their feature.

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export interface ApiErrorData {
  message: string;
  code?: string;
  details?: unknown;
  status?: number;
}
