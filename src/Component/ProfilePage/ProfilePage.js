import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import Axios from "axios";
import { VscSaveAs } from "react-icons/vsc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { updateData } from "../../Context/Action/index";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import MultipleSelection from "../Ui/MultiSelection";
import axios from "axios";
import { updateProfile } from "../../Hooks/updateProfileApi";
import { loginAdmin } from "../../Context/Action";
import { imgUpload } from "../../Hooks/updateImage";
import Loading from "../Loader/Loading";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(false);
  const userData = useSelector((state) => state.userConfig.classesData);
  const accessToken = useSelector(
    (state) => state.authConfig.userInfo[0]?.token
  );
  const [formData, setFormData] = useState({
    classesId: "",
    name: "",
    ownerName: "",
    email: "",
    referralCode: "",
    image: "",
    contact: {
      mobile: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [networkError, setNetworkError] = useState(null); // Network error state

  const handleImageUpload = async (file) => {
    setIsLoading(true); // Start loading when image upload begins
    setNetworkError(null); // Reset any previous network errors

    try {
      const response = await imgUpload(file, accessToken);
      if (response.status === 200) {
        setFormData((prevData) => ({
          ...prevData,
          image: response.data.data,
        }));
        toast.success(response.data.message);
        setIsLoading(false);
      } else {
        console.error(response.data);
        toast.error(response.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      setNetworkError("Network error while uploading image. Please try again.");
      toast.error("Failed to upload image. Please check your network.");
      console.error(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      handleImageUpload(files[0]);
    } else if (name.startsWith("contact.")) {
      const contactField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        contact: {
          ...prevData.contact,
          [contactField]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const isEmpty = (data) => {
    if (
      !data.classesId ||
      !data.name ||
      !data.ownerName ||
      !data.email ||
      !data.referralCode ||
      !data.image ||
      !data.contact.mobile
    ) {
      return true;
    }
    return false;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (isEmpty(formData)) {
  //     toast.warn("Fill up empty field");
  //   } else {
  //     setIsLoading(true); // Set loading to true when submitting
  //     setNetworkError(null); // Reset network error on submission attempt

  //     try {
  //       const response = await updateProfile(accessToken, formData);
  //       console.log(response);

  //       if (response.data.status === 200) {
  //         toast.success("Profile updated successfully!");
  //         dispatch(loginAdmin(response.data.data));
  //         setIsLoading(false);
  //         setNetworkError(null);
  //       } else {
  //         console.error(response.error);
  //         toast.error(response.error);
  //         setIsLoading(false);
  //       }
  //     } catch (error) {
  //       setIsLoading(false);

  //       console.error(error);
  //       toast.error("Failed to update profile. Please check your network.");
  //       setNetworkError(
  //         "Network error while updating profile. Please try again."
  //       );
  //     }
  //   }
  // };
  const handleSubmit = async (e) => {
    if (isEmpty(formData)) {
      toast.warn("Fill up empty fields");
    } else {
      setIsLoading(true); // Set loading to true when submitting
      setNetworkError(null);

      try {
        const response = await updateProfile(accessToken, formData);

        if (response.data.status === 200) {
          toast.success("Profile updated successfully!");
          console.log("User Data to be logged in:", response.data.data);

          if (response.data.data) {
            dispatch(loginAdmin(response.data.data));
          } else {
            console.error("No data found in response.data.data");
          }
        } else {
          console.error("Error response:", response.error);
          toast.error(response.error);
        }
      } catch (error) {
        console.error("Error during profile update:", error);
        toast.error("Failed to update profile. Please check your network.");
        setNetworkError(
          "Network error while updating profile. Please try again."
        );
      } finally {
        setIsLoading(false); // Ensure that loading is set to false regardless of success or failure
      }
    }
  };

  useEffect(() => {
    if (userData && userData._id) {
      setFormData({
        classesId: userData._id,
        name: userData.name,
        ownerName: userData.ownerName,
        email: userData.email,
        referralCode: userData.referralCode,
        image: userData.image,
        contact: {
          mobile: userData.contact?.mobile || "",
        },
      });
    }
  }, [userData]);

  return (
    <>
      <section className=" p-6 space-y-6 border border-slate-300 bg-white rounded-xl h-full">
        <div className="space-y-3">
          <p className="text-3xl capitalize tracking-tight font-medium text-left text-gray-900 dark:text-white">
            update profile data
          </p>
          <p className="text-lg tracking-tight font-normal text-left text-gray-700 dark:text-white">
            Fill in the data for profile. It will take a couple of minutes.
          </p>
        </div>

        <div className="p-4 w-full h-fit border border-[#808836] bg-white shadow-sm rounded-xl space-y-4">
          {isLoading ? (
            <div className="text-center py-4">
              <Loading />
            </div>
          ) : networkError ? (
            <div className="text-red-500 text-center py-3 px-4 rounded-md mb-4">
              <p>{networkError}</p>
            </div>
          ) : formData.name === "" || formData.contact.mobile === "" ? (
            <div className="bg-yellow-500 text-white text-center py-3 px-4 rounded-md mb-4">
              <p>No data available.</p>
            </div>
          ) : (
            <>
              <div className="flex h-20 w-20">
                <img
                  src={formData?.image}
                  alt={formData?.name}
                  className="w-full h-full rounded-md object-cover"
                />
              </div>
              <div>
                <p className="text-start capitalize text-lg font-medium text-gray-700 dark:text-white">
                  Image Upload
                </p>
                <p className="text-sm text-slate-600">
                  <span>Type: jpg/jpeg/png</span>
                </p>
              </div>

              {/* Image Input */}
              <input
                type="file"
                onChange={handleChange}
                accept="image/*"
                name="image"
                id="file-input"
                className="block border w-full shadow-sm rounded-lg text-md focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 file:bg-gray-300  file:border-0 file:me-4 file:py-3 file:px-4 dark:file:bg-neutral-700 dark:file:text-neutral-400"
                disabled={isLoading} // Disable input during loading
              />

              {/* Form Fields */}
              <div className="space-y-2">
                <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <div>
                    <label
                      className="flex mb-2 text-start capitalize text-base font-medium text-gray-700 dark:text-white"
                      htmlFor="name"
                    >
                      Class Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Your Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="text-black text-md px-4 py-6 border-2 border-gray-200 h-10 w-full rounded-lg focus:outline-none focus:ring-purple-600 focus:border-purple-600"
                      disabled={isLoading} // Disable input during loading
                    />
                  </div>
                  <div>
                    <label
                      className="flex mb-2 text-start capitalize text-base font-medium text-gray-700 dark:text-white"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email address"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="text-black text-md px-4 py-6 border-2 border-gray-200 h-10 w-full rounded-lg focus:outline-none focus:ring-purple-600 focus:border-purple-600"
                      disabled={isLoading} // Disable input during loading
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <div>
                    <label
                      className="flex mb-2 text-start capitalize text-base font-medium text-gray-700 dark:text-white"
                      htmlFor="ownername"
                    >
                      Owner Name
                    </label>
                    <input
                      type="text"
                      id="ownername"
                      placeholder="Enter Ownername"
                      name="ownername"
                      value={formData.ownerName}
                      onChange={handleChange}
                      className="text-black text-md px-4 py-6 border-2 border-gray-200 h-10 w-full rounded-lg focus:outline-none focus:ring-purple-600 focus:border-purple-600"
                      disabled={isLoading} // Disable input during loading
                    />
                  </div>
                  <div>
                    <label
                      className="flex mb-2 text-start capitalize text-base font-medium text-gray-700 dark:text-white"
                      htmlFor="referralCode"
                    >
                      Referral Code
                    </label>
                    <input
                      type="text"
                      id="referralCode"
                      placeholder="Enter referral code"
                      name="referralCode"
                      value={formData.referralCode}
                      onChange={handleChange}
                      className="text-black text-md px-4 py-6 border-2 border-gray-200 h-10 w-full rounded-lg focus:outline-none focus:ring-purple-600 focus:border-purple-600"
                      disabled={isLoading} // Disable input during loading
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <div>
                    <label
                      className="flex mb-2 text-start capitalize text-base font-medium text-gray-700 dark:text-white"
                      htmlFor="contact"
                    >
                      Contact
                    </label>
                    <input
                      type="text"
                      id="contact"
                      placeholder="Enter mobile number"
                      name="contact.mobile"
                      value={formData.contact.mobile}
                      onChange={handleChange}
                      className="text-black text-md px-4 py-6 border-2 border-gray-200 h-10 w-full rounded-lg focus:outline-none focus:ring-purple-600 focus:border-purple-600"
                      disabled={isLoading} // Disable input during loading
                    />
                  </div>
                </div>
              </div>

              <div className="w-full flex items-end justify-center">
                <button
                  onClick={handleSubmit}
                  className={`inline-flex items-center space-x-2 rounded-lg px-10 py-3 text-md text-center capitalize text-white bg-orange-500 hover:bg-opacity-90 ${
                    isLoading ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  disabled={isLoading}
                >
                  <VscSaveAs />

                  <p className="font-semibold">
                    {isLoading ? "Updating..." : "Update Profile"}
                  </p>
                </button>
              </div>
            </>
          )}
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
