import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VscSaveAs } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import SingleSelect from "../Ui/SingleSelect";
import RadioButtons from "../Ui/RadioButtons";
import HindiQuestionPairForm from "./QuestionType/Edit/HindiQuestionBase/HindiQuestionPairForm";
import EnglishQuestionPairForm from "./QuestionType/Edit/EnglishQuestionBase/EnglishQuestionPairForm";
import EnglishQueStatementBaseform from "./QuestionType/Edit/EnglishQuestionBase/EnglishQueStatmentBaseform";
import NormalquestionBaseForm from "./QuestionType/Edit/EnglishQuestionBase/NormalQuestionBaseForm";
import NormalHindQueBaseForm from "./QuestionType/Edit/HindiQuestionBase/NormalHindQueBaseForm";
import HindiQueStatementBaseform from "./QuestionType/Edit/HindiQuestionBase/HindiQueStatementBaseform";
import MultipleSelect from "../Ui/MultiSelection";
import { fetchData } from "../../Hooks/getSubjectApi";
import { editQuestionAPI } from "../../Hooks/QuestionsApi";
import Loading from "../Loader/Loading";

function EditQuestion() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const accessToken = useSelector(
    (state) =>
      state.authConfig.userInfo[0]?.data?.token ||
      state.authConfig.userInfo[0]?.token
  );
  const currentQuestion = useSelector(
    (state) => state.userConfig.CurrentQue[0]
  );
  const CurrentSubject = useSelector(
    (state) => state.userConfig.CurrentSubject
  );

  const getInitialEditQuestionState = (questionType) => {
    const commonFields = {
      questionId: "",
      subjectId: "",
      classesId: "",
      subtopicIds: [],
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

    if (questionType === "normal") {
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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [editQuestion, setEditQuestion] = useState(
    getInitialEditQuestionState()
  );

  const [subtopics, setSubtopics] = useState([]);
  const [selectedSubtopic, setSelectedSubtopic] = useState("");
  const [subjectname, setSubjectname] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [type, setType] = useState("");

  const [options, setOptions] = useState({
    AnswerOption: { A: false, B: false, C: false, D: false },
  });

  const handleCheck = (event) => {
    const selectedValue = event.target.value;
    setOptions((prev) => {
      const newOptions = { ...prev };
      // Update AnswerOption to only have one true value
      Object.keys(newOptions.AnswerOption).forEach((key) => {
        newOptions.AnswerOption[key] = key === selectedValue;
      });
      return newOptions;
    });

    setEditQuestion((prev) => ({
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
    setEditQuestion((prev) => ({
      ...prev,
      type: newType,
    }));
  };

  const handleSubjectChange = (event) => {
    const selectedOptionId = event.target.value;
    const selectedOption = subjectname.find(
      (subject) => subject._id === selectedOptionId
    );
    setEditQuestion((prev) => ({ ...prev, subjectId: selectedOptionId }));
    setSelectedSubject(selectedOption || "");
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
    // Check if rowData exists
    if (!value?.rowData) {
      console.log("No row data available");
      return;
    }

    const { statement, id } = value.rowData;

    // Handle delete action
    if (value.type === "delete") {
      // Remove the statement from the correct language's statementQuestion list
      setEditQuestion((prev) => {
        // Filter out the item with the matching id
        const updatedStatements = prev[language].statementQuestion.filter(
          (item) => item.id !== id
        );

        // Ensure the updated state doesn't include the deleted item
        console.log("Updated statements after delete:", updatedStatements);

        return {
          ...prev,
          [language]: {
            ...prev[language],
            statementQuestion: updatedStatements,
          },
        };
      });

      console.log(`Deleted statement with id: ${id} from ${language}`);
      return; // Exit early to avoid adding back the deleted statement
    }

    // Validate the statement if it's not being deleted
    if (typeof statement !== "string") {
      console.log("Invalid input data: statement is not a string");
      return;
    }

    if (!statement.trim()) {
      console.log("Invalid statement: Missing statement");
      return;
    }

    const finalCombined = {
      id: id,
      statement: statement,
    };

    // Update based on language
    setEditQuestion((prev) => {
      let updatedStatements = [...prev[language].statementQuestion];

      // Check if the statement with the given id exists
      const existingStatementIndex = updatedStatements.findIndex(
        (item) => item.id === id
      );

      if (existingStatementIndex !== -1) {
        // If statement exists, update it
        updatedStatements[existingStatementIndex] = {
          ...updatedStatements[existingStatementIndex],
          ...finalCombined,
        };
      } else {
        // If statement doesn't exist, push the new statement
        updatedStatements.push(finalCombined);
      }

      console.log("Updated statements:", updatedStatements);

      return {
        ...prev,
        [language]: {
          ...prev[language],
          statementQuestion: updatedStatements,
        },
      };
    });
  };

  const handleStatementQuestionChange = (event) => {
    const { name, value } = event.target;
    const [lang, field] = name.split(".");
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
      return;
    }

    const { pairA, pairB, id } = value.rowData;

    if (value.type === "delete") {
      setEditQuestion((prev) => {
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

    const combinedPair = `${pairA} --- ${pairB}`;

    const finalCombined = {
      id: id,
      combined: combinedPair,
    };

    setEditQuestion((prev) => {
      const updatedPairQuestion = prev[language].pairQuestion.map((pair) =>
        pair.id === id ? { ...pair, ...finalCombined } : pair
      );

      if (!updatedPairQuestion.some((pair) => pair.id === id)) {
        updatedPairQuestion.push(finalCombined);
      }

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
        setEditQuestion((prev) => ({
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
        setEditQuestion((prev) => ({
          ...prev,
          [lang]: {
            ...prev[lang],
            [field]: value,
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

  const handleGetData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const Subjectdata = await fetchData(accessToken, CurrentSubject?._id);

      if (!Subjectdata?.subTopic || !Subjectdata.subjects) {
        console.log("No data received");
        return;
      }

      setSubtopics(Subjectdata.subTopic);
      setSubjectname(Subjectdata.subjects);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("Failed to fetch data.", error);
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetData();
  }, [accessToken]);

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

    return (
      !Object.values(englishOptions).every((val) => val) ||
      !Object.values(hindiOptions).every((val) => val)
    );
  };

  const handleAction = () => {
    setTimeout(() => {
      navigate("/subjectDetails");
    }, 1000);
  };

  const EditQuestion = async () => {
    try {
      if (isEmpty()) {
        toast.warning("Please fill up empty fields.");
      } else {
        const { _id, ...questionData } = editQuestion;
        const prepareDataForApi = (data) => {
          const {
            isDeleted,
            isBlocked,
            createdBy,
            updatedBy,
            createdAt,
            updatedAt,
            ...rest
          } = data;
          return rest;
        };
        const apiData = prepareDataForApi(questionData);
        const result = await editQuestionAPI(apiData, accessToken);
        if (result.success) {
          handleAction();
        } else {
          toast.error(result.message || "Failed to edit question.");
        }
      }
    } catch (err) {
      console.error("Error during question edit:", err.message);
      toast.error("An error occurred while editing the question.");
    }
  };

  useEffect(() => {
    const fetchedData = currentQuestion;

    if (fetchedData) {
      const updatedState = {
        ...getInitialEditQuestionState(fetchedData.questionType),

        ...fetchedData,
        questionId: fetchedData._id,
      };
      setEditQuestion(updatedState);
      setType(fetchedData?.type);

      const existSubtopics = fetchedData?.subtopicIds
        .map((subtopicId) =>
          subtopics.find((subtopic) => subtopic._id === subtopicId)
        )
        .filter((subtopic) => subtopic !== undefined);

      if (existSubtopics) {
        setSelectedSubtopic(existSubtopics);
      }
      const existSubject = subjectname.find(
        (sub) => sub._id === currentQuestion.subjectId
      );
      if (existSubject) {
        setSelectedSubject(existSubject);
      }
    }
  }, [currentQuestion, subjectname, subtopics]);

  useEffect(() => {
    console.log("EDIT_QUESTION", editQuestion);
  }, [editQuestion]);

  // const renderQuestionForm = () => {
  //   switch (questionType) {
  //     case "pair":
  //       return (
  //         <>
  //           {/* English Pair Form */}
  //           <EnglishQuestionPairForm
  //             editQuestion={editQuestion}
  //             setEditQuestion={setEditQuestion}
  //             currentEngPair={currentEngPair}
  //             setCurrentEngPair={setCurrentEngPair}
  //             addPairQuestion={handleAddPair}
  //             handleChange={handleChange}
  //             handleCheck={handleCheck}
  //             optionsArray={optionsArray}
  //             handlePairQuestionChange={handlePairQuestionChange}
  //             handleAddPair={handleAddPair}
  //             inputs={inputs.english} // Pass inputs as prop
  //             handleInputChange={handleInputChange}
  //           />
  //           {/* Hindi Pair Form */}
  //           <HindiQuestionPairForm
  //             editQuestion={editQuestion}
  //             setEditQuestion={setEditQuestion}
  //             currentHindiPair={currentHindiPair}
  //             addPairQuestion={handleAddPair}
  //             handleChange={handleChange}
  //             handleCheck={handleCheck}
  //             optionsArray={optionsArray}
  //             handlePairQuestionChange={handlePairQuestionChange}
  //             handleStatementQuestionChange={handleStatementQuestionChange}
  //             handleAddPair={handleAddPair}
  //             inputs={inputs.hindi} // Pass inputs as prop
  //             handleInputChange={handleInputChange}
  //           />
  //         </>
  //       );

  //     case "statement":
  //       return (
  //         <>
  //           {/* English Statement Form */}
  //           <EnglishQueStatementBaseform
  //             editQuestion={editQuestion}
  //             setEditQuestion={setEditQuestion}
  //             currentStatement={currentEngStatement}
  //             setCurrentStatement={setCurrentEngStatement}
  //             handleChange={handleChange}
  //             handleCheck={handleCheck}
  //             optionsArray={optionsArray}
  //             handleAddStatement={addStatementQuestion}
  //           />
  //           {/* Hindi Statement Form */}
  //           <HindiQueStatementBaseform
  //             editQuestion={editQuestion}
  //             setEditQuestion={setEditQuestion}
  //             currentStatement={currentHindiStatement}
  //             setCurrentStatement={setCurrentHindiStatement}
  //             handleChange={handleChange}
  //             handleCheck={handleCheck}
  //             optionsArray={optionsArray}
  //             handleAddStatement={addStatementQuestion}
  //           />
  //         </>
  //       );

  //     default: // "normal" or any other case
  //       return (
  //         <>
  //           {/* English Normal Form */}
  //           <NormalquestionBaseForm
  //             editQuestion={editQuestion}
  //             setEditQuestion={setEditQuestion}
  //             handleChange={handleChange}
  //             handleCheck={handleCheck}
  //             optionsArray={optionsArray}
  //           />
  //           {/* Hindi Normal Form */}
  //           <NormalHindQueBaseForm
  //             editQuestion={editQuestion}
  //             setEditQuestion={setEditQuestion}
  //             handleChange={handleChange}
  //             handleCheck={handleCheck}
  //             optionsArray={optionsArray}
  //           />
  //         </>
  //       );
  //   }
  // };

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
                  <SingleSelect
                    label="Subject"
                    options={subjectname}
                    selectedValue={selectedSubject}
                    onSubjectChange={handleSubjectChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-medium text-gray-900 text-start capitalize text-md dark:text-white">
                    Subtopic
                  </label>

                  <MultipleSelect
                    label="Subtopics"
                    value={selectedSubtopic}
                    onChange={handleSubtopicChange}
                    options={subtopics}
                  />
                </div>

                <div className="space-y-3">
                  <label className="font-medium text-gray-900 text-start capitalize text-md dark:text-white">
                    Question Type
                  </label>

                  <RadioButtons
                    options={radioOptions}
                    checkedValue={type}
                    onHandleChange={handleTypeChange}
                  />
                </div>
              </div>
              <div className="p-4 md:flex sm:flex text-sm font-medium text-gray-900 space-x-6  text-start dark:text-white">
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
                      checked={editQuestion.questionType === option}
                      onChange={(e) => {
                        setEditQuestion((prev) => ({
                          ...prev,
                          questionType: e.target.value,
                        }));
                      }}
                      className="w-4 h-4 text-orange-600 bg-orange-600 border-orange-600 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor={`type-${option}`}
                      className="w-full py-3 text-sm font-medium capitalize text-gray-900 dark:text-gray-300"
                    >
                      {option} {/* Display the question type option */}
                    </label>
                  </div>
                ))}
              </div>

              {editQuestion.questionType === "pair" ? (
                <EnglishQuestionPairForm
                  editQuestion={editQuestion}
                  setEditQuestion={setEditQuestion}
                  handleChange={handleChange}
                  handleCheck={handleCheck}
                  handlePairQuestionChange={handlePairQuestionChange}
                  handleAddPair={handleAddPair}
                  inputs={inputs.english}
                  handleInputChange={handleInputChange}
                  options={options} // Pass the options state
                />
              ) : editQuestion.questionType === "statement" ? (
                <EnglishQueStatementBaseform
                  editQuestion={editQuestion}
                  setEditQuestion={setEditQuestion}
                  handleChange={handleChange}
                  handleCheck={handleCheck}
                  options={options}
                  handleAddStatement={addStatementQuestion}
                />
              ) : (
                <NormalquestionBaseForm
                  editQuestion={editQuestion}
                  setEditQuestion={setEditQuestion}
                  handleChange={handleChange}
                  handleCheck={handleCheck}
                  options={options}
                />
              )}

              {editQuestion.questionType === "pair" ? (
                <HindiQuestionPairForm
                  editQuestion={editQuestion}
                  setEditQuestion={setEditQuestion}
                  addPairQuestion={handleAddPair}
                  handleChange={handleChange}
                  handleCheck={handleCheck}
                  options={options}
                  handlePairQuestionChange={handlePairQuestionChange}
                  handleStatementQuestionChange={handleStatementQuestionChange}
                  handleAddPair={handleAddPair}
                  inputs={inputs.hindi} // Pass inputs as prop
                  handleInputChange={handleInputChange}
                />
              ) : editQuestion.questionType === "statement" ? (
                <HindiQueStatementBaseform
                  editQuestion={editQuestion}
                  setEditQuestion={setEditQuestion}
                  handleChange={handleChange}
                  handleCheck={handleCheck}
                  options={options}
                  handleAddStatement={addStatementQuestion}
                />
              ) : (
                <NormalHindQueBaseForm
                  editQuestion={editQuestion}
                  setEditQuestion={setEditQuestion}
                  handleChange={handleChange}
                  handleCheck={handleCheck}
                  options={options}
                />
              )}

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={EditQuestion}
                  className="inline-flex items-center py-2 px-6 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <VscSaveAs className="mr-2" />
                      Save
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </section>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        theme="dark"
      />
    </>
  );
}

export default EditQuestion;
