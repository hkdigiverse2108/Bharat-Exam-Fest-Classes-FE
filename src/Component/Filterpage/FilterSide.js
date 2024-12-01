import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
// import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function filterDataide({ filterData, onChange, apply, onClose, lastModify }) {
  return (
    <div className="fixed z-50 inset-0 overflow-hidden duration-300 ease-in-out">
      <div className="flex items-center max-w-sm min-h-screen text-center">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-80" onClick={onClose}></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          className="absolute right-0 inline-block w-full min-h-screen bg-white rounded-l-xl space-y-4 px-4 pt-5 pb-4 text-left overflow-hidden transform transition-all sm:max-w-sm sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="text-black w-full bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-lg px-4 py-2.5 text-center inline-flex items-center justify-between dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
            <p className="text-lg"> Filter & Short</p>
            <button
              id="dropdownDefault"
              data-dropdown-toggle="dropdown"
              className=""
              type="button"
              onClick={onClose}
            >
              <svg className="w-4 h-4 ml-2" viewBox="0 0 16 16">
                <RxCross1 />
              </svg>
            </button>
          </div>
          <div
            id="dropdown"
            className="p-3 text-black rounded-lg space-y-4  dark:bg-gray-700"
          >
            <div className="rounded-lg space-y-2 shadow p-4">
              <h6 className=" text-lg font-medium text-gray-700 dark:text-white">
                Question Type
              </h6>
              <ul
                className="space-y-2 text-sm"
                aria-labelledby="dropdownDefault"
              >
                <li className="flex items-center justify-between">
                  <label
                    htmlFor="concept"
                    className="ml-2 text-md capitalize font-medium text-gray-700 dark:text-gray-100"
                  >
                    concept
                  </label>
                  <input
                    id="concept"
                    type="checkbox"
                    name="concept"
                    checked={filterData.concept}
                    onChange={onChange}
                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded-md text-primary-600 dark:bg-gray-600 dark:border-gray-500"
                  />
                </li>

                <li className="flex items-center justify-between">
                  <label
                    htmlFor="aptitude"
                    className="ml-2 capitalize text-md font-medium text-gray-700 dark:text-gray-100"
                  >
                    aptitude
                  </label>
                  <input
                    id="aptitude"
                    type="checkbox"
                    name="aptitude"
                    checked={filterData.aptitude}
                    onChange={onChange}
                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded-md text-primary-600 dark:bg-gray-600 dark:border-gray-500"
                  />
                </li>

                <li className="flex items-center justify-between">
                  <label
                    htmlFor="random"
                    className="ml-2 capitalize text-md font-medium text-gray-700 dark:text-gray-100"
                  >
                    random
                  </label>
                  <input
                    id="random"
                    type="checkbox"
                    name="random"
                    checked={filterData.random}
                    onChange={onChange}
                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded-md text-primary-600 dark:bg-gray-600 dark:border-gray-500"
                  />
                </li>
              </ul>
            </div>
            <div className="rounded-lg space-y-2 shadow p-4">
              <h6 className=" text-lg font-medium text-gray-700 dark:text-white">
                Last Modified
              </h6>
              <h6 className=" text-md font-normal text-orange-500 dark:text-white">
                Sort By
              </h6>
              <ul
                className="space-y-2 text-sm"
                aria-labelledby="dropdownDefault"
              >
                {lastModify.map((option) => (
                  <li
                    key={option.id}
                    className="flex items-center justify-between"
                  >
                    <label
                      htmlFor={option.id}
                      className="ml-2 text-md font-medium text-gray-700 dark:text-gray-100"
                    >
                      {option.label}
                    </label>
                    <input
                      id={option.id}
                      type="radio"
                      name="sortOrder"
                      checked={option.checked}
                      onChange={onChange}
                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded-md text-primary-600 dark:bg-gray-600 dark:border-gray-500"
                    />
                  </li>
                ))}
              </ul>
             
            </div>  
          </div>
          <div className="w-full flex items-center space-x-4">
            <button
              type="button"
              onClick={onClose}
              data-behavior="cancel"
              className="w-full rounded-md border border-orange-700 shadow-sm px-4 py-2 bg-white text-base font-medium text-orange-700 hover:text-orange-600 focus:outline-none focus:ring-0 sm:text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={apply}
              data-behavior="commit"
              className="w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-500 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default filterDataide;
