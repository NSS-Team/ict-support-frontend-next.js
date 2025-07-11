// a typescript generic type for the api response
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};
