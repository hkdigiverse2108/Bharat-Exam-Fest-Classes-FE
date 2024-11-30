import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MultiSelection from "../Ui/MultiSelection";
import { VscSaveAs } from "react-icons/vsc";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SingleSelect from "../Ui/SingleSelect";
import RadioButtons from "../Ui/RadioButtons";
import { toast, ToastContainer } from "react-toastify";
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
  const classId = useSelector((state) => state.authConfig.userInfo[0]._id);
  const accessToken = useSelector(
    (state) => state.authConfig.userInfo[0]?.token
  );
  const subject = useSelector((state) => state.userConfig.CurrentSubject?._id);

  const [isLoading, setIsLoading] = useState(true);
  const [networkError, setNetworkError] = useState("");
  const [type, setType] = useState("concept");
  const [questionType, setQuestionType] = useState("normal");
  const [subtopics, setSubtopics] = useState([]);
  const [subjectname, setSubjectname] = useState([]);
  const [selectedSubtopic, setSelectedSubtopic] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [addQuestion, setAddQuestion] = useState(() => {
    if (questionType === "normal") {
      return {
        subjectId: subject,
        classesId: classId,
        subtopicIds: [],
        type: type,
        questionType: questionType,
        englishQuestion: {
          question: "",
          answer: "",
          solution: "",
          options: { A: "", B: "", C: "", D: "" },
          statementQuestion: [],
          pairQuestion: [],
        },
        hindiQuestion: {
          question: "",
          answer: "",
          solution: "",
          options: { A: "", B: "", C: "", D: "" },
          statementQuestion: [],
          pairQuestion: [],
        },
      };
    } else {
      return {
        subjectId: subject,
        classesId: classId,
        subtopicIds: [],
        type: type,
        questionType: questionType,
        englishQuestion: {
          question: "",
          answer: "",
          solution: "",
          options: { A: "", B: "", C: "", D: "" },
          statementQuestion: [],
          pairQuestion: [],
          lastQuestion: "",
        },
        hindiQuestion: {
          question: "",
          answer: "",
          solution: "",
          options: { A: "", B: "", C: "", D: "" },
          statementQuestion: [],
          pairQuestion: [],
          lastQuestion: "",
        },
      };
    }
  });
  // useEffect(() => {
  //   setAddQuestion(() => {
  //     if (questionType === "normal") {
  //       return {
  //         subjectId: "",
  //         classesId: classId,
  //         subtopicIds: [],
  //         type: type,
  //         questionType: questionType,
  //         englishQuestion: {
  //           question: "",
  //           answer: "",
  //           solution: "",
  //           options: { A: "", B: "", C: "", D: "" },
  //           statementQuestion: [],
  //           pairQuestion: [],
  //         },
  //         hindiQuestion: {
  //           question: "",
  //           answer: "",
  //           solution: "",
  //           options: { A: "", B: "", C: "", D: "" },
  //           statementQuestion: [],
  //           pairQuestion: [],
  //         },
  //       };
  //     } else {
  //       return {
  //         subjectId: subject,
  //         classesId: classId,
  //         subtopicIds: [],
  //         type: type,
  //         questionType: questionType,
  //         englishQuestion: {
  //           question: "",
  //           answer: "",
  //           solution: "",
  //           options: { A: "", B: "", C: "", D: "" },
  //           statementQuestion: [],
  //           pairQuestion: [],
  //           lastQuestion: "", // Add lastQuestion for non-normal types
  //         },
  //         hindiQuestion: {
  //           question: "",
  //           answer: "",
  //           solution: "",
  //           options: { A: "", B: "", C: "", D: "" },
  //           statementQuestion: [],
  //           pairQuestion: [],
  //           lastQuestion: "", // Add lastQuestion for non-normal types
  //         },
  //       };
  //     }
  //   });
  // }, [classId, questionType, subject, type]);

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

    // Update the options for the selected language
    setOptions((prev) => {
      const newOptions = { ...prev };

      // If the language option doesn't exist, initialize it
      if (!newOptions[language]) {
        newOptions[language] = { A: false, B: false, C: false, D: false };
      }

      Object.keys(newOptions[language]).forEach((key) => {
        newOptions[language][key] = key === selectedValue;
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
    { value: "concept", label: "Concept" },
    { value: "aptitude", label: "Aptitude" },
    { value: "random", label: "Random" },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    const [lang, field, option] = name.split("."); // Split the name to get the language, field, and option

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
            [field]: value, // Update the field (solution in this case)
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

  const handleTypeChange = (event) => {
    setType(event.target.value);
    setAddQuestion((prev) => ({ ...prev, type: event.target.value }));
  };

  const handleSubjectChange = (event) => {
    const { value } = event.target;
    console.log(value);

    setSelectedSubject(value);
    setAddQuestion((prev) => ({ ...prev, subjectId: value._id }));
  };

  const handleSubtopicChange = (event) => {
    const { value } = event.target;

    const uniqueValues = Array.from(new Set(value.map((item) => item._id)));
    setSelectedSubtopic(value);
    setAddQuestion((prev) => ({
      ...prev,
      subtopicIds: uniqueValues,
    }));
    // const selectedId = value[0]?._id;
    // // Check if the subtopicId already exists in the array
    // const isSelected = addQuestion.subtopicIds.includes(selectedId);

    // // If it's selected, remove it, otherwise add it
    // const subtopicIds = isSelected
    //   ? addQuestion.subtopicIds.filter((id) => id !== selectedId) // Remove from subtopicIds
    //   : [...addQuestion.subtopicIds, selectedId];

    // setAddQuestion((prev) => ({
    //   ...prev,
    //   subtopicIds: subtopicIds,
    // }));

    // const updatedSelectedSubtopics = isSelected
    //   ? value.filter((subtopic) => subtopic._id !== selectedId) // Remove from selectedSubtopic
    //   : [...selectedSubtopic, value[0]]; // Add to selectedSubtopic
    // setSelectedSubtopic(updatedSelectedSubtopics);
  };

  const [currentEngStatement, setCurrentEngStatement] = useState("");
  const [currentHindiStatement, setCurrentHindiStatement] = useState("");
  const [currentEngPair, setCurrentEngPair] = useState("");
  const [currentHindiPair, setCurrentHindiPair] = useState("");

  const addStatementQuestion = (language) => {
    const currentStatement =
      language === "english" ? currentEngStatement : currentHindiStatement;
    if (!currentStatement.trim()) {
      toast.warn("Please enter a statement.");
      return;
    }

    setAddQuestion((prev) => ({
      ...prev,
      [language + "Question"]: {
        ...prev[language + "Question"],
        statementQuestion: [
          ...prev[language + "Question"].statementQuestion,
          currentStatement,
        ],
      },
    }));
    toast.success("Statement added!");
  };

  const handleStatementQuestionChange = (event) => {
    const { name, value } = event.target;
    const [lang, field, option] = name.split(".");
    const currentQuestionType = addQuestion.questionType;

    if (currentQuestionType === "pair") {
      setAddQuestion((prev) => ({
        ...prev,
        [lang]: {
          ...prev[lang],
          [field]: value,
        },
      }));
      setCurrentEngPair("");
      setCurrentHindiPair("");
    } else if (currentQuestionType === "statement") {
      setAddQuestion((prev) => ({
        ...prev,
        [lang]: {
          ...prev[lang],
          [field]: value,
        },
      }));
      setCurrentEngStatement("");
      setCurrentHindiStatement("");
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
    setCurrentEngPair("");
    setCurrentHindiPair("");
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

  const handleInputChange = (value, language) => {
    const newPair = { ...value.rowData };
    console.log(newPair);
    const combinedPair = `${newPair.question} - ${newPair.answer}`;

    console.log(combinedPair);

    if (language === "englishQuestion") {
      setAddQuestion((prev) => ({
        ...prev,
        englishQuestion: {
          ...prev.englishQuestion,
          pairQuestion: [...prev.englishQuestion.pairQuestion, ...combinedPair], // Add the combined pair to the array
        },
      }));
    } else {
      setAddQuestion((prev) => ({
        ...prev,
        hindiQuestion: {
          ...prev.hindiQuestion,
          pairQuestion: [...prev.hindiQuestion.pairQuestion, ...combinedPair], // Add the combined pair to the array
        },
      }));
    }
  };

  const handleEditField = (index, language, field) => {
    setAddQuestion((prev) => {
      const updatedPairs = [...prev[language].pairQuestion];
      updatedPairs[index] = {
        ...updatedPairs[index],
        editing: { ...updatedPairs[index].editing, [field]: true },
      };
      return {
        ...prev,
        [language]: { ...prev[language], pairQuestion: updatedPairs },
      };
    });
  };

  const handleSaveEdit = (index, field, language, value) => {
    setAddQuestion((prev) => {
      const updatedPairs = [...prev[language].pairQuestion];
      updatedPairs[index] = {
        ...updatedPairs[index],
        [field]: value,
        editing: { ...updatedPairs[index].editing, [field]: false },
      };
      return {
        ...prev,
        [language]: { ...prev[language], pairQuestion: updatedPairs },
      };
    });
  };

  const handleDeletePair = (index, language) => {
    setAddQuestion((prev) => {
      const updatedPairs = prev[language].pairQuestion.filter(
        (_, i) => i !== index
      );
      return {
        ...prev,
        [language]: { ...prev[language], pairQuestion: updatedPairs },
      };
    });
  };

  const handleAddPair = (value, language) => {
    if (!value?.rowData) {
      console.log("No row data available");
      return; // Exit early if rowData is undefined
    }
  
    const { pairA, pairB, id } = value.rowData;
  
    // Ensure that both pairA and pairB are valid strings
    if (typeof pairA !== "string" || typeof pairB !== "string") {
      console.log("Invalid input data: pairA or pairB is not a string");
      return; // Exit the function early if data is invalid
    }
  
    if (!pairA || !pairB) {
      console.log("Invalid pair: Missing pairA or pairB");
      return; // Exit the function early if either pairA or pairB is missing
    }

    const combinedPair = `${pairA} --- ${pairB}`;

    const finalCombined = {
      id: id,
      combined: combinedPair,
    };

    console.log("Final Combined Object:", finalCombined);

    if (language === "englishQuestion") {
      setAddQuestion((prev) => {
        const updatedPairQuestion = prev.englishQuestion.pairQuestion.map(
          (pair) => (pair.id === id ? { ...pair, ...finalCombined } : pair)
        );

        if (!updatedPairQuestion.some((pair) => pair.id === id)) {
          updatedPairQuestion.push(finalCombined);
        }

        return {
          ...prev,
          englishQuestion: {
            ...prev.englishQuestion,
            pairQuestion: updatedPairQuestion,
          },
        };
      });
    } else if (language === "hindiQuestion") {
      setAddQuestion((prev) => {
        const updatedPairQuestion = prev.hindiQuestion.pairQuestion.map(
          (pair) => (pair.id === id ? { ...pair, ...finalCombined } : pair)
        );

        if (!updatedPairQuestion.some((pair) => pair.id === id)) {
          updatedPairQuestion.push(finalCombined);
        }

        console.log(updatedPairQuestion);

        return {
          ...prev,
          hindiQuestion: {
            ...prev.hindiQuestion,
            pairQuestion: updatedPairQuestion,
          },
        };
      });
    }
  };

  useEffect(() => {
    console.log("ADD QUESTION", addQuestion);
  }, [addQuestion]);

  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const debounceTimeoutRef = useRef(null);

  const handleGetData = useCallback(async () => {
      setIsLoading(true);
      setNetworkError("");

      const controller = new AbortController();
      const signal = controller.signal;

      try {
   

          const {subjects,subTopic} = await fetchData(accessToken, subject,  signal );

          if (!subjects || !subTopic) {
              console.log("No data received");
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

      return () => {
          controller.abort(); // Cleanup function to abort the fetch
      };
  }, [accessToken]);

  const debounceGetData = useCallback(() => {
      if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current); // Clear previous timeout
      }

      debounceTimeoutRef.current = setTimeout(() => {
          handleGetData();
      }, 500); // Adjust debounce time as needed
  }, [handleGetData]);

  useEffect(() => {
      debounceGetData();

      return () => {
          if (debounceTimeoutRef.current) {
              clearTimeout(debounceTimeoutRef.current); // Cleanup on unmount
          }
      };
  }, [debounceGetData]);

  useEffect(() => {
    debounceGetData();

    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout); // Cleanup on unmount
      }
    };
  }, [debounceGetData, debounceTimeout, subject]);

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
      toast.warning("Please fill up empty fields.");
    } else {
      try {
        const response = await addNewQuestion(addQuestion, accessToken);
        if (response.status === 200) {
          toast.success(
            response.data.message || "Question added successfully!"
          );
          console.log("Question added successfully:", response);
          handleNavigate();
        } else {
          toast.warn(
            response.data.message || "Something went wrong. Please try again!"
          );
          console.log("Error adding question:", response);
        }
      } catch (error) {
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
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 lg:gap-2 xl:grid-cols-4 xl:gap-3 2xl:grid-cols-4 2xl:gap-6">
                    <div className="space-y-2">
                      <label className="font-medium text-gray-900 text-start capitalize text-md dark:text-white">
                        Subject
                      </label>
                      <SingleSelect
                        label="Subject"
                        value={selectedSubject}
                        onChange={handleSubjectChange}
                        options={subjectname}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="font-medium text-gray-900 text-start capitalize text-md dark:text-white">
                        Subtopic
                      </label>
                      <MultiSelection
                        label="Subtopics"
                        value={selectedSubtopic}
                        onChange={handleSubtopicChange}
                        options={subtopics}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="font-medium text-gray-900 text-start capitalize text-md dark:text-white">
                        Question Type
                      </label>
                      <RadioButtons
                        options={radioOptions}
                        checkedValue={type}
                        onChange={handleTypeChange}
                      />
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
                          id={`type ${option}`}
                          value={option}
                          name={option}
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
                          htmlFor={`type ${option}`}
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
                      currentEngPair={currentEngPair}
                      setCurrentEngPair={setCurrentEngPair}
                      handleAddPair={handleAddPair}
                      handleSaveEdit={handleSaveEdit}
                      handleEditField={handleEditField}
                      handleDeletePair={handleDeletePair}
                      handleChange={handleChange}
                      handleCheck={handleCheck}
                      optionsArray={optionsArray}
                      handlePairQuestionChange={handlePairQuestionChange}
                      handleStatementQuestionChange={
                        handleStatementQuestionChange
                      }
                      inputs={inputs}
                      handleInputChange={handleInputChange}
                    />
                  ) : questionType === "statement" ? (
                    <EnglishQueStatementBaseform
                      addQuestion={addQuestion}
                      setAddQuestion={setAddQuestion}
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
                      addQuestion={addQuestion}
                      setAddQuestion={setAddQuestion}
                      handleChange={handleChange}
                      handleCheck={handleCheck}
                      optionsArray={optionsArray}
                    />
                  )}

                  {questionType === "pair" ? (
                    <HindiQuestionPairForm
                      addQuestion={addQuestion}
                      setAddQuestion={setAddQuestion}
                      currentHindiPair={currentHindiPair}
                      handleAddPair={handleAddPair}
                      handleSaveEdit={handleSaveEdit}
                      handleEditField={handleEditField}
                      handleDeletePair={handleDeletePair}
                      handleChange={handleChange}
                      handleCheck={handleCheck}
                      optionsArray={optionsArray}
                      handlePairQuestionChange={handlePairQuestionChange}
                      handleStatementQuestionChange={
                        handleStatementQuestionChange
                      }
                      inputs={inputs}
                      handleInputChange={handleInputChange}
                    />
                  ) : questionType === "statement" ? (
                    <HindiQueStatementBaseform
                      addQuestion={addQuestion}
                      setAddQuestion={setAddQuestion}
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
                      addQuestion={addQuestion}
                      setAddQuestion={setAddQuestion}
                      handleChange={handleChange}
                      handleCheck={handleCheck}
                      optionsArray={optionsArray}
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

export default AddQuestion;
