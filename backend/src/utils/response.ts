export type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  pagination?: any;
  error?: any;
};

export const createSuccessResponse = <T>(
  message: string,
  data?: T,
  pagination?: any
): ApiResponse<T> => ({
  success: true,
  message,
  data,
  pagination,
});

export const createErrorResponse = (
  message: string,
  error?: any
): ApiResponse => ({
  success: false,
  message,
  error,
});