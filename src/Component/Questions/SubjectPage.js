import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
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
    (state) => state.authConfig.userInfo[0]?.data?.token
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

  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [networkError, setNetworkError] = useState(""); // Error state

  const debounceTimeoutRef = useRef(null);

  // Debounced function to fetch subjects
  const handleGetData = useCallback(async () => {
    setIsLoading(true);
    setNetworkError("");

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      // Use the fetchSubjects function, passing the necessary parameters
      const { totalQuestions, subjects } = await fetchSubjects(accessToken, _id, signal);
console.log(subjects);

      if (!subjects || !totalQuestions) {
        console.log("No data received");
        return;
      }

      // Set the fetched data
      setData(subjects);
      setTotalQuestion(totalQuestions);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("Failed to fetch data.", error);
        setNetworkError(error.message || "Unknown error");
      }
    } finally {
      setIsLoading(false);
    }

    return () => {
      controller.abort(); // Cleanup function to abort the fetch
    };
  }, [accessToken, _id]);

  // Debounce logic: delay the API call
  const debounceGetData = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current); // Clear previous timeout
    }

    debounceTimeoutRef.current = setTimeout(() => {
      handleGetData();
    }, 500); // Adjust debounce delay (500ms)
  }, [handleGetData]);

  // useEffect hook to trigger debounced API request on dependencies change
  useEffect(() => {
    debounceGetData();

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current); // Cleanup on unmount
      }
    };
  }, [debounceGetData, accessToken, _id]);
  
  // useEffect(() => {
  //   const fetchSubjectsData = async () => {
  //     setIsLoading(true);
  //     try {
  //       const { totalQuestions, subjects } = await fetchSubjects(accessToken, _id);
  //       setData(subjects);
  //       setTotalQuestion(totalQuestions);
  //       setIsLoading(false);
  //     } catch (error) {
  //       setNetworkError(error.message || "Network error occurred");
  //       console.error(
  //         "Error fetching subjects: " + (error.message || "Unknown error")
  //       );
  //     }
  //   };

  //   fetchSubjectsData();
  // }, [_id, accessToken]);
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
export default SubjectPage;
