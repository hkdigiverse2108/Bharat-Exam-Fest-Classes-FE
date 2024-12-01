import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TfiPlus, TfiFilter, TfiPencil } from "react-icons/tfi";
import { AiOutlineDelete } from "react-icons/ai";
import ConfirmationPage from "./ConfirmationPage";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FilterSide from "../Filterpage/FilterSide";
import MultiSelection from "../Ui/MultiSelection";
import { useDispatch, useSelector } from "react-redux";
import { CurrentQuestion, QuestionList } from "../../Context/Action";
import SingleSelect from "../Ui/SingleSelect";
import FilterQuestion from "../Ui/FilterQuestion";
import {
  deleteExistQuestion,
  fetchQuestionsBySubject,
  getQuestionData,
} from "../../Hooks/QuestionsApi";
import { fetchSubjects } from "../../Hooks/getSubjectApi";
import Loading from "../Loader/Loading";

function SubjectDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { _id } = useSelector((state) => state.userConfig.classesData);
   const accessToken = useSelector(
    (state) => state.authConfig.userInfo[0]?.data?.token
  );
  const CurrentSubject = useSelector(
    (state) => state.userConfig.CurrentSubject
  );
  const questionList = useSelector((state) => state.userConfig.Questions);

  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [show, setShow] = useState(false);
  const [subjectData, setSubjectData] = useState();
  const [itemToDelete, setItemToDelete] = useState(null);
  const [questions, setQustions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [selectedSubtopic, setSelectedSubtopic] = useState([]);
  const [subTopicName, setSubTopicName] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    concept: false,
    aptitude: false,
    random: false,
    newestFirst: false,
    olderFirst: false,
    lastModified: false,
    // question1: false,
    // question2: false,
    // question3: false,
  });
  const lastModifyfilter = [
    { id: "newestFirst", label: "Newest First", checked: filters.newestFirst },
    { id: "olderFirst", label: "Older First", checked: filters.olderFirst },
    {
      id: "lastModified",
      label: "Last Modified",
      checked: filters.lastModified,
    },
  ];

  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setFilters((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  function handleFilterData() {
    setToggle(!toggle);
  }

  const applyFilters = () => {
    const checkedValues = Object.entries(filters)
      .filter(([key, value]) => value)
      .map(([key]) => key);
    const filteredQuestions = questions.filter(
      (question) =>
        checkedValues.length === 0 || checkedValues.includes(question.type)
    );
    setFilteredQuestions(filteredQuestions);
    handleFilterData();
    console.log("Checked Filters:", filteredQuestions);
  };

  const handleSelectionChange = (e) => {
    const { value } = e.target;
    setSubTopicName(value._id);
    setSelectedSubtopic(value);
  };

  function handleCreateque() {
    navigate("/addQuestion");
  }

  async function handleEditque(valueId) {
    try {
      const responseData = await getQuestionData(accessToken, valueId);
      dispatch(CurrentQuestion(responseData));
      navigate("/editQuestion");
    } catch (err) {
      setError("Failed to load data. Please try again later.");
    }
  }

  const handleDelete = (questionId) => {
    setItemToDelete(questionId);
    setConfirm(true);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState("");
  const [deleteError, setDeleteError] = useState(false);

  const handleFilter = () => {
    handleFilterData();
  };

  const handleCreate = () => {
    handleCreateque();
  };

  // Handle error display
  useEffect(() => {
    if (error) {
      setDeleteError(true);
      setTimeout(() => setDeleteError(false), 3000); // Hide error after 3 seconds
    }
  }, [error]);

  // Fetch subjects data (example from previous part)
  // useEffect(() => {
  //   const fetchSubjectsData = async () => {
  //     setIsLoading(true);
  //     try {
  //       const { subjects } = await fetchSubjects(accessToken, _id);
  //       setSubjectData(subjects);
  //       // setQustions(totalQuestions);
  //       setIsLoading(false); // Set loading to false after data is fetched
  //     } catch (error) {
  //       setIsLoading(false); // Set loading to false if there's an error
  //       setNetworkError(error.message || "Network error occurred"); // Store the error message
  //       toast.error(
  //         "Error fetching subjects: " + (error.message || "Unknown error")
  //       ); // Show error toast
  //     }
  //   };

  //   fetchSubjectsData();
  // }, [_id, accessToken]);

  // // Get Questions function
  // const getQuestions = async () => {
  //   setIsLoading(true); // Set loading to true before making the API call
  //   try {
  //     const data = await fetchQuestionsBySubject(
  //       accessToken,
  //       CurrentSubject?._id,
  //       _id
  //     );
  //     if (!data) {
  //       console.log("No data received", data);
  //       return;
  //     }

  //     const { Questions = [], subTopics = [] } = data;
  //     setQustions(Questions);
  //     setSubtopics(subTopics);
  //     dispatch(CurrentQuestion(Questions));

  //     const filteredData = subTopics.filter((subject) =>
  //       CurrentSubject?.subTopics?.some(
  //         (criteria) => subject._id === criteria._id
  //       )
  //     );

  //     if (filteredData.length > 0) {
  //       setSelectedSubtopic(filteredData[0]);
  //     } else {
  //       console.log("No matching subtopics found");
  //     }
  //   } catch (err) {
  //     console.error("Error fetching questions:", err);
  //     setNetworkError(
  //       `Error fetching questions: ${err.message || "Unknown error"}`
  //     );
  //     toast.error(err.message || "Error fetching questions");
  //   } finally {
  //     setIsLoading(false); // Set loading to false after the request is done
  //   }
  // };

  // // Delete question function
  // const deleteQuestion = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await deleteExistQuestion(accessToken, itemToDelete);

  //     if (response.status === 200) {
  //       console.log("deleteQuestion response:", response);
  //       const successMessage =
  //         response.data?.message || "Question deleted successfully.";
  //       toast.success(successMessage);

  //       // Call the function to refresh or get the updated list of questions
  //       getQuestions();

  //       // Close the confirmation dialog and reset the item to delete
  //       setConfirm(false);
  //       setItemToDelete(null);
  //     } else {
  //       // If the API doesn't return a success status, show an error message
  //       toast.warn(response.data?.message || "Failed to delete question");
  //     }
  //   } catch (error) {
  //     console.error("Error deleting question:", error);

  //     // Handle different types of errors:
  //     // - Network errors
  //     // - API errors
  //     toast.error(
  //       error.response?.data?.message ||
  //         error.message ||
  //         "Failed to delete question"
  //     );
  //     setNetworkError(error.message || "Failed to delete question");
  //   } finally {
  //     setIsLoading(false); // Always set loading to false after the operation is done
  //   }
  // };

  // Sorting Questions based on filters
  const sortedQuestions = useMemo(() => {
    if (!Array.isArray(questions)) {
      console.error("Questions is not an array:", questions);
      return [];
    }

    let sorted = [...questions];
    if (filters.newestFirst) {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.olderFirst) {
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (filters.lastModified) {
      sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    return sorted;
  }, [questions, filters]);

  useEffect(() => {
    setFilteredQuestions(sortedQuestions);
  }, [sortedQuestions]);

  useEffect(() => {
    if (Array.isArray(questions)) {
      const initialFilters = {};
      questions.forEach((question) => {
        if (question.type) {
          initialFilters[question.type] = true;
        }
      });
      setFilters((prev) => ({
        ...prev,
        ...initialFilters,
      }));
    } else {
      console.error("Questions is not an array:", questions);
    }
  }, [questions]);

  // When CurrentSubject or _id changes, fetch questions
  // useEffect(() => {
  //   if (CurrentSubject?._id && _id) {
  //     getQuestions();
  //   }
  // }, [CurrentSubject?._id, _id]);

  const debounceTimeoutRef = useRef(null);

  // Debounced function to fetch subjects
  const handleGetData = useCallback(async () => {
    setIsLoading(true);
    setNetworkError("");

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const { subjects } = await fetchSubjects(accessToken, _id, signal);

      if (!subjects) {
        console.log("No data received");
        return;
      }

      setSubjectData(subjects);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("Failed to fetch subjects.", error);
        setNetworkError(error.message || "Unknown error");
        toast.error(
          "Error fetching subjects: " + (error.message || "Unknown error")
        );
      }
    } finally {
      setIsLoading(false);
    }

    return () => {
      controller.abort(); // Cleanup function to abort the fetch
    };
  }, [accessToken, _id]);

  // Debounced function to fetch questions
  const handleGetQuestions = useCallback(async () => {
    setIsLoading(true);
    setNetworkError("");

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const data = await fetchQuestionsBySubject(
        accessToken,
        CurrentSubject?._id,
        _id,
        signal
      );

      if (!data) {
        console.log("No data received");
        return;
      }

      const { Questions = [], subTopics = [] } = data;
      setQustions(Questions);
      setSubtopics(subTopics);
      const filteredData = subTopics.filter((subject) =>
        CurrentSubject?.subTopics?.some(
          (criteria) => subject._id === criteria._id
        )
      );

      if (filteredData.length > 0) {
        setSelectedSubtopic(filteredData[0]);
      } else {
        console.log("No matching subtopics found");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("Error fetching questions:", err);
        setNetworkError(
          `Error fetching questions: ${err.message || "Unknown error"}`
        );
        toast.error(err.message || "Error fetching questions");
      }
    } finally {
      setIsLoading(false);
    }

    return () => {
      controller.abort(); // Cleanup function to abort the fetch
    };
  }, [accessToken, _id, CurrentSubject]);

  // Debounce logic: delay the API call
  const debounceGetData = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current); // Clear previous timeout
    }

    debounceTimeoutRef.current = setTimeout(() => {
      handleGetQuestions();
    }, 500); // Adjust debounce delay (500ms)
  }, [handleGetQuestions]);

  // useEffect hook to trigger debounced API request on dependencies change for subjects
  useEffect(() => {
    handleGetData();

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current); // Cleanup on unmount
      }
    };
  }, [handleGetData, accessToken, _id]);

  // useEffect hook to trigger debounced API request on dependencies change for questions
  useEffect(() => {
    debounceGetData();

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current); // Cleanup on unmount
      }
    };
  }, [debounceGetData, accessToken, _id, CurrentSubject]);

  // Delete question function
  const deleteQuestion = async () => {
    setIsLoading(true); // Start loading state
    try {
      const response = await deleteExistQuestion(accessToken, itemToDelete);

      if (response.status === 200) {
        console.log("deleteQuestion response:", response);
        const successMessage =
          response.data?.message || "Question deleted successfully.";
        toast.success(successMessage);

        // Call the debounced function to refresh the questions list
        debounceGetData();

        // Close the confirmation dialog and reset the item to delete
        setConfirm(false);
        setItemToDelete(null);
      } else {
        // If the API doesn't return a success status, show an error message
        toast.warn(response.data?.message || "Failed to delete question");
      }
    } catch (error) {
      console.error("Error deleting question:", error);

      // Handle different types of errors:
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete question"
      );
      setNetworkError(error.message || "Failed to delete question");
    } finally {
      setIsLoading(false); // Always set loading to false after the operation is done
    }
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900 p-4 overflow-y-auto rounded-lg border border-slate-300 font-sans">
        <div className="space-y-10">
          {/* Filter and Create Buttons */}
          <div className="space-y-4">
            <div className="flex items-center justify-end space-x-4">
              {/* Filter Button */}
              <button
                onClick={handleFilter}
                className="inline-flex items-center space-x-2 rounded-lg px-2 py-2 text-md text-center uppercase text-orange-400 border border-orange-500 hover:bg-opacity-90"
              >
                <TfiFilter className="font-bold text-orange-400 w-4 h-4" />
                <p className="font-semibold">Filter</p>
              </button>

              {/* Create New Question Button */}
              <button
                onClick={handleCreate}
                className="inline-flex items-center space-x-2 rounded-lg px-2 py-2 text-md text-center uppercase text-white bg-orange-500 hover:bg-opacity-90"
              >
                <TfiPlus className="font-bold text-white w-4 h-4" />
                <p className="font-semibold">Create New Question</p>
              </button>
            </div>

            <div className="space-y-2 flex flex-col items-start w-full">
              <p className="text-3xl tracking-tight font-semibold text-left text-gray-900 dark:text-white uppercase">
                {CurrentSubject.name}
              </p>
              <div className="w-full grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-2 xl:grid-cols-4 xl:gap-2 2xl:grid-cols-4 2xl:gap-6">
                <FilterQuestion
                  label="Subject"
                  value={selectedSubtopic}
                  onChange={handleSelectionChange}
                  options={subtopics}
                />
              </div>
            </div>
          </div>


          {isLoading ? (
            <Loading/>
          ) : networkError ? (
            <p className="text-red-500">Error: {networkError}</p>
          ) : (
            <div className="w-full space-y-6 text-left md:gap-16 dark:border-gray-700 font-sans">
              {questions.length > 0 ? (
                <ul className="space-y-4">
                  {filteredQuestions
                    .filter((question) =>
                      subTopicName !== null
                        ? question.subtopicIds &&
                          question.subtopicIds.length > 0 &&
                          question.subtopicIds.includes(subTopicName)
                        : question
                    )
                    .map((value, index) => (
                      <li key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-lg font-medium text-gray-900 dark:text-white">
                          <div className="flex items-center justify-between gap-x-4">
                            <p className="text-lg font-medium text-blue-gray-900 capitalize">
                              {index + 1}
                            </p>
                            <p className="text-lg font-medium text-blue-gray-900 capitalize">
                              {value.englishQuestion.question}
                            </p>
                          </div>
                          <div className="flex items-center justify-end space-x-4 pr-2">
                            <span
                              className={`${
                                value.type === "concept"
                                  ? "bg-green-100 text-green-600"
                                  : value.type === "aptitude"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : value.type === "random"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-gray-100 text-gray-900"
                              } px-4 text-sm leading-8 font-medium rounded-full capitalize`}
                            >
                              {value.type}
                            </span>
                            <button
                              onClick={() => handleDelete(value._id)}
                              className="inline-flex items-center space-x-2 rounded-lg px-2 py-2 text-md text-center uppercase bg-red-100 border hover:bg-opacity-90"
                            >
                              <AiOutlineDelete className="font-bold w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleEditque(value._id)}
                              className="inline-flex items-center space-x-2 rounded-lg px-2 py-2 text-md text-center uppercase bg-green-100 border hover:bg-opacity-90"
                            >
                              <TfiPencil className="font-bold w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <div className="rounded-md border border-gray-300 px-6 py-4 text-md text-justify font-normal text-gray-500 dark:text-gray-400 shadow-inner">
                          {value.englishQuestion.solution}
                        </div>
                      </li>
                    ))}
                </ul>
              ) : (
                <p>No questions found</p>
              )}
            </div>
          )}

          <div className={`${confirm === true ? "block" : "hidden"}`}>
            <ConfirmationPage
              confirm={confirm}
              onDelete={deleteQuestion}
              onCancel={handleDelete}
            />
          </div>

          <div className={`${toggle === true ? "block" : "hidden"}`}>
            <FilterSide
              filterData={filters}
              lastModify={lastModifyfilter}
              onChange={handleCheckboxChange}
              apply={applyFilters}
              onClose={handleFilterData}
            />
          </div>
        </div>
      </section>
      <ToastContainer
        draggable={false}
        autoClose={2000}
        position={"top-center"}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={false}
        theme="dark"
      />
    </>
  );
}
export default SubjectDetails;
