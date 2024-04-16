import axios, { AxiosResponse } from "axios";
import { API_URL } from "@/constants/Config";
import validateEmail from "@/utils/ValidateEmail";
import { SignUpData } from "../constants/Types";
const querystring = require("query-string");

export interface UpdateUserSchema {
  email?: string;
  username?: string;
  password?: string;
}

export const signIn = async (
  email: string,
  password: string
): Promise<AxiosResponse<any>> => {
  const isEmailValid = validateEmail(email);
  if (isEmailValid) {
    try {
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);
      const response = await axios.post(`${API_URL}/users/login`, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  } else {
    const errorMsg = { Error: "Email isn't valid." };
    console.error(errorMsg);
    return Promise.reject(new Error("Email isn't valid."));
  }
};

export const signUp = async (
  first_name: string,
  last_name: string,
  username: string,
  email: string,
  password: string,
  address: string | null,
  date_of_birth: string
): Promise<AxiosResponse<any>> => {
  console.log(email);
  const isEmailValid = validateEmail(email);

  function convertDateFormat(dateString: string) {
    // Split the input date string by "/"
    const [month, day, year] = dateString.split("/");

    // Combine the year, month, and day in the format "yyyy-MM-dd"
    const newDateString = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;

    return newDateString;
  }

  if (isEmailValid) {
    try {
      console.log(convertDateFormat(date_of_birth));
      const response = await axios.post(`${API_URL}/users/register`, {
        first_name: first_name,
        last_name: last_name,
        username: username,
        email: email,
        password: password,
        address: address,
        date_of_birth: convertDateFormat(date_of_birth),
      });
      return response; // Return the full response object
    } catch (error) {
      console.error(error);
      return Promise.reject(error); // Return a rejected promise with the error
    }
  } else {
    const errorMsg = { Error: "Email isn't valid." };
    console.log(errorMsg);
    return Promise.reject(new Error("Email isn't valid."));
  }
};

export const checkToken = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/auth/is-token-expired`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Response Successful!");
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const forgotPassword = async (email: string) => {
  axios.post(`${API_URL}/forgot-password`, {
    email: email,
  });
};

export const updateProfile = async (id: number, update: UpdateUserSchema) => {
  try {
    const response = await axios.patch(`${API_URL}/users/me/update`, update);
    console.log("Profile update successful!");
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};