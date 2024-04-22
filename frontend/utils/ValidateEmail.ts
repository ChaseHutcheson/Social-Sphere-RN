/**
 * Validates if the given string is a valid email address.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - True if the email address is valid, false otherwise.
 */
const validateEmail = (email: string): boolean => {
  // Regular expression to validate email addresses
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Test the email against the regular expression
  return emailRegex.test(email);
};

export default validateEmail;
