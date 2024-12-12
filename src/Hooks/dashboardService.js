import axios from "axios";
import { convertIscToUtc, convertUtcToIst } from "../Utils/timeUtils";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const fetchDashboardData = async (token) => {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/dashboard`,
      headers: {
        Authorization: ` ${token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.request(config);

    if (response.status === 200) {
      //   console.log(response.data.data);

      const questionData = response.data;

      if (questionData) {
        questionData.createdAt = convertUtcToIst(questionData.createdAt);

        questionData.updatedAt = convertUtcToIst(questionData.updatedAt);
      }

        // console.log("Converted Question Data:", questionData);

      return {
        success: true,
        section1: questionData.data.sec1,
        section2: questionData.data.sec2,
      };
    }
  } catch (err) {
    console.error("Error fetching data:", err);
    throw new Error(
      err.response?.data?.message ||
        err.message ||
        "An error occurred while fetching data"
    );
  }
};
