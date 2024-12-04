import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { GoSearch } from "react-icons/go";
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
              </ul>
            </nav>
          </div>
        </div>
        {/* User Dropdown */}
        <div className="items-center gap-3 2xsm:gap-7 flex  px-4 py-4 md:px-6 2xl:px-11">
          <DropdownUser />
          <button
            className="md:hidden text-xl transition-all duration-300 ease-in-out"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? "X" : "☰"}
          </button>
        </div>
      </header>
      <div
        className={`${
          isMenuOpen === true
            ? "block lg:hidden w-full px-4 py-6 bg-slate-200 border-b shadow-default duration-300 ease-linear"
            : "hidden"
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
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Header;
