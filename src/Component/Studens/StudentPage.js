import React, { useEffect, useState } from "react";
import Loading from "../Loader/Loading";
import { fetchDashboardData } from "../../Hooks/dashboardService";
import { useSelector } from "react-redux";
import { fetchUserList } from "../../Hooks/userDataService";
import Pagination from "../Pagination/Pagination";

function StudentPage() {
  const accessToken = useSelector(
    (state) =>
      state.authConfig.userInfo[0]?.data?.token ||
      state.authConfig.userInfo[0]?.token
  );
  const [studentDetails, setStudentDetails] = useState([]);

  const [approve, setApprove] = useState(true);
  const [dataToDisplay, setDataToDisplay] = useState([]);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(studentDetails.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  useEffect(() => {
    setDataToDisplay(studentDetails.slice(start, end));
  }, [currentPage, start, end, studentDetails]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      try {
        const result = await fetchUserList(accessToken);

        if (result && result.success) {

          setStudentDetails(result.dataList);

          setLoading(false);
        } else {
          setError("No data available or invalid response structure.");
        }
      } catch (err) {
        console.error("Error fetching contest data:", err);
        setError(
          err.message || "An error occurred while fetching contest data"
        );
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [accessToken]);

  // useEffect(() => {
  //   console.log(studentDetails);
  // }, [studentDetails]);

  if (loading) return <Loading />;

  return (
    <>
      <section className="shadow-md border-2 bg-white   rounded-xl">
        <div className=" px-0">
          <p className="px-4 py-2 text-2xl text-left font-medium text-gray-700 uppercase">
            Studens Details
          </p>
          <div class="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 ">
              <thead className="border-b border-neutral-200  font-medium dark:border-white/10">
                <tr>
                  {["S/N", "Name", "Total Users", "Approval"].map(
                    (header, index) => (
                      <th
                        key={`${header}-${index}`}
                        scope="col"
                        className="cursor-pointer border-y border-slate-200 bg-slate-300 hover:bg-slate-200 p-4 transition-colors"
                      >
                        <p className="antialiased font-sans text-sm flex items-center justify-between gap-x-2 font-normal">
                          {header}
                        </p>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {dataToDisplay && (
                  <>
                    {dataToDisplay.length > 0 ? (
                      dataToDisplay.map((user, index) => {
                        const { contestName, users } = user;

                        return (
                          <tr
                            key={index}
                            className="border-b border-neutral-200 transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-neutral-600"
                          >
                            <td className="p-3 whitespace-nowrap">
                              {" "}
                              {index + 1}
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              {contestName}
                            </td>
                            <td className="p-3 whitespace-nowrap">{users}</td>

                            <td className="p-4  text-center">
                              <button
                                className={`relative flex items-center justify-center w-[120px] h-8 px-10  select-none rounded-lg text-md align-middle font-sans font-medium text-white transition-all ${
                                  approve
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-red-500 hover:bg-red-600"
                                } active:bg-slate-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none shadow-md`}
                                type="button"
                                onClick={() => setApprove(!approve)}
                              >
                                {approve ? "Accepted" : "Rejected"}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr className="h-16">
                        <td colSpan={4} className="text-center">
                          No data found
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </section>
      {/* <div class="flex flex-wrap justify-center mt-10">
        {studentDetails &&
          studentDetails.contests &&
          studentDetails.contests.map((item, index) => {
            return (
              <div class="p-4 max-w-sm" key={index}>
                <div class="flex rounded-lg h-full dark:bg-gray-800 bg-teal-400 p-8 flex-col">
                  <div class="flex items-center mb-3">
                    <h2 class="text-white dark:text-white text-lg font-medium">
                      {item.contestName}
                    </h2>
                  </div>
                  <div class="flex items-center justify-between">
                    <p class="leading-relaxed text-base text-white dark:text-gray-300">
                      Total user :
                    </p>
                    <p class="leading-relaxed text-base text-white dark:text-gray-300">
                      {item.users}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

        <div class="p-4 max-w-sm">
          <div class="flex rounded-lg h-full dark:bg-gray-800 bg-teal-400 p-8 flex-col">
            <div class="flex items-center mb-3">
              <div class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full dark:bg-indigo-500 bg-indigo-500 text-white flex-shrink-0">
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <h2 class="text-white dark:text-white text-lg font-medium">
                Feature 2
              </h2>
            </div>
            <div class="flex flex-col justify-between flex-grow">
              <p class="leading-relaxed text-base text-white dark:text-gray-300">
                Lorem ipsum dolor sit amet. In quos laboriosam non neque eveniet
                33 nihil molestias. Rem perspiciatis iure ut laborum inventore
                et maxime amet.
              </p>
              <a
                href="/"
                class="mt-3 text-black dark:text-white hover:text-blue-600 inline-flex items-center"
              >
                Learn More
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  class="w-4 h-4 ml-2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div class="p-4 max-w-sm">
          <div class="flex rounded-lg h-full dark:bg-gray-800 bg-teal-400 p-8 flex-col">
            <div class="flex items-center mb-3">
              <div class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full dark:bg-indigo-500 bg-indigo-500 text-white flex-shrink-0">
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <h2 class="text-white dark:text-white text-lg font-medium">
                Feature 3
              </h2>
            </div>
            <div class="flex flex-col justify-between flex-grow">
              <p class="leading-relaxed text-base text-white dark:text-gray-300">
                Lorem ipsum dolor sit amet. In quos laboriosam non neque eveniet
                33 nihil molestias. Rem perspiciatis iure ut laborum inventore
                et maxime amet.
              </p>
              <a
                href="/"
                class="mt-3 text-black dark:text-white hover:text-blue-600 inline-flex items-center"
              >
                Learn More
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  class="w-4 h-4 ml-2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}

export default StudentPage;
