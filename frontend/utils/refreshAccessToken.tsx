import axios, { AxiosError } from "axios";
import { API_URL } from "@/constants/Config";

export const refreshAccessToken = async (refresh_token: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/token/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refresh_token}`,
        },
      }
    );

    if (response.status === 200) {
      // Successful token refresh
      const { access_token } = response.data;
      return access_token;
    } else {
      console.log("Error refreshing token:", response.status);
      return Promise.reject(`Failed to refresh token: ${response.statusText}`);
    }
  } catch (error: any) {
    console.log("Error refreshing token:", error.message);
    return Promise.reject(`Error refreshing token: ${error.message}`);
  }
};
