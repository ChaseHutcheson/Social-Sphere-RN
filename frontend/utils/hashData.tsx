import CryptoJS from "crypto-js";

export const hashData = (data: string): string => {
  return CryptoJS.SHA256(data.toLowerCase().trim()).toString(CryptoJS.enc.Hex);
};
