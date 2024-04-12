import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../constants/Types";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { getMe } from "@/src/api/users";
import { signIn, signUp } from "@/src/api/auth";

interface IAuthContext {
  user: User | null;
  authToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (data: User) => void;
  setAuthenticated: (state: boolean) => void;
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
  setUser(data) {},
  setAuthenticated(state) {},
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
      console.log(tokens);
      const user: User = await getMe(tokens.access_token);

      await SecureStore.setItemAsync("access_token", tokens.access_token);

      setUser(user);
      setAuthToken(tokens.access_token);
      setAuthenticated(true);
      setLoading(false);
    } catch (error) {
      console.error(error);
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
      console.log(tokens);
      console.log(tokens.access_token);
      const user: User = await getMe(tokens.access_token);

      await SecureStore.setItemAsync("access_token", tokens.access_token);

      setUser(user);
      setAuthToken(tokens.access_token);
      setAuthenticated(true);
      setLoading(false);
    } catch (error) {
      console.error(error);
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
