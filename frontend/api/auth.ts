import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { API_URL } from "@/constants/Config";
import validateEmail from "@/utils/ValidateEmail";
import { hashData } from "@/utils/hashData";
import { createErrorResponse, ApiResponse } from "@/utils/apiResponse";
import { err } from "react-native-svg";

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const signIn = async (
  email: string,
  password: string
): Promise<ApiResponse<any>> => {
  const isEmailValid = validateEmail(email);
  if (isEmailValid) {
    try {
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);
      const response = await api.post("/users/login", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      console.log("response: ", response);

      if (response.status == 400) {
        return createErrorResponse("Invalid email or password.");
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
      // Extract the error message from the server response
      const errorMessage = error.response.data.detail as AxiosError<{
        detail: string;
      }>;
      return createErrorResponse(error.response?.data.detail);
    }
  } else {
    return createErrorResponse("Email isn't valid.");
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
): Promise<ApiResponse<any>> => {
  function convertDateFormat(dateString: string) {
    const [month, day, year] = dateString.split("/");
    const newDateString = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;
    return newDateString;
  }

  const isEmailValid = await validateEmail(email);
  if (isEmailValid) {
    try {
      const response = await api.post("/users/register", {
        first_name: first_name,
        last_name: last_name,
        username: username,
        email: email,
        password: password,
        address: address,
        date_of_birth: convertDateFormat(date_of_birth),
      });
      return {
        isSuccessful: true,
        data: response.data,
      };
    } catch (error) {
      return createErrorResponse(error);
    }
  } else {
    return createErrorResponse("Email isn't valid.");
  }
};

export const forgotPassword = async (
  email: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post("/auth/password/forgot", {
      email: email,
    });
    return {
      isSuccessful: true,
      data: response.data,
    };
  } catch (error) {
    return createErrorResponse(error);
  }
};

export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string
): Promise<ApiResponse<any>> => {
  const hashedEmail = hashData(email);
  const hashedCode = hashData(code);

  try {
    const response = await api.post("/auth/password/reset", {
      hashed_email: hashedEmail,
      hashed_code: hashedCode,
      new_password: newPassword,
    });
    return {
      isSuccessful: true,
      data: response.data,
    };
  } catch (error) {
    return createErrorResponse(error);
  }
};
