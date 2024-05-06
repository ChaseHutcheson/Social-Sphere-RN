export interface ApiResponse<T> {
  isSuccessful: boolean;
  data?: T;
  error?: string;
}

export const createErrorResponse = (
  error: any
): ApiResponse<{ isSuccessful: boolean; data: any | null; error: any }> => {
  return {
    isSuccessful: false,
    data: null as any,
    error: error,
  };
};
