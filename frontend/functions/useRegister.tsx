import Settings from "@/constants/Settings";
import * as EmailValidator from "email-validator";

async function useRegister(
  first_name: string,
  last_name: string,
  username: string,
  email: string,
  password: string,
  dob: Date
) {

  if (!first_name || !last_name || !username || !email || !password) {
    console.error("useRegister Error: All fields are required");
    return { success: false, error: "Please fill in all fields." };
  }

  if (!EmailValidator.validate(email)) {
    console.error("useRegister Error: Email isn't valid");
    return { success: false, error: "Invalid email format." };
  }

  try {
    const response = await fetch(
      `${Settings.backend_host}:${Settings.backend_port}/users/register`,
      {
        method: "POST",
        headers: {
          // Add content-type header for JSON data
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: first_name,
          last_name: last_name,
          username: username,
          email: email,
          password: password,
          date_of_birth: dob,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return { success: true, data: data };
    } else {
      const errorData = await response.json();
      console.error("useRegister Error:", errorData);
      return {
        success: false,
        error: errorData.message || "Registration failed.",
      };
    }
  } catch (error) {
    console.error("useRegister Error:", error);
    return { success: false, error: "An error occurred. Please try again." };
  }
}
