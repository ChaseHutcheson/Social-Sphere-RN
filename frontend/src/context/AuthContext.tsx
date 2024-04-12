import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../constants/Types";
import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import { getMe } from "@/src/api/users";
import { signIn, signUp } from "@/src/api/auth";

interface IAuthContext {
  user: User | null;
  authToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (data: User) => void,
  setAuthenticated: (state: boolean) => void,
  contextSignIn: (email: string, password: string) => Promise<void>;
  contextSignUp: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
}

const AuthContext = createContext<IAuthContext>({
  user: null,
  authToken: null,
  isAuthenticated: false,
  isLoading: false,
  setUser(data) {
    
  },
  setAuthenticated(state) {
    
  },
  contextSignIn: async () => {},
  contextSignUp: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);

  const contextSignIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const tokens = await signIn(email, password);
      const userData = await getMe(tokens.data.access_token);
      await SecureStore.setItemAsync("access_token", tokens.data.access_token);
      await SecureStore.setItemAsync(
        "refresh_token",
        tokens.data.refresh_token
      );

      let user: User = userData.data;
      setUser(user);
      setAuthToken(tokens.data.access_token);
      setAuthenticated(true);
      setLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          console.error(
            "Request failed with status code:",
            error.response.status,
            "and detail message:",
            error.response.data.detail
          );
          return error.response.data.detail;
        } else {
          console.error("An error occurred:", error.message);
          return error.message;
        }
      } else {
        console.error("An error occurred:", error);
        return error;
      }
    } finally {
      setLoading(false);
    }
  };

  const contextSignUp = async (
    username: string,
    email: string,
    password: string
  ) => {
    setLoading(true);
    try {
      const tokens = await signUp(username, email, password);
      const user: User = (await getMe(tokens.data.access_token)).data;

      await SecureStore.setItemAsync("access_token", tokens.data.access_token);
      await SecureStore.setItemAsync("refresh_token", tokens.data.refresh_token)

      setUser(user);
      setAuthToken(tokens.data.access_token);
      setAuthenticated(true);
      setLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          console.error(
            "Request failed with status code:",
            error.response.status,
            "and detail message:",
            error.response.data.detail
          );
          return error.response.data.detail
        } else {
          console.error("An error occurred:", error.message);
          return error.message
        }
      } else {
        console.error("An error occurred:", error);
        return error
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authToken,
        isAuthenticated,
        isLoading,
        setUser,
        setAuthenticated,
        contextSignIn,
        contextSignUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
