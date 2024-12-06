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
      return { success: false, message: "No file selected" };
    }

    const formData = new FormData();
    formData.append("image", file);

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

    if (response.data) {
      // Convert relevant date fields from ISC to UTC
      const fieldsToConvert = ['createdAt', 'updatedAt', 'start_date', 'end_date', 'date'];

      fieldsToConvert.forEach(field => {
        if (response.data[field]) {
          response.data[field] = convertIscToUtc(response.data[field]);
          console.log(`Converted ${field} to UTC:`, response.data[field]);
        }
      });
    }

    toast.success("Image uploaded successfully");
    return { success: true, data: response.data.data };
  } catch (err) {
    console.error("Error uploading image:", err);
    const errorMessage =
      err.response?.data?.message || "Failed to upload image.";
    toast.error(errorMessage);
    return { success: false, message: errorMessage };
  }
};