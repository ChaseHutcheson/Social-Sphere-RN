import * as SecureStore from "expo-secure-store";
import { createErrorResponse, ApiResponse } from "@/utils/apiResponse";
import { api } from "@/api/constants";

const headers = (access_token: string) => ({
  Authorization: `Bearer ${access_token}`,
});

export const getMe = async (
  access_token: string
): Promise<ApiResponse<any>> => {
  try {
    // Make a GET request to the API
    const response = await api.get("/users/me", {
      headers: headers(access_token),
    });

    // Return the response
    return {
      isSuccessful: true,
      data: response.data,
    };
  } catch (error) {
    // Log any errors
    console.error("Error getting user data:", error);
    return createErrorResponse(error);
  }
};

export const logOut = async (
  access_token: string
): Promise<ApiResponse<any>> => {
  try {
    // Make a POST request to the API
    const response = await api.post(
      "/users/logout",
      {},
      {
        headers: headers(access_token),
      }
    );

    // Securely delete the access token and refresh token
    SecureStore.deleteItemAsync("access_token");
    SecureStore.deleteItemAsync("refresh_token");

    // Return the response
    return {
      isSuccessful: true,
      data: response.data,
    };
  } catch (error) {
    // Log any errors
    console.error("Error logging out:", error);
    return createErrorResponse(error);
  }
};

export const deleteAccount = async (
  access_token: string
): Promise<ApiResponse<any>> => {
  try {
    // Make a DELETE request to the API
    const response = await api.post(
      "/users/logout",
      {},
      {
        headers: headers(access_token),
      }
    );

    // Securely delete the access token and refresh token
    SecureStore.deleteItemAsync("access_token");
    SecureStore.deleteItemAsync("refresh_token");

    // Return the response
    return {
      isSuccessful: true,
      data: response.data,
    };
  } catch (error) {
    // Log any errors
    console.error("Error deleting account:", error);
    return createErrorResponse(error);
  }
};
