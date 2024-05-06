import { EventCreate } from "../constants/Types";
import { checkToken } from "@/utils/checkToken";
import { refreshAccessToken } from "@/utils/refreshAccessToken";
import { createErrorResponse, ApiResponse } from "@/utils/apiResponse";
import { api } from "./constants";

export const makeEvent = async (
  access_token: string,
  refresh_token: string,
  body: EventCreate
): Promise<ApiResponse<any>> => {
  try {
    // Check if the access token is valid
    const isTokenValid = await checkToken(access_token);

    // If the token is valid, make a request to the API
    if (!isTokenValid.data.result) {
      // Make a POST request to the API
      const response = await api.post("/events", body, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      // Return the response
      return {
        isSuccessful: true,
        data: response.data,
      };
    } else {
      // If the token is expired, refresh the token
      await refreshAccessToken(refresh_token);

      // Make a POST request to the API
      const response = await api.post("/events", body, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      // Return the response
      return {
        isSuccessful: true,
        data: response.data,
      };
    }
  } catch (error) {
    // Log any errors
    console.error("Error creating event:", error);
    return createErrorResponse(error);
  }
};

export const attendEvent = async (
  access_token: string,
  refresh_token: string,
  post_id: string
): Promise<ApiResponse<any>> => {
  try {
    // Check if the access token is valid
    const isTokenValid = await checkToken(access_token);

    // If the token is valid, make a request to the API
    if (!isTokenValid.data.result) {
      // Make a POST request to the API
      const response = await api.post(
        `/events/${post_id}/attend`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      // Return the response
      return {
        isSuccessful: true,
        data: response.data,
      };
    } else {
      await refreshAccessToken(refresh_token);
      const response = await api.post(
        `/events/${post_id}/attend`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      return {
        isSuccessful: true,
        data: response.data,
      };
    }
  } catch (error) {
    // Log any errors
    console.error("Error attending event:", error);
    return createErrorResponse(error);
  }
};

export const getNewestEvents = async (
  access_token: string,
  refresh_token: string,
  page: number
): Promise<ApiResponse<any>> => {
  try {
    // Check if the access token is valid
    const isTokenValid = await checkToken(access_token);

    // If the token is valid, make a request to the API
    if (!isTokenValid.data.result) {
      // Make a GET request to the API
      const response = await api.get(`/events/?page=${page}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      // Return the response
      return {
        isSuccessful: true,
        data: response.data,
      };
    } else {
      // If the token is expired, refresh the token
      await refreshAccessToken(refresh_token);

      // Make a GET request to the API
      const response = await api.get(`/events/?page=${page}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      // Return the response
      return {
        isSuccessful: true,
        data: response.data,
      };
    }
  } catch (error) {
    // Log any errors
    console.error("Error getting newest events:", error);
    return createErrorResponse(error);
  }
};

export const getNearestEvents = async (
  access_token: string,
  refresh_token: string,
  address: string
): Promise<ApiResponse<any>> => {
  try {
    // Check if the access token is valid
    const isTokenValid = await checkToken(access_token);

    // If the token is valid, make a request to the API
    if (!isTokenValid.data.result) {
      // Make a GET request to the API
      const response = await api.get(`/events/area?address=${address}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      // Return the response
      return {
        isSuccessful: true,
        data: response.data,
      };
    } else {
      // If the token is expired, refresh the token
      await refreshAccessToken(refresh_token);

      // Make a GET request to the API
      const response = await api.get(`/events/area?address=${address}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      // Return the response
      return {
        isSuccessful: true,
        data: response.data,
      };
    }
  } catch (error) {
    // Log any errors
    console.error("Error getting nearest events:", error);
    return createErrorResponse(error);
  }
};

export const getFilteredEvents = async (
  access_token: string,
  refresh_token: string,
  query: string
): Promise<ApiResponse<any>> => {
  try {
    // Check if the access token is valid
    const isTokenValid = await checkToken(access_token);

    // If the token is valid, make a request to the API
    if (!isTokenValid.data.result) {
      // Make a GET request to the API
      const response = await api.get(`/events/search?query=${query}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      // Return the response
      return {
        isSuccessful: true,
        data: response.data,
      };
    } else {
      // If the token is expired, refresh the token
      await refreshAccessToken(refresh_token);

      // Make a GET request to the API
      const response = await api.get(`/events/search?query=${query}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      // Return the response
      return {
        isSuccessful: true,
        data: response.data,
      };
    }
  } catch (error) {
    // Log any errors
    console.error("Error getting filtered events:", error);
    return createErrorResponse(error);
  }
};

export const getAttendingEvents = async (
  access_token: string,
  refresh_token: string
): Promise<ApiResponse<any>> => {
  try {
    // Check if the access token is valid
    const isTokenValid = await checkToken(access_token);

    // If the token is valid, make a request to the API
    if (!isTokenValid.data.result) {
      // Make a GET request to the API
      const response = await api.get("/events/attending", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      // Return the response
      return {
        isSuccessful: true,
        data: response.data,
      };
    } else {
      // If the token is expired, refresh the token
      await refreshAccessToken(refresh_token);

      // Make a GET request to the API
      const response = await api.get("/events/attending", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      // Return the response
      return {
        isSuccessful: true,
        data: response.data,
      };
    }
  } catch (error) {
    // Log any errors
    console.error("Error getting attending events:", error);
    return createErrorResponse(error);
  }
};

export const deleteEvent = async (
  post_id: string,
  access_token: string,
  refresh_token: string
): Promise<ApiResponse<any>> => {
  try {
    // Check if the access token is valid
    const isTokenValid = await checkToken(access_token);

    // If the token is valid, make a request to the API
    if (!isTokenValid.data.result) {
      // Make a DELETE request to the API
      const response = await api.delete(`/events/${post_id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      // Return the response
      return {
        isSuccessful: true,
        data: response.data,
      };
    } else {
      // If the token is expired, refresh the token
      await refreshAccessToken(refresh_token);

      // Make a DELETE request to the API
      const response = await api.delete(`/events/${post_id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      // Return the response
      return {
        isSuccessful: true,
        data: response.data,
      };
    }
  } catch (error) {
    // Log any errors
    console.error("Error deleting event:", error);
    return createErrorResponse(error);
  }
};
