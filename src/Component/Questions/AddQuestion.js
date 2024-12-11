import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import MultiSelection from "../Ui/MultiSelection";
import { VscSaveAs } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SingleSelect from "../Ui/SingleSelect";
import RadioButtons from "../Ui/RadioButtons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HindiQuestionPairForm from "./QuestionType/Add/HindiQuestionBase/HindiQuestionPairForm";
import EnglishQuestionPairForm from "./QuestionType/Add/EnglishQuestionBase/EnglishQuestionPairForm";
import EnglishQueStatementBaseform from "./QuestionType/Add/EnglishQuestionBase/EnglishQueStatmentBaseform";
import NormalquestionBaseForm from "./QuestionType/Add/EnglishQuestionBase/NormalQuestionBaseForm";
import NormalHindQueBaseForm from "./QuestionType/Add/HindiQuestionBase/NormalHindQueBaseForm";
import HindiQueStatementBaseform from "./QuestionType/Add/HindiQuestionBase/HindiQueStatementBaseform";
import { addNewQuestion } from "../../Hooks/QuestionsApi";
import { fetchData } from "../../Hooks/getSubjectApi";
import Loading from "../Loader/Loading";

function AddQuestion() {
  const navigate = useNavigate();
  const classId = useSelector(
    (state) =>
      state.authConfig.userInfo[0]?.data?._id ||
      state.authConfig.userInfo[0]?._id
  );

  const accessToken = useSelector(
    (state) =>
      state.authConfig.userInfo[0]?.data?.token ||
      state.authConfig.userInfo[0]?.token
  );
  const subject = useSelector((state) => state.userConfig?.CurrentSubject?._id);

  const [questionType, setQuestionType] = useState("normal");
  const [isLoading, setIsLoading] = useState(true);
  const [networkError, setNetworkError] = useState("");
  const [type, setType] = useState("concept");
  const [subtopics, setSubtopics] = useState([]);
  const [subjectname, setSubjectname] = useState([]);
  const [selectedSubtopic, setSelectedSubtopic] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const getInitialEditQuestionState = (TypeofQuestion) => {
    const commonFields = {
      subjectId: subject,
      classesId: classId,
      subtopicIds: [],
      type: type,
      questionType: "normal",
      englishQuestion: {
        question: "",
        options: { A: "", B: "", C: "", D: "" },
        answer: "",
        solution: "",
        statementQuestion: [],
        pairQuestion: [],
      },
      hindiQuestion: {
        question: "",
        options: { A: "", B: "", C: "", D: "" },
        answer: "",
        solution: "",
        statementQuestion: [],
        pairQuestion: [],
      },
    };

    if (TypeofQuestion === "normal") {
      return commonFields;
    } else {
      return {
        ...commonFields,
        englishQuestion: {
          ...commonFields.englishQuestion,
          lastQuestion: "",
        },
        hindiQuestion: {
          ...commonFields.hindiQuestion,
          lastQuestion: "",
        },
      };
    }
  };

  const [addQuestion, setAddQuestion] = useState(
    getInitialEditQuestionState(questionType)
  );

  const debounceTimeoutRef = useRef(null);

  const [options, setOptions] = useState({
    AnswerOption: { A: false, B: false, C: false, D: false },
  });

  const handleCheck = (event) => {
    const selectedValue = event.target.value;
    setOptions((prev) => {
      const newOptions = { ...prev };
      Object.keys(newOptions.AnswerOption).forEach((key) => {
        newOptions.AnswerOption[key] = key === selectedValue;
      });
      return newOptions;
    });

    setAddQuestion((prev) => ({
      ...prev,
      englishQuestion: {
        ...prev.englishQuestion,
        answer: selectedValue,
      },
      hindiQuestion: {
        ...prev.hindiQuestion,
        answer: selectedValue,
      },
    }));
  };

  const radioOptions = [
    { label: "concept", value: "concept" },
    { label: "aptitude", value: "aptitude" },
    { label: "random", value: "random" },
  ];

  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setType(newType);
    setAddQuestion((prev) => ({
      ...prev,
      type: newType,
    }));
  };

  const handleSubjectChange = (event) => {
    const selectedOptionId = event.target.value;
    const selectedOption = subjectname.find(
      (subject) => subject._id === selectedOptionId
    );
    setAddQuestion((prev) => ({ ...prev, subjectId: selectedOptionId }));
    setSelectedSubject(selectedOption || "");
  };

  const handleSubtopicChange = (event) => {
    const { value } = event.target;
    const uniqueValues = Array.from(new Set(value.map((item) => item._id)));
    setSelectedSubtopic(value);
    setAddQuestion((prev) => ({
      ...prev,
      subtopicIds: uniqueValues,
    }));
  };

  const addStatementQuestion = (value, language) => {
    if (!value?.rowData) {
      console.log("No row data available");
      return;
    }
    console.log(value.rowData);

    const { statement, id } = value.rowData;

    // Handle delete action
    if (value.type === "delete") {
      setAddQuestion((prev) => {
        const updatedStatements = prev[language].statementQuestion.filter(
          (item) => item.id !== id // Filter out the item with the matching id
        );
        console.log("Updated statements after delete:", updatedStatements);

        return {
          ...prev,
          [language]: {
            ...prev[language],
            statementQuestion: updatedStatements, // Update the statementQuestion array without the deleted item
          },
        };
      });

      console.log(`Deleted statement with id: ${id} from ${language}`);
      return; // Exit the function after deleting the statement
    }

    // Validate the statement
    if (typeof statement !== "string") {
      console.log("Invalid input data: statement is not a string");
      return;
    }

    if (!statement.trim()) {
      console.log("Invalid pair: Missing statement");
      return;
    }

    const finalCombined = {
      id: id,
      statement: statement,
    };

    // Update based on language
    if (language === "englishQuestion") {
      setAddQuestion((prev) => {
        // Check if the statement with the given id exists and update it, otherwise add the new one
        const updatedStatements = prev.englishQuestion.statementQuestion.map(
          (item) => (item.id === id ? { ...item, ...finalCombined } : item)
        );

        // If the statement doesn't exist, push it
        if (!updatedStatements.some((item) => item.id === id)) {
          updatedStatements.push(finalCombined);
        }

        return {
          ...prev,
          englishQuestion: {
            ...prev.englishQuestion,
            statementQuestion: updatedStatements,
          },
        };
      });
    } else if (language === "hindiQuestion") {
      setAddQuestion((prev) => {
        // Check if the statement with the given id exists and update it, otherwise add the new one
        const updatedStatements = prev.hindiQuestion.statementQuestion.map(
          (item) => (item.id === id ? { ...item, ...finalCombined } : item)
        );

        // If the statement doesn't exist, push it
        if (!updatedStatements.some((item) => item.id === id)) {
          updatedStatements.push(finalCombined);
        }

        console.log("Updated statements:", updatedStatements);

        return {
          ...prev,
          hindiQuestion: {
            ...prev.hindiQuestion,
            statementQuestion: updatedStatements,
          },
        };
      });
    }
  };

  const handleStatementQuestionChange = (event) => {
    const { name, value } = event.target;
    const [lang, field, option] = name.split(".");
    const currentQuestionType = addQuestion.questionType;

    if (currentQuestionType === "pair") {
      const updatedPairQuestions = [value];

      setAddQuestion((prev) => ({
        ...prev,
        [lang]: {
          ...prev[lang],
          [field]: updatedPairQuestions,
          lastQuestion: value,
        },
      }));
    } else if (currentQuestionType === "statement") {
      // Logic for handling normal statement questions
      const updatedStatements = [...addQuestion[lang].statements, value];

      setAddQuestion((prev) => ({
        ...prev,
        [lang]: {
          ...prev[lang],
          [field]: updatedStatements,
          lastQuestion: value,
        },
      }));
    }
  };

  const handlePairQuestionChange = (language, index, field, value) => {
    const updatedPairQuestion = [...addQuestion[language].pairQuestion];
    updatedPairQuestion[index] = {
      ...updatedPairQuestion[index],
      [field]: value,
    };
    setAddQuestion({
      ...addQuestion,
      [language]: {
        ...addQuestion[language],
        pairQuestion: updatedPairQuestion,
      },
    });
  };

  const [inputs, setInputs] = useState({
    english: {
      input1: "",
      input2: "",
    },
    hindi: {
      input1: "",
      input2: "",
    },
  });

  const handleInputChange = (language, e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [language]: {
        ...prevInputs[language],
        [name]: value,
      },
    }));
  };

  const handleAddPair = (value, language) => {
    console.log(value);

    if (!value?.rowData) {
      console.log("No row data available");
      return;
    }

    const { pairA, pairB, id } = value.rowData;

    // Handle delete action
    if (value.type === "delete") {
      setAddQuestion((prev) => {
        // Remove the pair question with the matching id
        const updatedPair = prev[language].pairQuestion.filter(
          (item) => item.id !== id
        );

        return {
          ...prev,
          [language]: {
            ...prev[language],
            pairQuestion: updatedPair,
          },
        };
      });
      console.log(`Deleted pair with id: ${id}`);
      return; // Exit early after handling the delete
    }

    // Validate pair data
    if (typeof pairA !== "string" || typeof pairB !== "string") {
      console.log("Invalid input data: pairA or pairB is not a string");
      return;
    }

    if (!pairA || !pairB) {
      toast.warn("Invalid pair: Missing pairA or pairB");
      return;
    }

    // Combine pairA and pairB into a single string
    const combinedPair = `${pairA} --- ${pairB}`;

    // Prepare the final object with id and combined pair data
    const finalCombined = {
      id: id,
      combined: combinedPair,
    };

    // Update the pair question data in the state
    setAddQuestion((prev) => {
      // Update or add the pair question based on the id
      const updatedPairQuestion = prev[language].pairQuestion.map((pair) =>
        pair.id === id ? { ...pair, ...finalCombined } : pair
      );

      // If the pair doesn't exist in the array, push it as a new pair
      if (!updatedPairQuestion.some((pair) => pair.id === id)) {
        updatedPairQuestion.push(finalCombined);
      }

      // Return the updated state
      return {
        ...prev,
        [language]: {
          ...prev[language],
          pairQuestion: updatedPairQuestion,
        },
      };
    });

    console.log(`Updated pair with id: ${id}, Combined pair: ${combinedPair}`);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    const [lang, field, option] = name.split(".");
    if (lang === "englishQuestion" || lang === "hindiQuestion") {
      if (field === "options" && option) {
        setAddQuestion((prev) => ({
          ...prev,
          [lang]: {
            ...prev[lang],
            options: {
              ...prev[lang].options,
              [option]: value,
            },
          },
        }));
      } else {
        setAddQuestion((prev) => ({
          ...prev,
          [lang]: {
            ...prev[lang],
            [field]: value,
          },
        }));
      }
    } else {
      setAddQuestion((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleGetData = useCallback(async () => {
    setIsLoading(true);
    setNetworkError("");

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const { subjects, subTopic } = await fetchData(
        accessToken,
        subject,
        signal
      );

      if (!subjects || subjects.length === 0 || !subTopic) {
        console.log("No data received");
        setSubjectname([]);
        setSelectedSubject("");
        setSubtopics([]);
        return;
      }

      setSubjectname(subjects);
      setSelectedSubject(subjects);
      setSubtopics(subTopic);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("Failed to fetch data.", error);
        setNetworkError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, subject]);

  useEffect(() => {
    handleGetData();
  }, [handleGetData]);

  useEffect(() => {
    console.log("Add_question", addQuestion);
  }, [addQuestion]);

  const isEmpty = () => {
    const { englishQuestion, hindiQuestion } = addQuestion;
    if (
      !addQuestion.subjectId ||
      !addQuestion.classesId ||
      addQuestion.subtopicIds.length === 0 ||
      !addQuestion.type ||
      !addQuestion.questionType ||
      !englishQuestion.question ||
      !englishQuestion.answer ||
      !englishQuestion.solution ||
      !hindiQuestion.question ||
      !hindiQuestion.answer ||
      !hindiQuestion.solution ||
      Object.values(englishQuestion.options).some((opt) => !opt) ||
      Object.values(hindiQuestion.options).some((opt) => !opt)
    ) {
      return true;
    }
    return false;
  };

  function handleNavigate() {
    navigate("/subjectDetails");
  }

  const handleSubmit = async () => {
    if (isEmpty()) {
      toast.warning("Please fill up all the required fields.");
    } else {
      try {
        const response = await addNewQuestion(addQuestion, accessToken);

        if (response.status === 200) {
          const message = response.data.message || "Question add successfully!";
          toast.success(message);
          console.log("Question added successfully:", response);
          handleNavigate(); // Navigate to another page if required
        } else {
          // Handle non-200 responses
          toast.warn(
            response.data.message || "Something went wrong. Please try again!"
          );
          console.log("Error adding question:", response);
        }
      } catch (error) {
        // Handle errors with toast and log the error
        toast.error("An error occurred. Please try again later.");
        console.error("Error adding question:", error);
      }
    }
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900 rounded-lg border-2 border-slate-300 font-sans duration-300 ease-in-out">
        <div className="py-8 px-4 space-y-2 lg:px-6">
          <div className="space-y-4">
            <p className="text-3xl tracking-tight font-semibold text-left text-gray-900 dark:text-white capitalize">
              Add Question
            </p>
            <p className="text-xl tracking-tight font-medium text-left text-slate-600 dark:text-white">
              Fill in the details below to create a new question.
            </p>
          </div>
          {networkError ? (
            <div className="bg-red-500 text-white text-center py-3 px-4 rounded-md mb-4">
              <p>{networkError}</p>
            </div>
          ) : (
            <>
              {isLoading ? (
                <Loading />
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 overflow-none">
                    <div className="space-y-2 w-full">
                      <label className="font-medium text-gray-900 text-start capitalize text-md dark:text-white">
                        Subject
                      </label>
                      <SingleSelect
                        label="Subject"
                        options={subjectname}
                        onSubjectChange={handleSubjectChange}
                        selectedValue={selectedSubject}
                      />
                    </div>

                    <div className="space-y-2 w-full">
                      <label className="font-medium text-gray-900 text-start capitalize text-md dark:text-white">
                        Subtopic
                      </label>
                      <MultiSelection
                        label="Subtopics"
                        value={selectedSubtopic}
                        onChange={handleSubtopicChange}
                        options={subtopics}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-4 w-full">
                      <label className="font-medium text-gray-900 text-start capitalize text-md dark:text-white">
                        Type
                      </label>

                      <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 w-full">
                        <RadioButtons
                          options={radioOptions}
                          checkedValue={type}
                          onHandleChange={handleTypeChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 md:flex sm:flex text-sm font-medium text-gray-900 space-x-6 text-start dark:text-white">
                    <p className="flex items-center capitalize text-xl font-medium text-gray-900 dark:text-white">
                      Question Type :
                    </p>
                    {["normal", "statement", "pair"].map((option, index) => (
                      <div
                        className="flex items-center justify-start space-x-2"
                        key={index}
                      >
                        <input
                          type="radio"
                          id={`type-${option}`}
                          value={option}
                          name="questionType"
                          checked={questionType === option}
                          onChange={(e) => {
                            setAddQuestion((prev) => ({
                              ...prev,
                              questionType: e.target.value,
                            }));
                            setQuestionType(e.target.value);
                          }}
                          className="w-4 h-4 text-orange-600 bg-orange-600 border-orange-600 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          htmlFor={`type-${option}`}
                          className="w-full py-3 text-sm font-medium capitalize text-gray-900 dark:text-gray-300"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>

                  {questionType === "pair" ? (
                    <EnglishQuestionPairForm
                      addQuestion={addQuestion}
                      setAddQuestion={setAddQuestion}
                      handleChange={handleChange}
                      handleCheck={handleCheck}
                      handlePairQuestionChange={handlePairQuestionChange}
                      handleAddPair={handleAddPair}
                      inputs={inputs.english}
                      handleInputChange={handleInputChange}
                      options={options}
                    />
                  ) : questionType === "statement" ? (
                    <EnglishQueStatementBaseform
                      addQuestion={addQuestion}
                      setAddQuestion={setAddQuestion}
                      handleChange={handleChange}
                      handleCheck={handleCheck}
                      options={options}
                      handleAddStatement={addStatementQuestion}
                      handleStatementQuestionChange={
                        handleStatementQuestionChange
                      }
                    />
                  ) : (
                    <NormalquestionBaseForm
                      addQuestion={addQuestion}
                      setAddQuestion={setAddQuestion}
                      handleChange={handleChange}
                      handleCheck={handleCheck}
                      options={options}
                    />
                  )}

                  {questionType === "pair" ? (
                    <HindiQuestionPairForm
                      addQuestion={addQuestion}
                      setAddQuestion={setAddQuestion}
                      addPairQuestion={handleAddPair}
                      handleChange={handleChange}
                      handleCheck={handleCheck}
                      options={options}
                      handlePairQuestionChange={handlePairQuestionChange}
                      handleStatementQuestionChange={
                        handleStatementQuestionChange
                      }
                      handleAddPair={handleAddPair}
                      inputs={inputs.hindi} // Pass inputs as prop
                      handleInputChange={handleInputChange}
                    />
                  ) : questionType === "statement" ? (
                    <HindiQueStatementBaseform
                      addQuestion={addQuestion}
                      setAddQuestion={setAddQuestion}
                      handleChange={handleChange}
                      handleCheck={handleCheck}
                      options={options}
                      handleAddStatement={addStatementQuestion}
                    />
                  ) : (
                    <NormalHindQueBaseForm
                      addQuestion={addQuestion}
                      setAddQuestion={setAddQuestion}
                      handleChange={handleChange}
                      handleCheck={handleCheck}
                      options={options}
                    />
                  )}

                  <div className="mt-6 text-center">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="inline-flex items-center py-2 px-6 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    >
                      <VscSaveAs className="mr-2" />
                      Save Question
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick={true}
          pauseOnHover={true}
          draggable={true}
          theme="dark"
        />
      </section>
    </>
  );
}

export default AddQuestion;
