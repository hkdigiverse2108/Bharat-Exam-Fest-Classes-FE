import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { RiMenuLine } from "react-icons/ri";

import DropdownUser from "./DropdownUser";

const Header = () => {
  const location = useLocation();
  const { pathname } = location;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <>
      <header className="sticky top-0 z-999 h-20 flex w-full bg-white shadow-2  drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
        <div className="flex flex-grow items-center gap-x-10 px-4 py-4  md:px-6 2xl:px-11">
          <div className="h-18 w-18">
            <img
              src="BEFLogo.png"
              alt="Bharat Exam Fest"
              className="w-full h-full rounded-md object-cover"
            />
          </div>
          {/* Navigation Section */}
          <div className="no-scrollbar flex  overflow-y-auto duration-300 ease-linear">
            <nav className="py-4 px-4 hidden lg:block lg:px-6">
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
                <li>
                  <NavLink
                    to="/student"
                    className={` ${
                      pathname === "/student"
                        ? "text-white bg-orange-600"
                        : "text-black"
                    } group relative flex items-center gap-2.5 outline-none rounded-md duration-300 ease-in-out capitalize hover:text-white hover:bg-gray-600 py-2 px-4  font-medium`}
                  >
                    Students
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        {/* User Dropdown */}
        <div className="items-center gap-x-3 flex  px-4 py-4 ">
          <DropdownUser />

          <button
            className="text-md lg:hidden text-slate-500 p-2 border border-orange-400 hover:bg-orange-100 hover:text-black rounded-full"
            onClick={toggleMenu}
            title="Menu"
          >
            <RiMenuLine className="h-6 w-6" />
          </button>
        </div>
      </header>
      <div
        className={`${
          isMenuOpen === true
            ? "block lg:hidden w-full h-48 px-4 py-6 bg-slate-200 border-b shadow-default transition duration-150 ease-in-out opacity-100 translate-y-0"
            : "hidden opacity-0 -translate-y-full"
        }`}
        id="mobile-menu"
      >
        <nav className="flex flex-col h-full overflow-y-auto duration-300 ease-linear ">
          <ul className="flex flex-col gap-1.5">
            <li>
              <NavLink
                to="/"
                className={`${
                  pathname === "/" && "text-white bg-orange-600"
                } group relative flex items-center gap-2.5 outline-none rounded-md duration-300 ease-in-out capitalize  hover:text-white hover:bg-gray-600 py-2 px-4 font-medium`}
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/subjects"
                className={`${
                  pathname === "/subjects" ||
                  pathname === "/subjectDetails" ||
                  pathname === "/addQuestion" ||
                  pathname === "/editQuestion"
                    ? "text-white bg-orange-600"
                    : "text-black"
                } group relative flex items-center gap-2.5 outline-none rounded-md duration-300 ease-in-out capitalize hover:text-white hover:bg-gray-600 py-2 px-4 font-medium`}
              >
                Add Question
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/student"
                className={` ${
                  pathname === "/student"
                    ? "text-white bg-orange-600"
                    : "text-black"
                } group relative flex items-center gap-2.5 outline-none rounded-md duration-300 ease-in-out capitalize hover:text-white hover:bg-gray-600 py-2 px-4  font-medium`}
              >
                Students
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Header;
