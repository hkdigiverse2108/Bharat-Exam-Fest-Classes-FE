// import React, { useState } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import { RiMenuLine } from "react-icons/ri";
// import "react-toastify/dist/ReactToastify.css";
// import DropdownUser from "./DropdownUser";
// import { useSelector } from "react-redux";

// function Navbar() {
//   const userData = useSelector((state) => state.userConfig.classesData[0]);
//   // console.log(userData);

//   const location = useLocation();
//   const { pathname } = location;
//   const [navbarOpen, setNavbarOpen] = useState(false);
//   function Navigation() {
//     setNavbarOpen(!navbarOpen);
//   }

//   return (
//     <>
//       <header className="sticky top-0 z-20 h-26 px-4 py-4  flex w-full bg-white border-b border-gray-300 drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
//         <div className="flex flex-grow items-center justify-between">
//           <div className="flex items-center justify-start gap-x-20">
//             <div className="w-22 h-22">
//               <NavLink to="/">
//                 <img
//                   src="BEFLogo.png"
//                   alt="Bharat Exam Fest"
//                   className="w-full h-full rounded-md"
//                 />
//               </NavLink>
//             </div>
//             {/* navigationtab */}
//             <nav className="hidden text-right lg:block ">
//               <ul className=" flex items-center justify-start duration-300 ease-linear text-lg font-medium  gap-x-1.5">
//                 <li>
//                   <NavLink
//                     to="/"
//                     className={`${
//                       pathname === "/" && "text-white bg-orange-600"
//                     } group relative flex items-center gap-2.5 outline-none rounded-md duration-300 ease-in-out capitalize hover:text-white hover:bg-gray-600 py-2 px-4 `}
//                   >
//                     Dashboard
//                   </NavLink>
//                 </li>
//                 <li>
//                   <NavLink
//                     to="/subjects"
//                     className={` ${
//                       pathname === "/subjects" ||
//                       pathname === "/subjectDetails" ||
//                       pathname === "/addQuestion" ||
//                       pathname === "/editQuestion"
//                         ? "text-white bg-orange-600"
//                         : "text-black"
//                     } group relative flex items-center gap-2.5 outline-none rounded-md duration-300 ease-in-out capitalize hover:text-white hover:bg-gray-600 py-2 px-4`}
//                   >
//                     Add Question
//                   </NavLink>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//           <div className="flex items-center justify-around gap-2.5">
//             <div className=" items-center">
//               <DropdownUser authData={userData} />
//             </div>
//             <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
//               <button
//                 className=" text-md text-slate-600 p-2 mt-2 hover:bg-slate-6000 hover:text-gray-700 rounded-full lg:hidden xl:hidden 2xl:hidden"
//                 onClick={Navigation}
//                 title="Menu"
//               >
//                 <svg viewBox="0 0 16 16" className="h-6 w-6 ">
//                   <RiMenuLine />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>
//       {/* toggle menu */}
//       {navbarOpen && (
//         <div
//           className={`${
//             navbarOpen === true
//               ? "block lg:hidden w-full px-4 py-6 bg-sky-50 border-b border-gray-300 shadow-md duration-300 ease-linear"
//               : "hidden"
//           }`}
//           id="mobile-menu"
//         >
//           <nav className=" h-full text-md font-medium  overflow-y-auto duration-300 ease-linear ">
//             <ul className="mb-6 flex flex-col gap-1.5">
//               <li>
//                 <NavLink
//                   to="/"
//                   className={`${
//                     pathname === "/" && "text-white bg-orange-600"
//                   } group relative flex items-center gap-2.5 outline-none rounded-md duration-300 ease-in-out capitalize hover:text-white hover:bg-gray-600 py-2 px-4 font-medium `}
//                 >
//                   Dashboard
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/subjects"
//                   className={` ${
//                     pathname === "/subjects" ||
//                     pathname === "/subjectDetails" ||
//                     pathname === "/addQuestion" ||
//                     pathname === "/editQuestion"
//                       ? "text-white bg-orange-600"
//                       : "text-black"
//                   } group relative flex items-center gap-2.5 outline-none rounded-md duration-300 ease-in-out capitalize hover:text-white hover:bg-gray-600 py-2 px-4 font-medium `}
//                 >
//                   Add Question
//                 </NavLink>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       )}
//     </>
//   );
// }
// export default Navbar;
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { GoSearch } from "react-icons/go";
import DropdownUser from "./DropdownUser";

// interface SidebarProps {
//   sidebarOpen: boolean;
//   setSidebarOpen: (arg: boolean) => void;
// }

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  // Retrieve sidebar state from localStorage
  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // Close sidebar if clicked outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [sidebarOpen]);

  // Close sidebar if Escape key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [sidebarOpen]);

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.body.classList.add("sidebar-expanded");
    } else {
      document.body.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <header className="sticky top-0 z-999 h-20 flex w-full bg-white shadow-2  drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center px-4 py-4  md:px-6 2xl:px-11">
        {/* Logo Section */}
        <div className="flex w-16 h-16 items-center gap-2 sm:gap-4">
          <img
            src="BEFlogo.png"
            alt="Bharat Exam Fest"
            className="w-full h-full rounded-sm object-cover"
          />
        </div>

        {/* Navigation Section */}
        <div className="no-scrollbar flex  overflow-y-auto duration-300 ease-linear">
          <nav className="py-4 px-4 lg:px-6">
            <ul className="flex gap-1.5">
              <li>
                <NavLink
                  to="/"
                  className={`${
                    pathname === "/" && "text-white bg-orange-600"
                  } group relative flex items-center gap-2.5 outline-none rounded-md duration-300 ease-in-out capitalize hover:text-white hover:bg-gray-600 py-2 px-4  font-medium`}
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/subjects"
                  className={` ${
                    pathname === "/subjects" ||
                    pathname === "/subjectDetails" ||
                    pathname === "/addQuestion" ||
                    pathname === "/editQuestion"
                      ? "text-white bg-orange-600"
                      : "text-black"
                  } group relative flex items-center gap-2.5 outline-none rounded-md duration-300 ease-in-out capitalize hover:text-white hover:bg-gray-600 py-2 px-4  font-medium`}
                >
                  Add Question
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* User Dropdown */}
      <div className="items-center gap-3 2xsm:gap-7 flex  px-4 py-4 md:px-6 2xl:px-11">
        <DropdownUser />
      </div>
    </header>
  );
};

export default Header;
