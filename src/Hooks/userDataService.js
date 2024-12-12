import axios from "axios";
import { toast } from "react-toastify";

import { convertIstToUtc, convertUtcToIst } from "../Utils/timeUtils";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const fetchUserList = async (accessToken) => {
  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/user/all?page=1&limit=10`,
      headers: {
        Authorization: `${accessToken}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.request(config);

    if (response.status === 200) {
      let subjectData = response.data.data.subject_data;
      console.log(subjectData);

      if (subjectData && Array.isArray(subjectData)) {
        subjectData = subjectData.map((item) => {
          if (item.createdAt) {
            item.createdAt = convertUtcToIst(item.createdAt);
          }
          if (item.updatedAt) {
            item.updatedAt = convertUtcToIst(item.updatedAt);
          }
          return item;
        });
      }
      // console.log("Updated subjectData data with IST:", subjectData);

      return {
        success: true,
        dataList: subjectData,
      };
    } else {
      throw new Error(`Error fetching user list: ${response.data.message}`);
    }
  } catch (err) {
    console.error("Error fetching user list:", err.message);
    throw new Error(err.message);
  }
};
