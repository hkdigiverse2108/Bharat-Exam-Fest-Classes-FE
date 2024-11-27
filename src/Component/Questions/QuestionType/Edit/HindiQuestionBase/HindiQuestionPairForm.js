import React from "react";
import { FaPlus } from "react-icons/fa";
import { MdStar } from "react-icons/md";

const HindiQuestionPairForm = ({
  editQuestion,
  setEditQuestion,
  currentStatement,
  setCurrentStatement,
  currentHindiPair,
  setCurrentHindiPair,
  addPairQuestion,
  handleChange,
  handleCheck,
  optionsArray1,
  handleStatementQuestionChange,
  handleAddPair,
  inputs,
  handleInputChange,
}) => {
  return (
    <div className="space-y-6 duration-300 ease-in-out">
      {/* Title */}
      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
        Hindi Question Section
      </p>

      {/* Question Input */}
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 dark:text-white">
          Write Question
        </label>
        <input
          className="border-2 border-gray-300 hover:border-gray-400 rounded-md w-full py-2 px-3 text-gray-800 focus:outline-none focus:ring-purple-600 focus:border-purple-600"
          id="question"
          type="text"
          placeholder="Add question"
          name="hindiQuestion.question"
          value={editQuestion.hindiQuestion.question}
          onChange={handleChange}
        />
      </div>

      {/* Add Pair Button */}
      <div className="space-y-2 flex flex-col items-center">
        <button
          onClick={() => handleAddPair("hindiQuestion")}
          className="inline-flex items-center space-x-2 rounded-lg px-6 py-2 text-md text-white bg-orange-500 hover:bg-opacity-90"
        >
          <FaPlus className="w-4 h-4" />
          <p className="font-semibold">Add Pair</p>
        </button>

        {/* Question Pair Inputs */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="space-y-2">
            <label className="text-md font-medium text-gray-900 dark:text-white">
              Question
            </label>
            <input
              type="text"
              id="input1"
              name="input1"
              value={inputs.input1}
              onChange={handleInputChange}
              className="border-2 border-gray-400 rounded-md w-full py-2 px-3 text-gray-800 focus:outline-none focus:ring-purple-600 focus:border-purple-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-md font-medium text-gray-900 dark:text-white">
              Answer
            </label>
            <input
              type="text"
              id="input2"
              name="input2"
              value={inputs.input2}
              onChange={handleInputChange}
              className="border-2 border-gray-400 rounded-md w-full py-2 px-3 text-gray-800 focus:outline-none focus:ring-purple-600 focus:border-purple-600"
            />
          </div>
        </div>
      </div>

      {/* Display Pair Questions */}
      <div className="space-y-2">
        {editQuestion.hindiQuestion?.pairQuestion?.length > 0 &&
          editQuestion.hindiQuestion.pairQuestion.map((pair, index) => {
            const [question, answer] = pair.split(" - ");
            return (
              <div key={index} className="grid grid-cols-2 gap-4">
                <span className="border border-green-300 p-2 text-gray-600 dark:text-gray-400">
                  {question}
                </span>
                <span className="border border-green-300 p-2 text-gray-600 dark:text-gray-400">
                  {answer}
                </span>
              </div>
            );
          })}
      </div>

      {/* Statement Question */}
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 dark:text-white">
          Enter Statement
        </label>
        <input
          className="border-2 border-gray-300 hover:border-gray-400 rounded-md w-full py-2 px-3 text-gray-800 focus:outline-none focus:ring-purple-600 focus:border-purple-600"
          id="statement"
          type="text"
          placeholder="Enter statement"
          value={currentStatement}
          onChange={handleStatementQuestionChange}
          name="hindiQuestion.statementQuestion"
        />
      </div>

      {/* Options A, B, C, D */}
      <div className="space-y-4">
        <p className="text-xl font-medium text-gray-900 dark:text-white">
          Options
        </p>
        <div className="flex flex-row items-center space-x-3">
          {["A", "B", "C", "D"].map((option) => (
            <div key={option} className="w-full">
              <label
                htmlFor={`hindiQuestion.options.${option}`}
                className="flex mb-2 text-start text-base font-medium text-gray-700 dark:text-white"
              >
                Option - {option}
                <MdStar className="text-orange-400 h-4 w-4" />
              </label>
              <textarea
                rows="3"
                name={`hindiQuestion.options.${option}`}
                value={editQuestion.hindiQuestion.options[option]}
                onChange={handleChange}
                className="block w-full p-2 border rounded-lg bg-white text-gray-600 border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={`Option ${option}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Answer Section */}
      <div className="space-y-4">
        <p className="text-xl font-medium text-gray-900 dark:text-white">
          Answer
        </p>
        <div className="flex space-x-6">
          {optionsArray1.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                id={`radio${option.value}`}
                type="radio"
                name="hindiQuestion.answer"
                value={option.value}
                checked={editQuestion.hindiQuestion.answer === option.value}
                onChange={(e) => handleCheck("hindiQuestion", e)}
                className="w-4 h-4 text-blue-600 border-gray-300 checked:bg-blue-600"
              />
              <label
                htmlFor={`radio${option.value}`}
                className="ml-2 text-sm text-gray-900 dark:text-gray-300"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Solution Section */}
      <div className="space-y-2">
        <p className="text-lg font-medium text-gray-900 dark:text-white">
          Solution
        </p>
        <textarea
          name="hindiQuestion.solution"
          className="border-2 border-gray-400 rounded-md w-full min-h-[100px] py-2 px-3 text-gray-800 focus:outline-none focus:ring-purple-600 focus:border-purple-600"
          placeholder="Enter solution"
          value={editQuestion.hindiQuestion.solution}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default HindiQuestionPairForm;
