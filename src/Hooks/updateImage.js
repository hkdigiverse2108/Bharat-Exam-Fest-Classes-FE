// utils/uploadImage.js
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment-timezone";
import { convertIscToUtc } from "../Utils/timeUtils";

const BASE_URL = process.env.REACT_APP_BASE_URL;


export const imgUpload = async (file, token) => {
  try {
    if (!file) {
      toast.warning("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    // Configure the request
    const config = {
      method: "post",
      url: `${BASE_URL}/upload`,
      headers: {
        Authorization: `${token}`,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    };

    // Make the API request
    const response = await axios.request(config);
console.log(response);

    if (response.data && response.data.updatedAt) {
      // Convert updatedAt from IST to UTC using convertIscToUtc function
      const utcTime = convertIscToUtc(response.data.updatedAt);
      console.log("Converted UTC time:", utcTime);

      response.data.updatedAt = utcTime; // Update the response with the converted UTC time
    }

    return response;
  } catch (err) {
    // Handle any errors during the upload process
    console.error("Error uploading image:", err);
    const errorMessage =
      err.response?.data?.message || "Failed to upload image."; // Extract error message if available
    toast.error(errorMessage); // Show error toast
  }
};