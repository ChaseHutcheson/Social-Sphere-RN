import axios, { AxiosError, AxiosResponse } from "axios";
import { API_URL } from "@/constants/Config";
import validateEmail from "@/utils/ValidateEmail";
import { EventCreate, SignUpData } from "../constants/Types";
import { useAuth } from "../context/AuthContext";
import { checkToken } from "@/utils/checkToken";
import { refreshAccessToken } from "@/utils/refreshAccessToken";

export const makeEvent = async (
  access_token: string,
  refresh_token: string,
  body: EventCreate
) => {
  try {
    const isTokenValid = await checkToken(access_token);
    if (!isTokenValid.data.result) {
      const response = await axios.post(`${API_URL}/events/make-post`, body, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json", // Add this line for specifying JSON format
        },
      });
      return response;
    } else {
      await refreshAccessToken(access_token, refresh_token);
      const response = await axios.post(`${API_URL}/events/make-post`, body, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json", // Add this line for specifying JSON format
        },
      });
      return response;
    }
  } catch (error) {
    console.error(error);
  }
};

export const attendEvent = async (
  access_token: string,
  refresh_token: string,
  post_id: string
) => {
  try {
    const isTokenValid = await checkToken(access_token);
    if (!isTokenValid.data.result) {
      const response = await axios.post(
        `${API_URL}/events/attend-event/${post_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      return response;
    } else {
      await refreshAccessToken(access_token, refresh_token);
      const response = await axios.post(
        `${API_URL}/events/attend-event/${post_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      return response;
    }
  } catch (error) {
    console.error(error);
  }
};

export const getNewestEvents = async (
  access_token: string,
  refresh_token: string,
  page: number
) => {
  try {
    const isTokenValid = await checkToken(access_token);
    if (!isTokenValid.data.result) {
      const response = await axios.get(
        `${API_URL}/events/newest-events?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response;
    } else {
      await refreshAccessToken(access_token, refresh_token);
      const response = await axios.get(
        `${API_URL}/events/newest-events?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response;
    }
  } catch (error) {
    console.error(error);
  }
};

export const getFilteredEvents = async (
  access_token: string,
  refresh_token: string,
  query: string
) => {
  try {
    const isTokenValid = await checkToken(access_token);
    if (!isTokenValid.data.result) {
      const response = await axios.get(
        `${API_URL}/events/search-events?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data;
    } else {
      await refreshAccessToken(access_token, refresh_token);
      const response = await axios.get(
        `${API_URL}/events/search-events?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

export const getAttendingEvents = async (
  access_token: string,
  refresh_token: string
) => {
  try {
    const isTokenValid = await checkToken(access_token);
    if (!isTokenValid.data.result) {
      const response = await axios.get(`${API_URL}/events/attending-events`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return response;
    } else {
      await refreshAccessToken(access_token, refresh_token);
      const response = await axios.get(`${API_URL}/events/attending-events`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return response;
    }
  } catch (error) {
    console.error(error);
  }
};

export const deleteEvent = async (
  post_id: string,
  access_token: string,
  refresh_token: string
) => {
  try {
    const isTokenValid = await checkToken(access_token);
    if (!isTokenValid.data.result) {
      const response = await axios.delete(
        `${API_URL}/events/delete-event/${post_id}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data;
    } else {
      await refreshAccessToken(access_token, refresh_token);
      const response = await axios.delete(
        `${API_URL}/events/delete-event/${post_id}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};
