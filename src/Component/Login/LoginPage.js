import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { VscEyeClosed } from "react-icons/vsc";
import { RxEyeOpen } from "react-icons/rx";
import { loginSuccess } from "../../Context/Action/Auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OtpVerify from "../OtpVerify/OtpVerify";
import axios from "axios";
import { loginAdmin } from "../../Context/Action/index";
import { handleLogin, verifyOtp } from "../../Hooks/authApi";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const emailpatton = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const lowerCaseLetters = /[a-z]/g;
  const upperCaseLetters = /[A-Z]/g;
  const numbers = /[0-9]/g;
  const spcl = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

  const [confirm, setConfirm] = useState(false);
  const [data, setData] = useState([]);

  const [input, setInput] = useState({
    uniqueId: "",
    password: "",
    userType: "classes",
  });
  const { uniqueId, password } = input;
  function handleChange(e) {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  }
  const [otpValue, setOtpValue] = useState({
    otp: "",
    userType: "classes",
  });

  const handleChangeOTP = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = otpValue.otp.split("");
      newOtp[index] = value;
      setOtpValue({
        ...otpValue,
        otp: newOtp.join(""),
      });
    }
  };
  const isEmptyLogin = () => {
    return !input.uniqueId || !input.password || !input.userType;
  };
  const isEmpty = () => {
    return otpValue.otp === "" && !otpValue.userType;
  };
  async function handleNavigate() {
    setConfirm(!confirm);
  }

  const [show, setShow] = useState(false);

  async function handleLogin() {
    try {
      let userData = JSON.stringify(input);
      console.log("Login", input);

      let config = {
        method: "post",
        url: `https://api-bef.hkdigiverse.com/auth/login`,
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": "application/json",
        },
        data: userData,
      };

      const response = await axios.request(config);
      const { status, data, message, error } = response.data;

      if (response.status === 200) {
        // toast.success(response.data.message);
        dispatch(loginAdmin(response.data.data));
        handleNavigate();
      } else if (response.status === 400) {
        toast.error(response.data.message);
      } else {
        console.warn("Login failed:", error);
        console.log("Login failed: " + error.message);
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  }

  const verifyOtp = async () => {
    try {
      if (isEmpty()) {
        toast.warning("Fill up empty space");
        return false;
      } else {
        let data = JSON.stringify(otpValue);

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://api-bef.hkdigiverse.com/auth/otp/verify",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        const response = await axios.request(config);

        if (response.data.status === 200) {
          console.log(response.data);
          toast.success("OTP verified and Login successfully");
          dispatch(loginSuccess(response.data.data));
          // fetchClassData();
          navigate("/");
          handleNavigate();
          return true;
        } else {
          console.error("OTP verification failed");
          return false;
        }
      }
    } catch (err) {
      console.error(err.message);
      console.error("An error occurred during OTP verification");
      return false;
    }
  };
  // const handleNavigatePage = () => navigate("/");

  // const handleLoginSubmit = async () => {
  //   if (isEmptyLogin()) {
  //     toast.warning("Please fill in all the fields.");
  //   } else {
  //     const response = await handleLogin(input);
  //     if (response.status === 200) {
  //       handleNavigate();
  //       dispatch(loginAdmin(response.data.data));
  //     } else {
  //       toast.error(response.data.message || "Login failed");
  //     }
  //   }
  // };

  // const handleOtpSubmit = () => {
  //   try {
  //     if (isEmpty()) {
  //       toast.warning("Fill up empty space");
  //     } else {
  //       const response = verifyOtp(otpValue);
  //       if (response.status === 200) {
  //         toast.success(response.data.message);
  //         dispatch(loginSuccess(response.data.data));
  //         handleNavigatePage();
  //         handleNavigate();
  //       } else {
  //         toast.error(response.data.message || "Login failed");
  //       }
  //     }
  //   } catch (err) {
  //     console.error(err.message);
  //     console.error("An error occurred during OTP verification");
  //   }
  // };

  function Signup() {
    try {
      const validationMessages = [];

      if (!uniqueId || !password) {
        validationMessages.push("Fill up empty field!");
      } else {
        if (!uniqueId.match(emailpatton)) {
          validationMessages.push("Email doesn't match!");
        } else if (!password.match(spcl)) {
          validationMessages.push("Must include a symbol in password!");
        } else if (!password.match(numbers)) {
          validationMessages.push("Must include a digit in password!");
        } else if (!password.match(upperCaseLetters)) {
          validationMessages.push(
            "Must include uppercase letters in password!"
          );
        } else if (!password.match(lowerCaseLetters)) {
          validationMessages.push(
            "Must include lowercase letters in password!"
          );
        }
      }

      if (validationMessages.length > 0) {
        validationMessages.forEach((message) => toast.warn(message));
        return;
      }

      handleLogin();
    } catch (error) {
      console.error(error);
    }
  }

  // useEffect(() => {}, []);

  return (
    <>
      <section className="bg-white  mx-auto 3xl:w-[386px] 2xl:w-[386px] xl:w-[386px] md:w-[386px] sm:w-[340px] h-[450px] py-6 px-4 space-y-10 border-2 border-gray-300 rounded-xl  overflow-none">
        <div className="flex flex-col items-center justify-center space-y-4 h-full">
          <span className="text-black text-3xl py-4 capitalize select-none">
            welcome Question panel
          </span>

          <div className="flex flex-col space-y-2 w-full h-full">
            <div>
              <input
                className="text-black text-md px-4 py-6  border-2 border-gray-200 h-10 w-full rounded-lg focus:outline-none focus:ring-purple-600 focus:border-purple-600 invalid:border-pink-500 invalid:text-pink-600 peer
                  focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                type="email"
                name="uniqueId"
                value={uniqueId || ""}
                onChange={(e) => handleChange(e)}
                placeholder="Enter Your Email Address"
                autoComplete="off"
              />
              <p className="mt-1 invisible peer-invalid:visible text-red-600 text-sm">
                Enter a valid email address.
              </p>
            </div>

            <div className="relative w-full ">
              <input
                className="text-black text-md px-4 py-6 border-2 border-gray-200 focus:outline-none focus:ring-purple-600 focus:border-purple-600 h-10 w-full rounded-lg"
                type={show ? "text" : "password"}
                name="password"
                value={password || ""}
                onChange={(e) => handleChange(e)}
                placeholder="Enter Your Password"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute inset-y-0 bottom-[25px] end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:text-blue-600 invalid:border-pink-500 invalid:text-pink-600 peer
                  focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
              >
                <svg className="w-5 h-5" viewBox="0 0 16 16">
                  {show ? (
                    <VscEyeClosed title="Show Password" />
                  ) : (
                    <RxEyeOpen title="Hide Password" />
                  )}
                </svg>
              </button>
              <p className="mt-1 invisible peer-invalid:visible text-red-600 text-sm">
                Enter a strong password.
              </p>
            </div>
            <div className="flex items-start justify-start ms-2">
              <input
                id="default-checkbox"
                type="checkbox"
                value=""
                className="cursor-pointer w-4 h-4 text-blue-600 capitalize bg-gray-100 border-gray-300 rounded-sm   dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="default-checkbox"
                className="ms-2 select-none text-sm capitalize text-gray-600 dark:text-gray-300"
              >
                remenber me
              </label>
            </div>
          </div>
          <button
            type="button"
            onClick={Signup}
            className="end-0 bg-orange-400 hover:bg-orange-500 text-white text-center text-xl capitalize w-full h-20 rounded-lg"
          >
            log in
          </button>
        </div>
        <div className={`${confirm === true ? "block" : "hidden"}`}>
          <OtpVerify
            confirm={confirm}
            setConfirm={handleLogin}
            onClose={handleNavigate}
            email={input.uniqueId} // Pass the user's email or any relevant data
            otpValue={otpValue}
            handleChangeOTP={handleChangeOTP}
            handleOtpverify={verifyOtp}
          />
        </div>
      </section>
      <ToastContainer
        draggable={false}
        autoClose={2000}
        position={"top-center"}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={false}
        theme="dark"
      />
    </>
  );
}

export default LoginPage;
