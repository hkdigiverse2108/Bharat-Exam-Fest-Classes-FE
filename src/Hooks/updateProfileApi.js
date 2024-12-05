import axios from "axios";
import { convertIscToUtc } from "../Utils/timeUtils";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const handleResponse = (response) => {
  return {
    success: true,
    data: response.data,
  };
};

const handleError = (error) => {
  return {
    success: false,
    message: error.message || "An error occurred during the update process.",
  };
};

export const updateProfile = async (token, formData) => {
  try {
    // Prepare the data for the request
    const data = JSON.stringify(formData);

    let config = {
      method: "post",
      url: `${BASE_URL}/classes/edit`,
      headers: {
        Authorization: `${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios.request(config);

    if (response.status === 200 || response.status === 201) {
      if (response.data.updatedAt) {
        // Convert updatedAt from IST to UTC using convertIscToUtc
        const utcTime = convertIscToUtc(response.data.updatedAt);
        console.log("Converted UTC time:", utcTime);

        response.data.updatedAt = utcTime;
      }

      return handleResponse(response);
    } else if (response.status === 204) {
      console.log("Profile updated with no content returned.");
      return {
        success: true,
        message: "Profile updated successfully, no additional content.",
      };
    } else {
      console.error(`Unexpected response status: ${response.status}`);
      return {
        error: `Unexpected response status: ${response.status}`,
      };
    }
  } catch (error) {
    console.error("Error during profile update:", error);
    return handleError(error);
  }
};
