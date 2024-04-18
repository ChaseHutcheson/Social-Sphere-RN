import React, { createContext, useContext, useState, useEffect } from "react";
import { SignUpData, User } from "../constants/Types";
import axios, { AxiosError } from "axios";
import { signIn, signUp } from "@/api/auth";

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

export const SignUpProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [signUpData, setSignUpData] = useState<SignUpData | null>(null);

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
