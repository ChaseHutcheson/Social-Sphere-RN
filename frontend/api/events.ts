import axios, { AxiosError, AxiosResponse } from "axios";
import { API_URL } from "@/constants/Config";
import validateEmail from "@/utils/ValidateEmail";
import { EventCreate, SignUpData } from "../constants/Types";
import { useAuth } from "../context/AuthContext";
const querystring = require("query-string");

export const makeEvent = async (body: EventCreate, token: string) => {
  try {
    const response = await axios.post(`${API_URL}/events/make-post`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Add this line for specifying JSON format
      },
    });

    // Check for non-2xx response status code and throw an error if found
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    console.log("Error making event request:", error);

    // Additional error handling here if needed, such as rethrowing or returning a specific value
    throw error;
  }
};

export const attendEvent = async (post_id: string, token: string) => {
  console.log(token)
  try {
    const response = await axios.post(
      `${API_URL}/events/attend-event/${post_id}`, {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.data;
  } catch (error: any) {
    console.log("Error making event request:", error);

    throw error;
  }
};

export const getNewestEvents = async (page: number, token: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/events/newest-events?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {}
};

export const getFilteredEvents = async (query: string, token: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/events/search-events?query=${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {}
};

export const getAttendingEvents = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/events/attending-events`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {}
};
