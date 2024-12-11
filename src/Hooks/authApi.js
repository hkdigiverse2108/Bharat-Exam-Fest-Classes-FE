import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment-timezone";
import { loginAdmin, loginSuccess } from "../Context/Action/Auth";
import { convertIscToUtc } from "../Utils/timeUtils";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const handleLogin = async (input) => {
  try {
    const userData = JSON.stringify(input);

    const config = {
      method: "post",
      url: `${BASE_URL}/auth/login`,
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": "application/json",
      },
      data: userData,
    };

    const response = await axios.request(config);
    console.log(response);

    const { status, data, message, error } = response.data;

    if (response.status === 200) {
      if (response.data.data.lastLogin) {
        response.data.data.lastLogin = convertIscToUtc(
          response.data.data.lastLogin
        );
        console.log(
          "Converted Login Time (UTC):",
          response.data.data.lastLogin
        );
      }

      return response;
    }
  } catch (err) {
    toast.error(
      err.response?.data?.message || "An error occurred during login"
    );
  }
};

export const verifyOtp = async (otpValue) => {
  try {
    const data = JSON.stringify(otpValue);
    if (otpValue) {
      const utcTime = convertIscToUtc(otpValue.otpVerifiedAt);
      console.log(`Converted ${otpValue.otpVerifiedAt} to UTC:`, utcTime);
      otpValue.otpVerifiedAt = utcTime;
    }
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/auth/otp/verify`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios.request(config);

    if (response.status === 200) {
      console.log(response.data);
      return response;
    } else {
      console.error("OTP verification failed");
      toast.error("OTP verification failed. Please try again.");
    }
  } catch (err) {
    console.error(err.message);
    console.error("An error occurred during OTP verification");
    toast.error("An error occurred during OTP verification");
  }
};
