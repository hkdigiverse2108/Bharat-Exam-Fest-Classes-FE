import axios from "axios";
import moment from "moment-timezone";
import { convertIscToUtc, convertUtcToIst } from "../Utils/timeUtils"; // Import the time conversion function

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const resetPasswordApiCall = async (currentUser, token) => {
  try {
    const data = JSON.stringify(currentUser);

    const config = {
      method: "post",
      url: `${BASE_URL}/auth/reset-password`,
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios.request(config);

    if (response.data) {
      // Check and convert relevant date fields from IST to UTC
      const fieldsToConvert = ['created_at', 'updated_at', 'start_date', 'end_date', 'date'];

      fieldsToConvert.forEach((field) => {
        if (response.data[field]) {
          // Convert the date field from IST to UTC
          const utcTime = convertIscToUtc(response.data[field]);
          console.log(`Converted ${field} to UTC:`, utcTime);
          response.data[field] = utcTime; // Update the response with the converted UTC time
        }
      });
    }

    return response;
  } catch (err) {
    console.error("Error resetting password:", err);
    throw new Error(
      err.response?.data?.message ||
        err.message ||
        "An error occurred while resetting the password"
    );
  }
};

