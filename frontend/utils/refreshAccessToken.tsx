import { api } from "@/api/constants";
import { createErrorResponse, ApiResponse } from "@/utils/apiResponse";
import { AxiosError } from "axios";

export const refreshAccessToken = async (
  refresh_token: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post("/auth/token/refresh", {
      headers: {
        Authorization: `Bearer ${refresh_token.trim()}`,
      },
    });

    if (response.status == 400) {
      return createErrorResponse(response.data.detail);
    } else {
      return {
        isSuccessful: true,
        data: {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
        },
      };
    }
  } catch (error: any) {
    error = error as AxiosError<{ detail: string }>;
    console.log("error: ", error);
    return createErrorResponse(error.response?.data);
  }
};
