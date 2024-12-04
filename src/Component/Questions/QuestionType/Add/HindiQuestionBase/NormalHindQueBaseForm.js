import React from "react";
import { MdStar } from "react-icons/md";

const NormalHindQueBaseForm = ({
  addQuestion,
  handleChange,
  options,
  handleCheck,
  setAddQuestion,
}) => {
  return (
    <>
      <div className="px-4 py-2 space-y-6">
        {/* english */}
        <div className="space-y-4">
          <p className="text-2xl tracking-tight font-semibold text-left text-gray-900 dark:text-white capitalize">
            hindi question section
          </p>
          <div className="space-y-2">
            <p className="flex items-center capitalize text-lg font-medium text-gray-900 dark:text-white">
              write question
            </p>
          </div>
        </div>
        {/* Question Input */}
        <input
          className="border-2 pl-4 border-gray-300 hover:border-gray-400 transition-colors rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:shadow-outline"
          id="question"
          type="text"
          placeholder="Enter question"
          name="hindiQuestion.question"
          onChange={handleChange}
        />

        {/* Options Section */}
        <div className="p-4 space-y-4">
          <p className="flex items-center capitalize text-xl font-medium text-gray-900 dark:text-white">
            options
          </p>
          <div className="flex flex-row items-center space-x-3">
            {["A", "B", "C", "D"].map((option) => (
              <div key={option} className="w-1/4">
                <label className="flex mb-2 text-start capitalize text-base font-medium text-gray-700 dark:text-white">
                  Option - {option}
                  <MdStar className="text-orange-400 h-3 w-3" />
                </label>
                <input
                  type="text"
                  name={`hindiQuestion.options.${option}`}
                  value={addQuestion.hindiQuestion.options[option]}
                  onChange={handleChange}
                  className="block w-full p-2 border rounded-lg bg-white placeholder-gray-400 text-gray-600 border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none"
                  placeholder={`Option ${option}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Answer Selection */}
        <div className="p-4 space-y-4">
          <p className="flex items-center capitalize text-xl font-medium text-gray-900 dark:text-white">
            answer
          </p>
          <div className="md:flex sm:flex text-sm font-medium text-gray-900 space-x-6 text-start dark:text-white">
            <ul className="flex items-center justify-start gap-x-6 w-full text-sm font-medium text-gray-900">
              {Object.keys(options.AnswerOption).map((key) => (
                <li key={key}>
                  <div className="flex items-center ps-3">
                    <input
                      id={`radio${key}`}
                      type="radio"
                      name="hindiQuestion.answer" // Ensure you're using the correct name for the state structure
                      value={key} // Use the key (A, B, C, D) as the value
                      checked={addQuestion.hindiQuestion.answer === key} // Ensure the correct radio button is checked
                      onChange={(e) => handleCheck(e)} // Call handleCheck for hindiQuestion selection
                      className="w-4 h-4 text-blue-600 border-gray-300 checked:bg-blue-600 checked:outline-none"
                    />
                    <label
                      htmlFor={`radio${key}`}
                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Option {key} {/* The key will be 'A', 'B', 'C', 'D' */}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Solution Textarea */}
        <div className="space-y-2">
          <p className="flex items-center capitalize text-lg font-medium text-gray-900 dark:text-white">
            solution
          </p>
          <textarea
            id="message"
            rows="4"
            name={addQuestion.hindiQuestion.solution}
            onChange={(e) =>
              setAddQuestion((prev) => ({
                ...prev,
                hindiQuestion: {
                  ...prev.hindiQuestion,
                  solution: e.target.value,
                },
              }))
            }
            className="border-2 pl-2 text-md border-gray-400 hover:border-gray-400 transition-colors rounded-md w-full min-h-[100px] py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:shadow-outline"
            placeholder="Enter solution..."
          />
        </div>
      </div>
    </>
  );
};

export default NormalHindQueBaseForm;
