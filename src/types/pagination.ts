/**
 * Shared pagination types for the application
 */

// Pagination metadata
export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Generic paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationInfo
}

// Pagination query parameters
export interface PaginationParams {
  page?: number
  limit?: number
}
