import { SHA256 } from "crypto-js";

export const hashData = (data: string): string => {
  return SHA256(data).toString();
};
