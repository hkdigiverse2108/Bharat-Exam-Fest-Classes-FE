import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LogoutConfimation from "./LogoutConfimation";
import { logOut } from "../../Context/Action/Auth";
import { logOutAdmin } from "../../Context/Action";
import { useSelector } from "react-redux";

// const DropdownUser = ({ authData }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { pathname } = location;

//   const userData = useSelector((state) => state.userConfig.classesData);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [confirm, setConfirm] = useState(false);
//   function Navigation() {
//     setDropdownOpen(!dropdownOpen);
//   }

//   // Function to toggle the confirmation modal visibility
//   function handleToggle() {
//     setConfirm(!confirm);
//   }

//   // Logout function
//   const handleLogout = () => {
//     dispatch(logOutAdmin()); // Your logout redux action
//     Navigation(); // Toggle the dropdown
//     handleToggle(); // Toggle the modal

//     setTimeout(() => {
//       toast.success("Logout successfully");
//       navigate("/");
//     }, 1000);
//   };

//   return (
//     <>
//       <div className="relative">
//         <div
//           onClick={() => setDropdownOpen(!dropdownOpen)}
//           className="flex items-center gap-4"
//           to="#"
//         >
//           <span className="h-12 w-12 rounded-full">
//             {userData?.image ? (
//               <img
//                 src={userData?.image}
//                 alt={userData?.name}
//                 className="w-full h-full  rounded-full object-cover"
//               />
//             ) : (
//               <img
//                 src="BEFLogo.png"
//                 alt={userData?.name}
//                 className="w-full h-full  rounded-full object-cover"
//               />
//             )}
//           </span>
//           <span className="hidden text-left lg:block cursor-pointer">
//             <span className="block text-sm   font-medium text-black dark:text-white">
//               {userData?.ownerName || "Welcome user"}
//             </span>
//             <span className="block text-xs">{userData?.name}</span>
//           </span>
//           <svg
//             className="hidden fill-current cursor-pointer sm:block"
//             width="12"
//             height="8"
//             viewBox="0 0 12 8"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               fillRule="evenodd"
//               clipRule="evenodd"
//               d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
//               fill=""
//             />
//           </svg>
//         </div>

//         {/*dropdown */}
//         {dropdownOpen && (
//           <div
//             className={`absolute right-0 top-14 flex w-62.5 flex-col rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
//           >
//             <ul className="flex flex-col dark:text-white  text-left font-medium capitalize">
//               <li onClick={Navigation}>
//                 <NavLink to="/profileUpdate">
//                   <button
//                     type="button"
//                     className={`${
//                       pathname === "/profileUpdate"
//                         ? "text-white bg-gray-600"
//                         : "text-black"
//                     }  py-2 px-4 w-full text-left outline-none rounded-md duration-300 ease-in-out capitalize hover:text-white hover:bg-gray-500`}
//                   >
//                     Profile Update
//                   </button>
//                 </NavLink>
//               </li>
//               <li onClick={Navigation}>
//                 <NavLink to="/resetpassword">
//                   <button
//                     type="button"
//                     className={`${
//                       pathname === "/resetpassword"
//                         ? "text-white bg-gray-600"
//                         : "text-black"
//                     }  py-2 px-4 w-full text-left outline-none rounded-md duration-300 ease-in-out capitalize hover:text-white hover:bg-gray-600`}
//                   >
//                     Reset Password
//                   </button>
//                 </NavLink>
//               </li>
//               <li onClick={handleToggle}>
//                 <button
//                   type="button"
//                   className="py-2 px-4 w-full text-left outline-none rounded-md duration-300 ease-in-out capitalize hover:text-white hover:bg-gray-600"
//                 >
//                   Log Out
//                 </button>
//               </li>
//             </ul>
//           </div>
//         )}
//       </div>
//       <div className={`${confirm === true ? "block" : "hidden"}`}>
//         <LogoutConfimation
//           confirm={confirm}
//           onLogout={handleLogout}
//           onCancel={handleToggle}
//         />
//       </div>
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
// };

const DropdownUser = () => {
  const location = useLocation();
  const { pathname } = location;

  const userData = useSelector((state) => state.userConfig.classesData); 

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const handleToggle = () => setConfirm((prevState) => !prevState);

  // Logout function
  const handleLogout = () => {
    dispatch(logOutAdmin());
    dispatch(logOut());
    handleToggle();
  };

  const confirmLogout = () => {
    handleLogout();
    toast.success("Logout successfully");
    navigate("/"); 
  };

  return (
    <>
      <div className="relative">
        <div
          onClick={toggleDropdown}
          className="flex items-center gap-4 cursor-pointer"
        >
          <span className="h-12 w-12 rounded-full">
            {userData?.image ? (
              <img
                src={userData?.image}
                alt={userData?.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <img
                src="BEFLogo.png"
                alt={userData?.name}
                className="w-full h-full rounded-full object-cover"
              />
            )}
          </span>
          <span className="hidden text-left lg:block cursor-pointer">
            <span className="block text-sm font-medium text-black dark:text-white">
              {userData?.ownerName || "Welcome user"}
            </span>
            <span className="block text-xs">{userData?.name}</span>
          </span>
          <svg
            className="hidden fill-current cursor-pointer sm:block"
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            />
          </svg>
        </div>

        {/* Dropdown menu */}
        {dropdownOpen && (
          <div className="absolute right-0 top-14 flex w-62.5 flex-col rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <ul className="flex flex-col text-left font-medium capitalize dark:text-white">
              <li onClick={toggleDropdown}>
                <NavLink to="/profileUpdate">
                  <button
                    type="button"
                    className={`${
                      pathname === "/profileUpdate"
                        ? "text-white bg-gray-600"
                        : "text-black"
                    } py-2 px-4 w-full text-left outline-none rounded-md duration-300 ease-in-out capitalize hover:text-white hover:bg-gray-500`}
                  >
                    Profile Update
                  </button>
                </NavLink>
              </li>
              <li onClick={toggleDropdown}>
                <NavLink to="/resetpassword">
                  <button
                    type="button"
                    className={`${
                      pathname === "/resetpassword"
                        ? "text-white bg-gray-600"
                        : "text-black"
                    } py-2 px-4 w-full text-left outline-none rounded-md duration-300 ease-in-out capitalize hover:text-white hover:bg-gray-500`}
                  >
                    Reset Password
                  </button>
                </NavLink>
              </li>
              <li onClick={handleToggle}>
                <button
                  type="button"
                  className="py-2 px-4 w-full text-left outline-none rounded-md duration-300 ease-in-out capitalize hover:text-white hover:bg-gray-500"
                >
                  Log Out
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Confirmation modal for logout */}
      {confirm && (
        <LogoutConfimation
          confirm={confirm}
          onLogout={confirmLogout}
          onCancel={handleToggle}
        />
      )}

      {/* Toast notifications */}
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

export default DropdownUser;
