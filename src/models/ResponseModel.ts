export interface PaginateResponse {
  limit: number;
  offset: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[] | T;  // Can be either an array or a single object
  paginate: PaginateResponse;
}

export interface ItemResponse<T> {
  success: boolean;
  data: T;
}

export function createPaginateResponse<T>(
  data: T[],
  total: number,
  limit: number,
  offset: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);
  return {
    success: true,
    data: data.length === 1 ? data[0] : data,  // Return data as object if single, otherwise array
    paginate: {
      limit,
      offset,
      total,
      totalPages,
    },
  };
}

export function createItemResponse<T>(
  data: T,
): ItemResponse<T> {
  return {
    success: true,
    data: data
    }
}
