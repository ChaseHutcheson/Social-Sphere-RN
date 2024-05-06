import validator from "validator";

const validateEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

export default validateEmail;
