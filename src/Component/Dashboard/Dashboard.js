import React from "react";
import { HiOutlineUserGroup } from "react-icons/hi";
import { TfiStatsUp, TfiStatsDown } from "react-icons/tfi";
import { FiBox } from "react-icons/fi";
import { AiOutlineLineChart } from "react-icons/ai";

function Dashboard({ data, earning }) {
  return (
    <>
      <section className="py-4">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-2 xl:grid-cols-4 xl:gap-6 2xl:grid-cols-4 2xl:gap-6">
          <div className="bg-white border rounded-lg p-5 space-y-4 border-stroke py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-row items-center justify-between">
              <div className="text-start">
                <h2 className="font-bold uppercase text-gray-600">
                  Total Contents
                </h2>
              </div>
              <div className=" pr-4">
                <svg
                  className="bg-purple-200 w-16 h-16 text-purple-500 rounded-full px-1 py-3 text-xl dark:fill-white"
                  viewBox="0 0 22 22"
                >
                  <HiOutlineUserGroup />
                </svg>
              </div>
            </div>
            <div className="text-start">
              <p className="font-semibold text-2xl">{data.contests || 0} </p>
            </div>
            <div className="flex items-center gap-x-1 text-md font-medium text-meta-3">
              <svg className="text-green-600 w-6 h-6" viewBox="0 0 16 16">
                <TfiStatsUp />
              </svg>

              <p className=" text-green-600 font-medium  text-left capitalize">
                8.5%
              </p>
              <span className="ml-1 text-slate-600 font-medium ">
                Up from yesterday
              </span>
            </div>
          </div>
          <div className="bg-white border rounded-lg p-5 space-y-4 border-stroke py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-row items-center justify-between">
              <div className=" text-start">
                <h2 className="font-bold uppercase text-gray-600">
                  Total questions
                </h2>
              </div>
              <div className=" pr-4">
                <svg
                  className="bg-yellow-200 w-16 h-16 text-yellow-500 rounded-full px-1 py-3 text-xl dark:fill-white"
                  viewBox="0 0 22 22"
                >
                  <FiBox />
                </svg>
              </div>
            </div>
            <div className="text-start">
              <p className="font-semibold text-2xl">{data.questions || 0}</p>
            </div>
            <div className="flex items-center gap-x-1 text-md font-medium text-meta-3">
              <svg className="text-green-600 w-6 h-6" viewBox="0 0 16 16">
                <TfiStatsUp />
              </svg>

              <p className=" text-green-600 font-medium  text-left capitalize">
                1.5%
              </p>
              <span className="ml-1 text-slate-600 font-medium ">
                Up from yesterday
              </span>
            </div>
          </div>
          <div className="bg-white border rounded-lg p-5 space-y-4 border-stroke py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-row items-center justify-between">
              <div className=" text-start">
                <h2 className="font-bold uppercase text-gray-600">
                  Total Students
                </h2>
              </div>
              <div className=" pr-4">
                <svg
                  className="bg-purple-200 w-16 h-16 text-purple-500 rounded-full px-1 py-3 text-xl dark:fill-white"
                  viewBox="0 0 22 22"
                >
                  <HiOutlineUserGroup />
                </svg>
              </div>
            </div>
            <div className="text-start">
              <p className="font-semibold text-2xl">{data.users ||0}</p>
            </div>
            <div className="flex items-center gap-x-1 text-md font-medium text-meta-3">
              <svg className="text-red-600 w-6 h-6" viewBox="0 0 16 16">
                <TfiStatsDown />
              </svg>

              <p className=" text-red-600 font-medium  text-left capitalize">
                3.5%
              </p>
              <span className="ml-1 text-slate-600 font-medium ">
                Down from yesterday
              </span>
            </div>
          </div>
          <div className="bg-white border rounded-lg p-5 space-y-4 border-stroke py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-row items-center justify-between">
              <div className=" text-start">
                <h2 className="font-bold uppercase text-gray-600">
                  Total Earning
                </h2>
              </div>
              <div className=" pr-4">
                <svg
                  className="bg-green-200 w-16 h-16 text-green-500 rounded-full px-1 py-3 text-xl dark:fill-white"
                  viewBox="0 0 22 22"
                >
                  <AiOutlineLineChart />
                </svg>
              </div>
            </div>
            <div className="text-start">
              <p className="font-semibold text-2xl">
                {earning.overallTotalFees || 0}
              </p>
            </div>
            <div className="flex items-center gap-x-1 text-md font-medium text-meta-3">
              <svg className="text-green-600 w-6 h-6" viewBox="0 0 16 16">
                <TfiStatsUp />
              </svg>

              <p className=" text-green-600 font-medium  text-left capitalize">
                3.5%
              </p>
              <span className="ml-1 text-slate-600 font-medium ">
                Up from yesterday
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default Dashboard;
