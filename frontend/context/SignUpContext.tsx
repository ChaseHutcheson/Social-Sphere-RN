import React, { createContext, useContext, useEffect, useState } from "react";
import { SignUpData } from "../constants/Types";
import axios, { AxiosError } from "axios";

interface ISignUpContext {
  signUpData: SignUpData | null;
  setSignUpData: React.Dispatch<React.SetStateAction<SignUpData | null>>;
}

const SignUpContext = createContext<ISignUpContext | undefined>(undefined);

export const useSignUpContext = () => {
  const context = useContext(SignUpContext);
  if (!context) {
    throw new Error("useSignUpContext must be used within a SignUpProvider");
  }
  return context;
};

export const SignUpProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [signUpData, setSignUpData] = useState<SignUpData | null>(null);

  // Additional error handling for API requests
  const handleApiError = (error: any) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("API Error:", axiosError.response?.data);
    } else {
      console.error("Error:", error.message);
    }
  };

  // Additional useEffect for logging sign up data changes
  useEffect(() => {
    console.log("Sign Up Data Changed:", signUpData);
  }, [signUpData]);

  return (
    <SignUpContext.Provider
      value={{
        signUpData,
        setSignUpData,
      }}
    >
      {children}
    </SignUpContext.Provider>
  );
};
