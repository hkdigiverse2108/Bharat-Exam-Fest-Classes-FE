import React from "react";
import { FaPlus } from "react-icons/fa";
import { MdStar } from "react-icons/md";
import FullTable from "../../../../Ui/Table";

const EnglishQueStatementBaseform = ({
  editQuestion,
  setEditQuestion,
  currentStatement,
  setCurrentStatement,
  handleChange,
  handleCheck,
  optionsArray,
  handleAddStatement,
}) => {
  return (
    <div className="px-4 py-6 space-y-6 duration-300 ease-in-out">
      {/* English Section */}
      <div className="space-y-4">
        <p className="text-2xl sm:text-3xl lg:text-4xl tracking-tight font-semibold text-left text-gray-900 dark:text-white capitalize">
          English Question Section
        </p>
        <div className="space-y-2">
          <p className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white capitalize">
            Write Question
          </p>
        </div>
      </div>

      {/* Input for the question */}
      <input
        className="border-2 pl-2 text-lg sm:text-xl border-gray-400 hover:border-gray-400 transition-colors rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:shadow-outline"
        id="question"
        type="text"
        placeholder="Enter question"
        value={editQuestion.englishQuestion.question}
        onChange={handleChange}
        name="englishQuestion.question"
      />

      {/* Display list of statements */}
      <div className="space-y-2">
        <FullTable
          pairQuestion={editQuestion.englishQuestion.statementQuestion}
          language={"englishQuestion"}
          handleChange={handleAddStatement}
          questionType={"statement"}
        />
      </div>

      {/* Input for suggestions */}
      <input
        className="border-2 pl-2 text-lg sm:text-xl border-gray-400 hover:border-gray-400 transition-colors rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:shadow-outline"
        id="suggestion"
        type="text"
        placeholder="Enter question"
        value={editQuestion.englishQuestion.lastQuestion || ""}
        onChange={handleChange}
        name="englishQuestion.lastQuestion"
      />

      {/* Options section */}
      <div className="p-4 space-y-4">
        <p className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white">
          Options
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {["A", "B", "C", "D"].map((option) => (
            <div key={option} className="w-full">
              <label
                htmlFor={`englishQuestion.options.${option}`}
                className="inline-flex text-sm sm:text-base mb-2 text-start capitalize font-medium text-gray-700 dark:text-white"
              >
                Option - {option}
                <MdStar className="text-orange-400 h-3 w-3" />
              </label>
              <input
                type="text"
                name={`englishQuestion.options.${option}`}
                value={editQuestion.englishQuestion.options[option]}
                onChange={handleChange}
                className="block w-full p-2 border rounded-lg bg-white placeholder-gray-400 text-gray-600 border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none"
                placeholder={`Option ${option}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Answer section */}
      <div className="p-4 space-y-4">
        <p className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white">
          Answer
        </p>
        <div className="md:flex sm:flex-col text-sm sm:text-base font-medium text-gray-900 space-x-6 text-start dark:text-white">
          <ul className="flex items-center justify-start gap-x-6 w-full text-sm font-medium text-gray-900">
            {optionsArray.map((option) => (
              <li key={option.value}>
                <div className="flex items-center ps-3">
                  <input
                    id={`radio${option.value}`}
                    type="radio"
                    name="englishQuestion.answer" // Use the appropriate name for your state structure
                    value={option.value}
                    checked={
                      editQuestion.englishQuestion.answer === option.value
                    } // Ensure the correct radio button is checked
                    onChange={(e) => handleCheck("englishQuestion", e)} // Call handleCheck for englishQuestion selection
                    className="w-4 h-4 text-blue-600 border-gray-300 checked:bg-blue-600 checked:outline-none"
                  />
                  <label
                    htmlFor={`radio${option.value}`}
                    className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {option.label}
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Solution section */}
      <div className="space-y-2">
        <p className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white">
          Solution
        </p>
        <textarea
          name="englishQuestion.solution"
          className="border-2 pl-2 text-md sm:text-lg border-gray-400 hover:border-gray-400 transition-colors rounded-md w-full min-h-[100px] py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:shadow-outline"
          placeholder="Enter solution"
          value={editQuestion.englishQuestion.solution}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default EnglishQueStatementBaseform;
