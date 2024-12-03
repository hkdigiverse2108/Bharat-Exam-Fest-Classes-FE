import React from "react";

const NoDataFound = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="text-center animate__animated animate__fadeIn animate__delay-1s">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          No Data Found
        </h2>
        <p className="text-md text-gray-600 dark:text-gray-400 mb-6">
          Unfortunately, we couldn't find any results matching your search.
        </p>
        <div className="mt-6">
          <button
            className="px-6 py-3 bg-orange-600 text-white text-lg font-semibold rounded-md shadow-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={() => window.location.reload()} 
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoDataFound;
