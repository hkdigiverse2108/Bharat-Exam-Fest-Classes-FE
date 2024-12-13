import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OtpVerify = ({
  confirm,
  setConfirm,
  onClose,
  email,
  otpValue,
  handleChangeOTP,
  handleOtpverify,
}) => {
  const otpRefs = useRef([]); 

 
  const handleOtpChange = (e, index) => {
    const value = e.target.value;

    // Update the OTP value at the correct index
    handleChangeOTP(e, index);
    

    // If the input is not empty, move the focus to the next input
    if (value && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  return (
    <>
      <section className="fixed z-50 inset-0 overflow-hidden duration-300 ease-in-out">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div
              className="absolute inset-0 bg-gray-500 opacity-75"
              onClick={onClose}
            ></div>
          </div>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div className="dark:bg-gray-800 dark:border-gray-700 p-4 inline-block mx-auto w-full bg-white rounded-lg space-y-6 px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:align-middle max-w-3xl md:max-w-md">
            <div className="space-y-2 text-center">
              <h1 className="block text-2xl font-medium text-gray-800 dark:text-white">
                OTP Verification
              </h1>
              <p className="text-md text-ellipsis">Enter OTP sent to {email}</p>
            </div>

            <div className="grid grid-cols-6 gap-x-2 justify-items-center">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  type="text"
                  name="otp"
                  className="w-12 h-12 text-center border border-gray-400 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  maxLength="1"
                  onChange={(e) => handleOtpChange(e, index)} // Use handleOtpChange to handle input change and focus shift
                  value={otpValue.otp[index] || ""}
                  ref={(el) => (otpRefs.current[index] = el)} // Set ref for each input
                />
              ))}
            </div>

            <div className="w-full">
              <button
                title="OTP confirmation"
                onClick={handleOtpverify}
                className="w-full px-4 py-3 rounded-lg font-medium bg-orange-500 text-white"
              >
                Confirm
              </button>
            </div>
            <div className="text-sm text-slate-500">
              Didn't receive code?{" "}
              <u className="font-medium cursor-pointer text-indigo-500 hover:text-indigo-600">
                Resend
              </u>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer
        draggable={false}
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={false}
        theme="dark"
      />
    </>
  );
};

export default OtpVerify;
