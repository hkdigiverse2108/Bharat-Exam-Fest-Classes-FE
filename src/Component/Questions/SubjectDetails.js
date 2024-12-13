import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TfiPlus, TfiFilter, TfiPencil } from "react-icons/tfi";
import { AiOutlineDelete } from "react-icons/ai";
import ConfirmationPage from "./ConfirmationPage";
import Loading from "../Loader/Loading";
import NoDataFound from "../Ui/NoDataFound";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FilterSide from "../Filterpage/FilterSide";
import { useDispatch, useSelector } from "react-redux";
import { CurrentQuestion, QuestionList } from "../../Context/Action";
import FilterQuestion from "../Ui/FilterQuestion";
import {
  deleteExistQuestion,
  fetchQuestionsBySubject,
  getQuestionData,
} from "../../Hooks/QuestionsApi";
import { fetchSubjects } from "../../Hooks/getSubjectApi";

function SubjectDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { _id } = useSelector((state) => state.userConfig.classesData);
  const accessToken = useSelector(
    (state) =>
      state.authConfig.userInfo[0]?.data?.token ||
      state.authConfig.userInfo[0]?.token
  );
  const CurrentSubject = useSelector(
    (state) => state.userConfig.CurrentSubject
  );
  const questionList = useSelector((state) => state.userConfig.Questions);

  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [show, setShow] = useState(false);
  const [subjectData, setSubjectData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [totalData, setTotalData] = useState(0);
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

  useEffect(() => {
    if (error) {
      setDeleteError(true);
      setTimeout(() => setDeleteError(false), 3000);
    }
  }, [error]);

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

  async function fetchData() {
    setIsLoading(true);
    setNetworkError("");

    try {
      const { subjects } = await fetchSubjects(
        accessToken,
        _id,
        currentPage,
        limit
      );
      if (!subjects) {
        console.log("No subjects data received");
        return null;
      } else {
        setSubjectData(subjects);
      }

      const data = await fetchQuestionsBySubject(
        accessToken,
        CurrentSubject?._id,
        _id
      );
      if (data) {
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
      } else {
        console.log("No questions data received");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setNetworkError(error.message || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }
  const handleAction = () => {
    setTimeout(() => {
      setConfirm((prev) => !prev);
      fetchData();
    }, 1000);
  };

  const deleteQuestion = async () => {
    setIsLoading(true);
    try {
      const result = await deleteExistQuestion(accessToken, itemToDelete);

      if (result.success) {
        console.log("deleteQuestion result:", result.data);

        toast.success(result.message || "Question deleted successfully.");
        handleAction();
        setItemToDelete(null);
      } else {
        toast.warn(result.message || "Failed to delete question");
      }
    } catch (error) {
      console.error("Error deleting question:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete question"
      );
      setNetworkError(error.message || "Failed to delete question");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [accessToken]);

  return (
    <>
      <section className="bg-white dark:bg-gray-900 p-4 overflow-y-auto min-h-full rounded-lg border border-slate-300 font-sans">
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
            <Loading />
          ) : networkError ? (
            <p className="text-red-500">Error: {networkError}</p>
          ) : (
            <div className="w-full space-y-6 text-left md:gap-16 dark:border-gray-700 font-sans">
              {questions.length > 0 ? (
                <ul className="space-y-4">
                  {filteredQuestions
                    .filter((question) =>
                      subTopicName
                        ? question.subtopicIds &&
                          question.subtopicIds.length > 0 &&
                          question.subtopicIds.includes(subTopicName)
                        : true
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
                <NoDataFound />
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
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
      />
    </>
  );
}
export default SubjectDetails;
