import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import Settings from '../config'

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (
    first_name: string,
    last_name: string,
    username: string, 
    email: string,
    password: string,
    date_of_birth: string
  ) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const TOKEN_KEY = Settings.SECRET_KEY;
export const API_URL = `${Settings.API_HOST}:${Settings.API_PORT}`;
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({children}: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null;
    }>({
        token: null,
        authenticated: null
    })

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);

            if (token) {
                setAuthState({
                    token: token,
                    authenticated: true
                })
            }
        }
        loadToken();
    })

    const register = async (
      first_name: string,
      last_name: string,
      username: string,
      email: string,
      password: string,
      date_of_birth: string
    ) => {
      try {
        return await axios.post(`${API_URL}/users/register`, {
            first_name,
            last_name,
            username,
            email,
            password,
            date_of_birth
        });
      } catch (e) {
        return { error: true, msg: (e as any).reponse.data.msg }
      }
    };

    const login = async (
    email: string,
    password: string,
) => {
    try {
        const result = await axios.post(`http://${API_URL}/users/login`, {
            email,
            password,
        });

        if (result && result.data && result.data.access_token) {
            setAuthState({
                token: result.data.access_token,
                authenticated: true,
            });

            await SecureStore.setItemAsync(TOKEN_KEY, result.data.access_token);

            return result;
        } else {
            console.error("Login Response Error:", result);
            // Handle the error appropriately
            return { error: true, msg: "Unexpected response from the server" };
        }
    } catch (e) {
        console.error("Login Error:", e);
        return { error: true, msg: "An error occurred during login" };
    }
};

    const logout = async () => {
        try {
            await axios.post(`${API_URL}/users/logout?access_token=${SecureStore.getItemAsync(TOKEN_KEY)}`);

            setAuthState({
                token: null,
                authenticated: false,
            });

            await SecureStore.deleteItemAsync(TOKEN_KEY);
        } catch (e) {
            return { error: true, msg: (e as any).reponse.data.msg };
        }
    };

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}