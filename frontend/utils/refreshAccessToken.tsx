import axios, { AxiosError } from "axios";
import { API_URL } from "@/constants/Config";

export const refreshAccessToken = async (
  access_token: string,
  refresh_token: string
) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/refresh-token`,
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.status === 200) {
      // Successful token refresh
      const { access_token } = response.data;
      return access_token;
    } else {
      console.error(`Failed to refresh token: ${response.statusText}`);
      return null;
    }
  } catch (error: any) {
    console.error(`Error refreshing token: ${error.message}`);
    return null;
  }
};
