import React, { useEffect, useState } from "react";
import { FiFilter } from "react-icons/fi";
import Pagination from "../Pagination/Pagination";
import FilterdropDownTest from "../Ui/FilterDropDownTest";

export default function ContestwiseEarn({ data }) {
  const [toggle, setToggle] = useState(false);
  const [filtertype, setFiltertype] = useState("");
  const [contestData, setContestData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataToDisplay, setDataToDisplay] = useState([]);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(contestData.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  function handleChange(e) {
    setFiltertype(e.target.innerText);
  }
  function handleShow() {
    setToggle(!toggle);
  }

  return (
    <>
      <section className="shadow-md space-y-4">
        <div className="flex items-center justify-end">
          <button
            onClick={() => setToggle(!toggle)}
            className="inline-flex items-center space-x-2 rounded-lg px-2 py-2 text-md text-center text-white bg-orange-500 hover:bg-opacity-90  "
          >
            <svg className="font-bold text-white w-4 h-4" viewBox="0 0 16 16">
              <FiFilter />
            </svg>
            <p className=" font-semibold">Filter</p>
          </button>
        </div>
        <div className={`${toggle === true ? "block absolute right-1 z-1" : "hidden"}`}>
          <FilterdropDownTest
            toggle={toggle}
            setToggle={() => handleShow()}
            filtertype={filtertype}
            valueChange={(e) => handleChange(e)}
          />
        </div>
        <div className="bg-white overflow-auto rounded-xl px-0">
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="border-b border-neutral-200  font-medium dark:border-white/10">
              <tr>
                {["Contest Name", "Count", "Earning"].map((header, index) => (
                  <th
                    key={`header-${index}`}
                    scope="col"
                    className="cursor-pointer border-y border-slate-200 bg-slate-300 hover:bg-slate-200 p-4 transition-colors"
                  >
                    <p className="antialiased font-sans text-sm flex items-center justify-between gap-x-2 font-normal">
                      {header}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data &&
                data.contests &&
                data.contests.map((user, index) => {
                  const { contestName, users, totalFees } = user;

                  return (
                    <>
                      <tr
                        key={index}
                        className="border-b border-neutral-200 transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-neutral-600"
                      >
                        <td className="p-3 whitespace-nowrap">{contestName}</td>
                        <td className="p-3 whitespace-nowrap"> {users}</td>
                        <td className="p-3 whitespace-nowrap">{totalFees}</td>
                      </tr>
                    </>
                  );
                })}
            </tbody>
          </table>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </section>
    </>
  );
}
