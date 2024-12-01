import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdStar } from "react-icons/md";
import { VscSaveAs } from "react-icons/vsc";
import { FaPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import axios from "axios";
import SingleSelect from "../Ui/SingleSelect";
import RadioButtons from "../Ui/RadioButtons";
import HindiQuestionPairForm from "./QuestionType/Edit/HindiQuestionBase/HindiQuestionPairForm";
import EnglishQuestionPairForm from "./QuestionType/Edit/EnglishQuestionBase/EnglishQuestionPairForm";
import EnglishQueStatementBaseform from "./QuestionType/Edit/EnglishQuestionBase/EnglishQueStatmentBaseform";
import NormalquestionBaseForm from "./QuestionType/Edit/EnglishQuestionBase/NormalQuestionBaseForm";
import NormalHindQueBaseForm from "./QuestionType/Edit/HindiQuestionBase/NormalHindQueBaseForm";
import HindiQueStatementBaseform from "./QuestionType/Edit/HindiQuestionBase/HindiQueStatementBaseform";
import MultipleSelect from "../Ui/MultiSelection";
import { fetchData, fetchSubjects } from "../../Hooks/getSubjectApi";
import {
  editQuestionAPI,
  fetchQuestionsBySubject,
} from "../../Hooks/QuestionsApi";
import Loading from "../Loader/Loading";

function EditQuestion() {
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.userConfig.classesData);
   const accessToken = useSelector(
    (state) => state.authConfig.userInfo[0]?.data?.token
  );
  const currentQuestion = useSelector(
    (state) => state.userConfig.CurrentQue[0]
  );
  const CurrentSubject = useSelector(
    (state) => state.userConfig.CurrentSubject
  );
  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState("");
  const [deleteError, setDeleteError] = useState(false);
  const [type, setType] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [subTopicName, setSubTopicName] = useState([]);
  const [selectedSubtopic, setSelectedSubtopic] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjectname, setSubjectname] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [currentEngStatement, setCurrentEngStatement] = useState("");
  const [currentHindiStatement, setCurrentHindiStatement] = useState("");
  const [currentEngPair, setCurrentEngPair] = useState("");
  const [currentHindiPair, setCurrentHindiPair] = useState("");

  const [editQuestion, setEditQuestion] = useState(() => {
    if (questionType === "normal") {
      return {
        questionId: "",
        subjectId: "",
        classesId: "",
        subtopicIds: [],
        questionBank: "",
        type: "",
        questionType: "",
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
    } else {
      return {
        questionId: "",
        subjectId: "",
        classesId: "",
        subtopicIds: [],
        questionBank: "",
        type: "",
        questionType: "",
        englishQuestion: {
          question: "",
          options: { A: "", B: "", C: "", D: "" },
          answer: "",
          solution: "",
          statementQuestion: [],
          pairQuestion: [],
          lastQuestion: "",
        },
        hindiQuestion: {
          question: "",
          options: { A: "", B: "", C: "", D: "" },
          answer: "",
          solution: "",
          statementQuestion: [],
          pairQuestion: [],
          lastQuestion: "",
        },
      };
    }
  });

  const radioOptions = [
    { value: "concept", label: "Concept" },
    { value: "aptitude", label: "Aptitude" },
    { value: "random", label: "Random" },
  ];
  const [options, setOptions] = useState({
    AnswerOption: { A: false, B: false, C: false, D: false },
  });
  const optionsArray = Object.keys(options.AnswerOption).map((key) => ({
    label: `Option ${key}`,
    value: key,
    checked: options.AnswerOption[key],
  }));

  const handleCheck = (language, event) => {
    const selectedValue = event.target.value;

    // Update the options state (checkboxes for both questions)
    setOptions((prev) => {
      const newOptions = { ...prev };

      // Ensure options exist for the given language
      if (!newOptions[language]) {
        newOptions[language] = { A: false, B: false, C: false, D: false };
      }

      // Set all options to false and mark the selected one as true
      Object.keys(newOptions[language]).forEach((key) => {
        newOptions[language][key] = key === selectedValue;
      });

      return newOptions;
    });

    // Update both englishQuestion and hindiQuestion states
    setEditQuestion((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        answer: selectedValue, // Save the selected value as the answer
      },
      hindiQuestion: {
        ...prev.hindiQuestion,
        answer: selectedValue, // Automatically update hindiQuestion with the same answer
      },
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Split the name to target the language, field, and option
    const [lang, field, option] = name.split("."); // e.g., "englishQuestion.options.A"

    // Check if the field is related to either English or Hindi questions
    if (lang === "englishQuestion" || lang === "hindiQuestion") {
      if (field === "options" && option) {
        // If it's an option field (like A, B, C, D), update the specific option (A, B, C, or D)
        setEditQuestion((prev) => ({
          ...prev,
          [lang]: {
            ...prev[lang],
            options: {
              ...prev[lang].options,
              [option]: value, // Update the specific option
            },
          },
        }));
      } else {
        // If it's any other field (question, answer, solution, etc.), just update that field
        setEditQuestion((prev) => ({
          ...prev,
          [lang]: {
            ...prev[lang],
            [field]: value, // Update the field (question, solution, etc.)
          },
        }));
      }
    } else {
      setEditQuestion((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setType(newType);
    setEditQuestion((prev) => ({ ...prev, type: newType }));
  };

  const handleSubjectChange = (event) => {
    const { value } = event.target;
    setEditQuestion((prev) => ({ ...prev, subjectId: value._id }));
  };

  const handleSubtopicChange = (event) => {
    const { value } = event.target;
    const uniqueValues = Array.from(new Set(value.map((item) => item._id)));
    setSelectedSubtopic(value);
    setEditQuestion((prev) => ({
      ...prev,
      subtopicIds: uniqueValues,
    }));
  };

  

  const addStatementQuestion = (value, language) => {
    if (!value?.rowData) {
      console.log("No row data available");
      return;
    }

    const { statement, id } = value.rowData;

    if (typeof statement !== "string") {
      console.log("Invalid input data: statement is not a string");
    }

    if (!statement) {
      console.log("Invalid pair: Missing statement");
    }

    const finalCombined = {
      id: id,
      statement: statement,
    };

    if (language === "englishQuestion") {
      setEditQuestion((prev) => {
        const updatedStatements = prev.englishQuestion.statementQuestion.map((value) =>
          value.id === id ? { ...value, ...finalCombined } : value
        );

        if (!updatedStatements.some((value) => value.id === id)) {
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
      setEditQuestion((prev) => {
        const updatedStatements = prev.hindiQuestion.statementQuestion.map((value) =>
          value.id === id ? { ...value, ...finalCombined } : value
        );

        if (!updatedStatements.some((valid) => valid.id === id)) {
          updatedStatements.push(finalCombined);
        }

        console.log(updatedStatements);

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
    const currentQuestionType = editQuestion.questionType;

    if (currentQuestionType === "pair") {
      const updatedPairQuestions = [value];

      setEditQuestion((prev) => ({
        ...prev,
        [lang]: {
          ...prev[lang],
          [field]: updatedPairQuestions,
          lastQuestion: value,
        },
      }));
    } else if (currentQuestionType === "statement") {
      // Logic for handling normal statement questions
      const updatedStatements = [...editQuestion[lang].statements, value];

      setEditQuestion((prev) => ({
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
    const updatedPairQuestion = [...editQuestion[language].pairQuestion];
    updatedPairQuestion[index] = {
      ...updatedPairQuestion[index],
      [field]: value,
    };
    setEditQuestion({
      ...editQuestion,
      [language]: {
        ...editQuestion[language],
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
    if (!value?.rowData) {
      console.log("No row data available");
      return; // Exit early if rowData is undefined
    }

    const { pairA, pairB, id } = value.rowData;

    if (typeof pairA !== "string" || typeof pairB !== "string") {
      console.log("Invalid input data: pairA or pairB is not a string");
    }

    if (!pairA || !pairB) {
      toast.warn("Invalid pair: Missing pairA or pairB");
    }

    const combinedPair = `${pairA} --- ${pairB}`;

    const finalCombined = {
      id: id,
      combined: combinedPair,
    };

    setEditQuestion((prev) => {
      const updatedPairQuestion = prev[language + "Question"].pairQuestion.map(
        (pair) => (pair.id === id ? { ...pair, ...finalCombined } : pair)
      );

      if (!updatedPairQuestion.some((pair) => pair.id === id)) {
        updatedPairQuestion.push(finalCombined);
      }

      return {
        ...prev,
        [language + "Question"]: {
          ...prev[language + "Question"],
          pairQuestion: updatedPairQuestion,
        },
      };
    });
  };

  // const handleAddPair = (value, language) => {
  //   if (!value?.rowData) {
  //     console.log("No row data available");
  //     return; // Exit early if rowData is undefined
  //   }
  //   const { pairA, pairB, id } = value.rowData;

  //   if (typeof pairA !== "string" || typeof pairB !== "string") {
  //     console.log("Invalid input data: pairA or pairB is not a string");
  //   }

  //   if (!pairA || !pairB) {
  //     toast.warn("Invalid pair: Missing pairA or pairB");
  //   }

  //   const combinedPair = `${pairA} --- ${pairB}`;

  //   const finalCombined = {
  //     id: id,
  //     combined: combinedPair,
  //   };

  //   console.log("Final Combined Object:", finalCombined);

  //   if (language === "englishQuestion") {
  //     setEditQuestion((prev) => {
  //       const updatedPairQuestion = prev.englishQuestion.pairQuestion.map(
  //         (pair) => (pair.id === id ? { ...pair, ...finalCombined } : pair)
  //       );

  //       if (!updatedPairQuestion.some((pair) => pair.id === id)) {
  //         updatedPairQuestion.push(finalCombined);
  //       }

  //       return {
  //         ...prev,
  //         englishQuestion: {
  //           ...prev.englishQuestion,
  //           pairQuestion: updatedPairQuestion,
  //         },
  //       };
  //     });
  //   } else if (language === "hindiQuestion") {
  //     setEditQuestion((prev) => {
  //       const updatedPairQuestion = prev.hindiQuestion.pairQuestion.map(
  //         (pair) => (pair.id === id ? { ...pair, ...finalCombined } : pair)
  //       );

  //       if (!updatedPairQuestion.some((pair) => pair.id === id)) {
  //         updatedPairQuestion.push(finalCombined);
  //       }

  //       console.log(updatedPairQuestion);

  //       return {
  //         ...prev,
  //         hindiQuestion: {
  //           ...prev.hindiQuestion,
  //           pairQuestion: updatedPairQuestion,
  //         },
  //       };
  //     });
  //   }
  // };

  useEffect(() => {
    console.log("EDIT QUESTION", editQuestion);
  }, [editQuestion]);

  const debounceTimeoutRef = useRef(null);

  const handleGetData = useCallback(async () => {
    setIsLoading(true);
    setNetworkError("");

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const { subTopics } = await fetchQuestionsBySubject(
        accessToken,
        CurrentSubject?._id,
        _id,
        signal
      );

      const Subjectdata = await fetchData(
        accessToken,
        CurrentSubject?._id,
        signal
      );

      if (!subTopics || !Subjectdata) {
        console.log("No data received");
        return;
      }

      const { subjects = [] } = Subjectdata;

      // Set subtopics, subjectname, and selectedSubject only if data changes
      setSubtopics((prevSubtopics) => {
        if (JSON.stringify(prevSubtopics) !== JSON.stringify(subTopics)) {
          return subTopics;
        }
        return prevSubtopics;
      });
      setSubjectname(subjects);
      setSelectedSubject(subjects);
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

    return () => {
      controller.abort();
    };
  }, [accessToken, CurrentSubject, _id]);

  const debounceGetData = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      handleGetData();
    }, 500);
  }, [handleGetData]);

  useEffect(() => {
    debounceGetData();

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [debounceGetData]); // No need to depend on debounceTimeout as we are using useRef

  const isEmpty = () => {
    if (
      !editQuestion.subjectId ||
      !editQuestion.classesId ||
      editQuestion.subtopicIds.length === 0 ||
      !editQuestion.type ||
      !editQuestion.questionType ||
      !editQuestion.englishQuestion.question ||
      !editQuestion.englishQuestion.answer ||
      !editQuestion.englishQuestion.solution ||
      !editQuestion.hindiQuestion.question ||
      !editQuestion.hindiQuestion.answer ||
      !editQuestion.hindiQuestion.solution
    ) {
      return true;
    }

    const englishOptions = editQuestion.englishQuestion.options;
    const hindiOptions = editQuestion.hindiQuestion.options;

    if (
      !englishOptions.A ||
      !englishOptions.B ||
      !englishOptions.C ||
      !englishOptions.D ||
      !hindiOptions.A ||
      !hindiOptions.B ||
      !hindiOptions.C ||
      !hindiOptions.D
    ) {
      return true;
    }

    return false;
  };

  const EditQuestion = async () => {
    try {
      if (isEmpty(editQuestion)) {
        toast.warning("Please fill up empty fields.");
      } else {
        const response = await editQuestionAPI(editQuestion, accessToken);

        if (response.status === 200) {
          toast.success(response.data.message);
          console.log("success", response.data);
          navigate("/subjectDetails");
          handleGetData(); // Refresh data after success
        } else {
          console.log("failed", response.data);
          toast.error(response.data.message);
        }
      }
    } catch (err) {
      console.error("Error during question edit:", err.message);
      toast.error("An error occurred while editing the question.");
    }
  };

  useEffect(() => {
    if (questionType === "normal") {
      setEditQuestion((prevState) => ({
        ...prevState,
        englishQuestion: {
          ...prevState.englishQuestion,
          lastQuestion: "",
        },
        hindiQuestion: {
          ...prevState.hindiQuestion,
          lastQuestion: "",
        },
      }));
    } else {
      setEditQuestion((prevState) => ({
        ...prevState,
        englishQuestion: {
          ...prevState.englishQuestion,
          lastQuestion: prevState.englishQuestion.lastQuestion || "",
        },
        hindiQuestion: {
          ...prevState.hindiQuestion,
          lastQuestion: prevState.hindiQuestion.lastQuestion || "",
        },
      }));
    }
  }, [questionType]);

  useEffect(() => {
    if (
      !editQuestion ||
      !editQuestion.englishQuestion ||
      !editQuestion.hindiQuestion
    ) {
      return; // Exit early if any of these objects are undefined
    }

    const englishOptions = editQuestion.englishQuestion.options || {};
    const hindiOptions = editQuestion.hindiQuestion.options || {};

    const newOptions = { ...options };

    Object.keys(englishOptions).forEach((key) => {
      newOptions.englishQuestion = newOptions.englishQuestion || {}; // Initialize if undefined
      newOptions.englishQuestion[key] =
        editQuestion.englishQuestion.answer === key;
    });

    Object.keys(hindiOptions).forEach((key) => {
      newOptions.hindiQuestion = newOptions.hindiQuestion || {}; // Initialize if undefined
      newOptions.hindiQuestion[key] = editQuestion.hindiQuestion.answer === key;
    });

    setOptions({
      AnswerOption: { ...newOptions.englishQuestion },
    });
  }, [
    editQuestion,
    editQuestion.englishQuestion,
    editQuestion.hindiQuestion,
    options,
  ]);

  useEffect(() => {
    if (currentQuestion) {
      const newEditQuestion = {
        questionId: currentQuestion?._id || "", // Default empty string if currentQuestion._id is not available
        subjectId: currentQuestion?.subjectId || "",
        classesId: currentQuestion?.classesId || "",
        subtopicIds: currentQuestion?.subtopicIds || [],
        questionBank: currentQuestion?.questionBank || "",
        type: currentQuestion?.type || "",
        questionType: currentQuestion?.questionType || "",
      
        englishQuestion: {
          question: currentQuestion?.englishQuestion?.question || "",
          options: currentQuestion?.englishQuestion?.options || { A: "", B: "", C: "", D: "" },
          answer: currentQuestion?.englishQuestion?.answer || "",
          solution: currentQuestion?.englishQuestion?.solution || "",
          statementQuestion: currentQuestion?.englishQuestion?.statementQuestion || [],
          pairQuestion: currentQuestion?.englishQuestion?.pairQuestion || [],
          lastQuestion: currentQuestion?.questionType !== "normal" ? currentQuestion?.englishQuestion?.lastQuestion || "" : "",
        },
      
        hindiQuestion: {
          question: currentQuestion?.hindiQuestion?.question || "",
          options: currentQuestion?.hindiQuestion?.options || { A: "", B: "", C: "", D: "" },
          answer: currentQuestion?.hindiQuestion?.answer || "",
          solution: currentQuestion?.hindiQuestion?.solution || "",
          statementQuestion: currentQuestion?.hindiQuestion?.statementQuestion || [],
          pairQuestion: currentQuestion?.hindiQuestion?.pairQuestion || [],
          lastQuestion: currentQuestion?.questionType !== "normal" ? currentQuestion?.hindiQuestion?.lastQuestion || "" : "",
        },
      };
      

      console.log(newEditQuestion);

      if (JSON.stringify(newEditQuestion) !== JSON.stringify(editQuestion)) {
        setEditQuestion(newEditQuestion);
      }
      setType(currentQuestion.type || "");
      setQuestionType(currentQuestion.questionType || "");
    }
  }, [currentQuestion, subtopics]); // Ensure `subtopics` is included if it's used to filter `currentQuestion`

  useEffect(() => {
    if (
      currentQuestion &&
      currentQuestion.subtopicIds &&
      Array.isArray(currentQuestion.subtopicIds)
    ) {
      const existSubtopics = currentQuestion.subtopicIds
        .map((subtopicId) => {
          const subtopic = subtopics.find(
            (subtopic) => subtopic._id === subtopicId
          );
          return subtopic ? subtopic : null;
        })
        .filter((subtopic) => subtopic !== null);

      setSelectedSubtopic(existSubtopics);
    } else {
      setSelectedSubtopic([]);
    }
  }, [currentQuestion, subtopics]);

  return (
    <>
      <section className="bg-white dark:bg-gray-900 rounded-lg border-2 border-slate-300 font-sans duration-300 ease-in-out">
        <div className="py-8 px-4 space-y-2 lg:px-6">
          <div className="space-y-4">
            <p className="text-3xl tracking-tight font-semibold text-left text-gray-900 dark:text-white capitalize">
              Edit Question
            </p>
            <p className="text-xl tracking-tight font-medium text-left text-slate-600 dark:text-white">
              Fill in the details below to create a new question.
            </p>
          </div>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 lg:gap-2 xl:grid-cols-4 xl:gap-3 2xl:grid-cols-4 2xl:gap-6">
                <div className="space-y-2">
                  <label className="font-medium text-gray-900 text-start capitalize text-md dark:text-white">
                    Subject
                  </label>
                  {networkError ? (
                    <p className="text-red-500">Error: {networkError}</p> // Display network error message
                  ) : (
                    <SingleSelect
                      label="Subject"
                      value={selectedSubject}
                      onChange={handleSubjectChange}
                      options={subjectname}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="font-medium text-gray-900 text-start capitalize text-md dark:text-white">
                    Subtopic
                  </label>
                  {networkError ? (
                    <p className="text-red-500">Error: {networkError}</p> // Display network error message
                  ) : (
                    <MultipleSelect
                      label="Subtopics"
                      value={selectedSubtopic}
                      onChange={handleSubtopicChange}
                      options={subtopics}
                    />
                  )}
                </div>

                <div className="space-y-3">
                  <label className="font-medium text-gray-900 text-start capitalize text-md dark:text-white">
                    Question Type
                  </label>
                  {networkError ? (
                    <p className="text-red-500">Error: {networkError}</p> // Display network error message
                  ) : (
                    <RadioButtons
                      options={radioOptions}
                      checkedValue={type}
                      onChange={handleTypeChange}
                    />
                  )}
                </div>
              </div>
              <div className="p-4 md:flex sm:flex text-sm font-medium text-gray-900 space-x-6  text-start dark:text-white">
                <p className="flex items-center capitalize text-xl font-medium text-gray-900 dark:text-white">
                  Question Type :
                </p>
                {networkError ? (
                  <p className="text-red-500">Error: {networkError}</p> // Error message for network failure
                ) : (
                  ["normal", "statement", "pair"].map((option, index) => (
                    <div
                      className="flex items-center justify-start space-x-2"
                      key={index}
                    >
                      <input
                        type="radio"
                        id={`type-${option}`}
                        value={option}
                        name="questionType"
                        checked={editQuestion.questionType === option}
                        onChange={(e) => {
                          setEditQuestion((prev) => ({
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
                  ))
                )}
              </div>

              {networkError ? (
                <p className="text-red-500">Error: {networkError}</p> // Display network error message
              ) : questionType === "pair" ? (
                <EnglishQuestionPairForm
                  editQuestion={editQuestion}
                  setEditQuestion={setEditQuestion}
                  currentEngPair={currentEngPair}
                  setCurrentEngPair={setCurrentEngPair}
                  addPairQuestion={handleAddPair}
                  handleChange={handleChange}
                  handleCheck={handleCheck}
                  optionsArray={optionsArray}
                  handlePairQuestionChange={handlePairQuestionChange}
                  handleAddPair={handleAddPair}
                  handleStatementQuestionChange={handleStatementQuestionChange}
                  inputs={inputs.english} // Pass inputs as prop
                  handleInputChange={handleInputChange}
                />
              ) : questionType === "statement" ? (
                <EnglishQueStatementBaseform
                  editQuestion={editQuestion}
                  setEditQuestion={setEditQuestion}
                  currentStatement={currentEngStatement}
                  setCurrentStatement={setCurrentEngStatement}
                  handleChange={handleChange}
                  handleCheck={handleCheck}
                  optionsArray={optionsArray}
                  handlePairQuestionChange={handleStatementQuestionChange}
                  handleAddStatement={addStatementQuestion}
                />
              ) : (
                <NormalquestionBaseForm
                  editQuestion={editQuestion}
                  setEditQuestion={setEditQuestion}
                  handleChange={handleChange}
                  handleCheck={handleCheck}
                  optionsArray={optionsArray}
                />
              )}
              {networkError ? (
                <p className="text-red-500">Error: {networkError}</p>
              ) : questionType === "pair" ? (
                <HindiQuestionPairForm
                  editQuestion={editQuestion}
                  setEditQuestion={setEditQuestion}
                  currentHindiPair={currentHindiPair}
                  addPairQuestion={handleAddPair}
                  handleChange={handleChange}
                  handleCheck={handleCheck}
                  optionsArray={optionsArray}
                  handlePairQuestionChange={handlePairQuestionChange}
                  handleStatementQuestionChange={handleStatementQuestionChange}
                  handleAddPair={handleAddPair}
                  inputs={inputs.hindi} // Pass inputs as prop
                  handleInputChange={handleInputChange}
                />
              ) : questionType === "statement" ? (
                <HindiQueStatementBaseform
                  editQuestion={editQuestion}
                  setEditQuestion={setEditQuestion}
                  currentStatement={currentHindiStatement}
                  setCurrentStatement={setCurrentHindiStatement}
                  handleChange={handleChange}
                  handleCheck={handleCheck}
                  optionsArray={optionsArray}
                  handlePairQuestionChange={handleStatementQuestionChange}
                  handleAddStatement={addStatementQuestion}
                />
              ) : (
                <NormalHindQueBaseForm
                  editQuestion={editQuestion}
                  setEditQuestion={setEditQuestion}
                  handleChange={handleChange}
                  handleCheck={handleCheck}
                  optionsArray={optionsArray}
                />
              )}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={EditQuestion}
                  className="inline-flex items-center py-2 px-6 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  disabled={isLoading} // Disable the button during loading
                >
                  {isLoading ? (
                    <span>Saving...</span> // Show loading text in the button during save operation
                  ) : (
                    <>
                      <VscSaveAs className="mr-2" />
                      Save Question
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
        <ToastContainer
          draggable={false}
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick={false}
          theme="dark"
        />
      </section>
    </>
  );
}

export default EditQuestion;
