import React from "react";
import { FaPlus } from "react-icons/fa";
import { MdStar } from "react-icons/md";
import FullTable from "../../../../Ui/Table";

const HindiQueStatementBaseform = ({
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
    <div className="space-y-4 duration-300 ease-in-out">
      <p className="text-2xl tracking-tight font-semibold text-left text-gray-900 dark:text-white capitalize">
        hindi question section
      </p>
      <div className="space-y-2">
        <div className="space-y-2">
          <p className="flex items-center capitalize text-lg font-medium text-gray-900 dark:text-white">
            write question
          </p>
        </div>
        {/* Input for the question */}
        <input
          className="border-2 pl-2 text-lg  border-gray-400 hover:border-gray-400 transition-colors rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:shadow-outline"
          id="username"
          type="text"
          placeholder="Enter question"
          value={editQuestion.hindiQuestion.question}
          onChange={handleChange}
          name="hindiQuestion.question"
        />

        {/* Display list of statements */}
        <div className="space-y-2">
          <FullTable
            pairQuestion={editQuestion.hindiQuestion.statementQuestion}
            language={"hindiQuestion"}
            handleChange={handleAddStatement}
            questionType={"statement"}
          />
        </div>

        {/* Input for suggestions */}
        <input
          className="border-2 pl-2 text-lg  border-gray-400 hover:border-gray-400 transition-colors rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:shadow-outline"
          id="username"
          type="text"
          placeholder="Enter suggestion"
          value={editQuestion.englishQuestion.lastQuestion || ""}
          onChange={handleChange}
          name="hindiQuestion.lastQuestion"
        />

        {/* Options section */}
        <div className="p-4 space-y-4">
          <p className="flex items-center capitalize text-xl font-medium text-gray-900 dark:text-white">
            options
          </p>

          <div className="flex flex-row items-center space-x-3">
            {["A", "B", "C", "D"].map((option) => (
              <div key={option} className="w-1/4">
                <label
                  htmlFor={`hindiQuestion.options.${option}`}
                  className="flex mb-2 text-start capitalize text-base font-medium text-gray-700 dark:text-white"
                >
                  Option - {option}
                  <MdStar className="text-orange-400 h-3 w-3" />
                </label>
                <input
                  type="text"
                  name={`hindiQuestion.options.${option}`}
                  value={editQuestion.hindiQuestion.options[option]}
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
          <p className="flex items-center capitalize text-xl font-medium text-gray-900 dark:text-white">
            answer
          </p>
          <div className="md:flex sm:flex text-sm font-medium text-gray-900 space-x-6 text-start dark:text-white">
            <ul className="flex items-center justify-start gap-x-6 w-full text-sm font-medium text-gray-900">
              {optionsArray.map((option) => (
                <li key={option.value}>
                  <div className="flex items-center ps-3">
                    <input
                      id={`radio${option.value}`}
                      type="radio"
                      name="hindiQuestion.answer" // Use the appropriate name for your state structure
                      value={option.value}
                      checked={
                        editQuestion.hindiQuestion.answer === option.value
                      } // Ensure the correct radio button is checked
                      onChange={(e) => handleCheck("hindiQuestion", e)} // Call handleCheck for englishQuestion selection
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
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            Solution
          </p>
          <textarea
            name="hindiQuestion.solution" // Use a name that the handleChange function can understand
            className="border-2 pl-2 text-md border-gray-400 hover:border-gray-400 transition-colors rounded-md w-full min-h-[100px] py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:shadow-outline"
            placeholder="Enter solution"
            value={editQuestion.hindiQuestion.solution} // Bind the value to the state
            onChange={handleChange} // Use handleChange for updating the value
          />
        </div>
      </div>
    </div>
  );
};

export default HindiQueStatementBaseform;
