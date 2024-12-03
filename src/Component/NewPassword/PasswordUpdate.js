import React, { useEffect, useState } from "react";
import axios from "axios";
import { VscSaveAs } from "react-icons/vsc";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetPasswordApiCall } from "../../Hooks/resetPassword";
import { loginAdmin } from "../../Context/Action/index";

// export default function PasswordUpdate() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [toggle1, setToggle1] = useState(false);
//   const [toggle2, setToggle2] = useState(false);
//   const userAccess = useSelector((state) => state.userConfig.classesData[0]);
//   const accessToken = useSelector(
//     (state) => state.authConfig.userInfo[0]?.token
//   );
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [currentUser, setCurrentUser] = useState({
//     uniqueId: "",
//     password: "",
//     userType: "",
//   });

//   const isEmpty = () => {
//     if (
//       !currentUser.uniqueId ||
//       !currentUser.password ||
//       !currentUser.userType
//     ) {
//       return true;
//     }
//     return false;
//   };

//   const validatePasswordMatch = () => {
//     return currentUser.password === confirmPassword;
//   };

//   const ChangePassword = async () => {
//     try {
//       if (isEmpty()) {
//         toast.warning("Please fill up empty fields.");
//       } else if (!validatePasswordMatch()) {
//         toast.warn("Password does not match.");
//       } else {
//         const response = await resetPasswordApiCall(currentUser, accessToken);

//         if (response.status === 200) {
//           toast.success(response.data.message);
//           dispatch(loginAdmin(response.data.data));
//           console.log("Success", response.data);
//           navigate("/");
//         } else if (response.status === 400) {
//           console.log("Bad Request", response.data);
//           toast.error(response.data.message);
//         } else if (response.status === 401) {
//           console.log("Unauthorized", response.data);
//           toast.error(response.data.message);
//         } else if (response.status === 500) {
//           console.log("Server Error", response.data);
//           toast.error(response.data.message);
//         } else {
//           console.log("Unexpected response status:", response.status);
//           toast.error("An unexpected error occurred. Please try again.");
//         }
//       }
//     } catch (err) {
//       if (err.response) {
//         console.error("Response error:", err.response);
//         console.error("An error occurred while processing your request.");
//       } else if (err.request) {
//         console.error("No response received:", err.request);
//         console.error(
//           "No response received from the server. Please check your network connection."
//         );
//       } else {
//         console.error("Error", err.message);
//         console.error("An error occurred. Please try again later.");
//       }
//     }
//   };

//   useEffect(() => {
//     if (userAccess) {
//       setCurrentUser({
//         uniqueId: userAccess.email || "",
//         password: "",
//         userType: userAccess.userType || "",
//       });
//     }
//   }, [userAccess]);

//   return (
//     <>
//       <section className=" p-3 space-y-6">
//         <div className="p-6 w-full h-fit border border-slate-300 bg-white rounded-xl space-y-10">
//           <div className="space-y-1 w-full px-4 py-2 overflow-hidden text-slate-700 bg-white bg-clip-border">
//             <p className="text-2xl text-left w-full font-semibold text-slate-800 ">
//               Change Password
//             </p>
//             <p className="text-lg text-left font-normal text-slate-600">
//               Change password and make secure your website
//             </p>
//           </div>
//           <div className="max-w-xl text-sm mx-auto">
//             {/* new password */}
//             <div className="px-4 space-y-4">
//               <div className="flex items-center justify-between space-y-1">
//                 <label
//                   className="flex  text-start capitalize text-xl font-medium text-gray-700 dark:text-white"
//                   htmlFor="newpassword"
//                 >
//                   new password
//                 </label>
//                 <span
//                   type="button"
//                   className="py-2.5 px-6 text-md bg-indigo-50 text-slate-500 rounded-xl font-semibold text-center shadow-xs transition-all duration-500 hover:bg-indigo-100"
//                 >
//                   Required
//                 </span>
//               </div>
//               <div className="relative w-full">
//                 <input
//                   id="newpassword"
//                   className="text-black text-md px-4 py-6 border-2 border-gray-200  w-full h-12 rounded-lg"
//                   type={toggle1 ? "text" : "password"}
//                   name="password"
//                   onChange={(e) => {
//                     setCurrentUser((prev) => ({
//                       ...prev,
//                       password: e.target.value,
//                     }));
//                   }}
//                   placeholder="Enter new assword"
//                   autoComplete="off"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setToggle1(!toggle1)}
//                   className="absolute inset-y-0 bottom-[25px] end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:ring-purple-600 focus:border-purple-600  invalid:border-pink-500 invalid:text-pink-600 peer
//                   focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
//                 >
//                   <svg className="w-5 h-5 text-blue-600" viewBox="0 0 16 16">
//                     {toggle1 ? (
//                       <VscEyeClosed title="Show Password" />
//                     ) : (
//                       <VscEye title="Hide Password" />
//                     )}
//                   </svg>
//                 </button>
//                 <p className="mt-1 invisible peer-invalid:visible text-red-600 text-sm">
//                   Enter a strong password.
//                 </p>
//               </div>
//             </div>

//             {/* confirm password */}
//             <div className="px-4  space-y-4">
//               <div className="flex items-center justify-between space-y-1">
//                 <label
//                   className="flex  text-start capitalize text-xl font-medium text-gray-700 dark:text-white"
//                   htmlFor="confirmpassword"
//                 >
//                   confirm new password
//                 </label>
//                 <span
//                   type="button"
//                   className="py-2.5 px-6 text-md bg-indigo-50 text-slate-500 rounded-xl  font-semibold text-center shadow-xs transition-all duration-500 hover:bg-indigo-100"
//                 >
//                   Required
//                 </span>
//               </div>
//               <div className="relative w-full">
//                 <input
//                   id="confirmpassword"
//                   className="text-black text-md px-4 py-6 border-2 border-gray-200  w-full h-12 rounded-lg"
//                   type={toggle2 ? "text" : "password"}
//                   name="password"
//                   // value={password || ""}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   placeholder="Enter new assword"
//                   autoComplete="off"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setToggle2(!toggle2)}
//                   className="absolute inset-y-0 bottom-[25px] end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:ring-purple-600 focus:border-purple-600 invalid:border-pink-500 invalid:text-pink-600 peer
//                   focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
//                 >
//                   <svg className="w-5 h-5 text-blue-600" viewBox="0 0 16 16">
//                     {toggle2 ? (
//                       <VscEyeClosed title="Show Password" />
//                     ) : (
//                       <VscEye title="Hide Password" />
//                     )}
//                   </svg>
//                 </button>
//                 <p className="mt-1 invisible peer-invalid:visible text-red-600 text-sm">
//                   Enter a strong password.
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col items-center  w-full justify-center space-y-2">
//             <h2 className=" text-lg font-semibold text-gray-600 dark:text-white">
//               Password requirements:
//             </h2>
//             <ul className="text-left space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
//               <li>At least 10 characters</li>
//               <li>At least one uppercase character</li>
//               <li>
//                 Inclusion of at least one special character, e.g., ! @ # ?
//               </li>
//             </ul>
//           </div>
//         </div>
//         {/* UploadData */}
//         <div className="w-full flex items-end justify-center">
//           <button
//             onClick={ChangePassword}
//             className="inline-flex items-center space-x-2 rounded-full px-10 py-3 text-md text-center capitalize text-white bg-orange-500 hover:bg-opacity-90  "
//           >
//             <svg className="font-bold text-white w-4 h-4" viewBox="0 0 16 16">
//               <VscSaveAs />
//             </svg>
//             <p className=" font-semibold">Reset password</p>
//           </button>
//         </div>
//       </section>
//       <ToastContainer
//         draggable={false}
//         autoClose={2000}
//         hideProgressBar={false}
//         newestOnTop={true}
//         closeOnClick={false}
//         theme="dark"
//       />
//     </>
//   );
// }

export default function PasswordUpdate() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentUser, setCurrentUser] = useState({
    uniqueId: "",
    password: "",
    userType: "",
  });
  const [isLoading, setIsLoading] = useState(false); 
  const [networkError, setNetworkError] = useState(false); 

  const userData = useSelector((state) => state.userConfig.classesData);
   const accessToken = useSelector(
    (state) =>
      state.authConfig.userInfo[0]?.data?.token ||
      state.authConfig.userInfo[0]?.token
  );

  const isEmpty = () => {
    if (
      !currentUser.uniqueId ||
      !currentUser.password ||
      !currentUser.userType
    ) {
      return true;
    }
    return false;
  };

  const validatePasswordMatch = () => {
    return currentUser.password === confirmPassword;
  };

  const ChangePassword = async () => {
    try {
      if (isEmpty()) {
        toast.warning("Please fill up empty fields.");
        // console.log(currentUser);
      } else if (!validatePasswordMatch()) {
        toast.warn("Password does not match.");
      } else {
        setIsLoading(true);
        const response = await resetPasswordApiCall(currentUser, accessToken);

        if (response.status === 200) {
          toast.success(response.data.message);
          dispatch(loginAdmin(response.data.data));
          navigate("/"); 
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (err) {
      setNetworkError(true);
      if (err.response) {
        console.error("Response error:", err.response);
        toast.error("An error occurred while processing your request.");
      } else if (err.request) {
        console.error("No response received:", err.request);
        toast.error(
          "No response received from the server. Please check your network connection."
        );
      } else {
        console.error("Error", err.message);
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    if (userData) {
      setCurrentUser({
        uniqueId: userData.email,
        password: "",
        userType: userData.userType,
      });
    }
  }, [userData]);

  return (
    <>
      <section className="p-3 space-y-6">
        <div className="p-6 w-full h-fit border border-slate-300 bg-white rounded-xl space-y-10">
          <div className="space-y-1 w-full px-4 py-2 overflow-hidden text-slate-700 bg-white bg-clip-border">
            <p className="text-2xl text-left w-full font-semibold text-slate-800">
              Change Password
            </p>
            <p className="text-lg text-left font-normal text-slate-600">
              Change password and make secure your website
            </p>
          </div>

          <div className="max-w-xl text-sm mx-auto">
            {/* New password */}
            <div className="px-4 space-y-4">
              <div className="flex items-center justify-between space-y-1">
                <label
                  className="flex text-start capitalize text-xl font-medium text-gray-700 dark:text-white"
                  htmlFor="newpassword"
                >
                  New Password
                </label>
                <span
                  type="button"
                  className="py-2.5 px-6 text-md bg-indigo-50 text-slate-500 rounded-xl font-semibold text-center shadow-xs transition-all duration-500 hover:bg-indigo-100"
                >
                  Required
                </span>
              </div>
              <div className="relative w-full">
                <input
                  id="newpassword"
                  className="text-black text-md px-4 py-6 border-2 border-gray-200 w-full h-12 rounded-lg"
                  type={toggle1 ? "text" : "password"}
                  name="password"
                  onChange={(e) => {
                    setCurrentUser((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }));
                  }}
                  placeholder="Enter new password"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setToggle1(!toggle1)}
                  className="absolute inset-y-0 top-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:ring-purple-600"
                >
                  <svg className="w-5 h-5 text-blue-600" viewBox="0 0 16 16">
                    {toggle1 ? (
                      <VscEyeClosed title="Show Password" />
                    ) : (
                      <VscEye title="Hide Password" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="px-4 space-y-4">
              <div className="flex items-center justify-between space-y-1">
                <label
                  className="flex text-start capitalize text-xl font-medium text-gray-700 dark:text-white"
                  htmlFor="confirmpassword"
                >
                  Confirm New Password
                </label>
                <span
                  type="button"
                  className="py-2.5 px-6 text-md bg-indigo-50 text-slate-500 rounded-xl font-semibold text-center shadow-xs transition-all duration-500 hover:bg-indigo-100"
                >
                  Required
                </span>
              </div>
              <div className="relative w-full">
                <input
                  id="confirmpassword"
                  className="text-black text-md px-4 py-6 border-2 border-gray-200 w-full h-12 rounded-lg"
                  type={toggle2 ? "text" : "password"}
                  name="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setToggle2(!toggle2)}
                  className="absolute inset-y-0 top-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:ring-purple-600"
                >
                  <svg className="w-5 h-5 text-blue-600" viewBox="0 0 16 16">
                    {toggle2 ? (
                      <VscEyeClosed title="Show Password" />
                    ) : (
                      <VscEye title="Hide Password" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center w-full justify-center space-y-2">
            <h2 className="text-lg font-semibold text-gray-600 dark:text-white">
              Password Requirements:
            </h2>
            <ul className="text-left space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
              <li>At least 10 characters</li>
              <li>At least one uppercase character</li>
              <li>
                Inclusion of at least one special character, e.g., ! @ # ?
              </li>
            </ul>
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-full flex items-end justify-center">
          <button
            onClick={ChangePassword}
            className="inline-flex items-center space-x-2 rounded-full px-10 py-3 text-md text-center capitalize text-white bg-orange-500 hover:bg-opacity-90"
            disabled={isLoading} // Disable the button when loading
          >
            {isLoading ? (
              <svg
                className="animate-spin font-bold text-white w-4 h-4"
                viewBox="0 0 16 16"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            ) : (
              <VscSaveAs />
            )}
            <p className="font-semibold">
              {isLoading ? "Processing..." : "Reset Password"}
            </p>
          </button>
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
}
