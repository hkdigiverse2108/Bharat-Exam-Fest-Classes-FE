import axios from "axios";
import { convertIscToUtc } from "../Utils/timeUtils";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const resetPasswordApiCall = async (currentUser, token) => {
  try {
    const data = JSON.stringify(currentUser);
    if (currentUser) {
      const fieldsToConvert = [
        "createdAt",
        "updatedAt",
        "startDate",
        "endDate",
      ];
      fieldsToConvert.forEach((field) => {
        if (currentUser[field]) {
          const utcTime = convertIscToUtc(currentUser[field]);
          console.log(`Converted ${field} to UTC:`, utcTime);
          currentUser[field] = utcTime;
        }
      });
    }

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
