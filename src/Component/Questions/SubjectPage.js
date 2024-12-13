import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { CurrentData, SubjectData } from "../../Context/Action/index";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubjects, fetchTotalCount } from "../../Hooks/getSubjectApi";
import Loading from "../Loader/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SubjectPage() {
  const { _id } = useSelector((state) => state.userConfig.classesData);
  const accessToken = useSelector(
    (state) =>
      state.authConfig.userInfo[0]?.data?.token ||
      state.authConfig.userInfo[0]?.token
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [totalQuestion, setTotalQuestion] = useState([]);
  const [error, setError] = useState(null);

  async function handleSubject(value) {
    dispatch(CurrentData(value));
    navigate("/subjectDetails");
  }

  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState("");

  const debounceTimeoutRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [displayedSubjects, setDisplayedSubjects] = useState([]);
  const fetchData = async () => {
    try {
      const response = await fetchSubjects(
        accessToken,
        _id,
        currentPage,
        limit
      );

      setTotalData(response.subjects?.totalData);

      setData(response?.subjects?.subject_data);
      setTotalQuestion(response?.totalQuestions);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [accessToken]);

  
  return (
    <>
      <section>
        {isLoading ? (
          <div className="text-center py-4">
            <Loading />
          </div>
        ) : networkError ? (
          <div className=" text-red-500 text-center py-3 px-4 rounded-md mb-4">
            <p>{networkError}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-2 xl:grid-cols-4 xl:gap-3 2xl:grid-cols-4 2xl:gap-6">
              {data.map((value, index) => {
                const matchingQuestion = totalQuestion.filter(
                  (q) => q.subjectName === value.name
                );

                return (
                  <div
                    className="bg-white shadow-md border rounded-lg p-5 space-y-4 cursor-pointer"
                    onClick={() => handleSubject(value)}
                    key={index}
                  >
                    <div className="flex flex-row items-center justify-between">
                      <p className="font-semibold text-left text-xl uppercase text-orange-500">
                        {value.name}
                      </p>
                      <div className="pr-4">
                        <img
                          src={value?.image}
                          className="block w-24 h-20 px-5 py-2 shadow-sm rounded-md"
                          alt={value.name}
                        />
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-slate-600 text-xl capitalize">
                        Total Questions
                      </p>
                      <p className="text-2xl text-gray-800 font-medium">
                        {matchingQuestion[0]?.count || 0}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
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

// Sample data structure
// const subjects = {
//   subject_data: [
//     // ... (your subject data here)
//     { _id: "1", name: "Subject 1", image: "https://via.placeholder.com/150" },
//     { _id: "2", name: "Subject 2", image: "https://via.placeholder.com/150" },
//     { _id: "3", name: "Subject 3", image: "https://via.placeholder.com/150" },
//     { _id: "4", name: "Subject 4", image: "https://via.placeholder.com/150" },
//     { _id: "5", name: "Subject 5", image: "https://via.placeholder.com/150" },
//     { _id: "6", name: "Subject 6", image: "https://via.placeholder.com/150" },
//     { _id: "7", name: "Subject 7", image: "https://via.placeholder.com/150" },
//     { _id: "8", name: "Subject 8", image: "https://via.placeholder.com/150" },
//     { _id: "9", name: "Subject 9", image: "https://via.placeholder.com/150" },
//     { _id: "10", name: "Subject 10", image: "https://via.placeholder.com/150" },
//     { _id: "11", name: "Subject 11", image: "https://via.placeholder.com/150" },
//     { _id: "12", name: "Subject 12", image: "https://via.placeholder.com/150" },
//     { _id: "13", name: "Subject 13", image: "https://via.placeholder.com/150" },
//     { _id: "14", name: "Subject 14", image: "https://via.placeholder.com/150" },
//     { _id: "15", name: "Subject 15", image: "https://via.placeholder.com/150" },
//   ],
//   totalData: 15,
//   state: {
//     page: 1, // Current page
//     limit: 10, // Number of items per page
//     page_limit: 2, // Number of pages to show in pagination
//   },
// };

// const SubjectPage = () => {
//   const [currentPage, setCurrentPage] = useState(subjects.state.page);
//   const [limit] = useState(subjects.state.limit);
//   const [pageLimit] = useState(subjects.state.page_limit);
//   const [displayedSubjects, setDisplayedSubjects] = useState([]);

//   useEffect(() => {
//     // Calculate the start and end index for slicing
//     const startIndex = (currentPage - 1) * limit;
//     const endIndex = startIndex + limit;

//     // Get the subjects for the current page
//     const currentSubjects = subjects.subject_data.slice(startIndex, endIndex);

//     // Get the subjects for the next page if within bounds
//     const nextPageSubjects = subjects.subject_data.slice(
//       endIndex,
//       endIndex + limit
//     );

//     setDisplayedSubjects([...currentSubjects, ...nextPageSubjects]);
//   }, [currentPage, limit]);

//   const totalPages = Math.ceil(subjects.totalData / limit);

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   return (
//     <div>
//       <h1>Subjects</h1>
//       <ul className="flex gap-2">
//         {displayedSubjects.map((subject) => (
//           <li key={subject._id}>
//             <h2>{subject.name}</h2>
//             <img src={subject.image} alt={subject.name} />
//             {/* Render other subject details as needed */}
//           </li>
//         ))}
//       </ul>
//       <div>
//         <p>Total Subjects: {subjects.totalData}</p>
//         <p>
//           Showing page {currentPage} of {totalPages}
//         </p>
//         <div>
//           {/* Pagination Controls */}
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//           >
//             Previous
//           </button>{" "}
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

export default SubjectPage;
