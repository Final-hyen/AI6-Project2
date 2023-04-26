// 일반적인 응답 정의
export interface AppResponse<T> {
  data: T | null;
  errorMessage: string | null;
}

// 페이지네이션 기반의 응답 타입 정의
export interface AppPaginatedResponse<T> {
  totalPages: number;
  totalElements: number;
  page: number;
  elements: number;
  data: T[];
}
