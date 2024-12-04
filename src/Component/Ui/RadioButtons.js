import React, { useState } from "react";

export default function RadioButtons({ checkedValue, onHandleChange, options }) {
  return (
    <>
      <div className="flex gap-6">
        {options.map((option, index) => (
          <div className="inline-flex items-center" key={index}>

            <label
              className="relative flex items-center cursor-pointer"
              htmlFor={option.label}
              key={option.value}
            >
              <input
                name="framework"
                type="radio"
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-orange-700 transition-all"
                id={option.label}
                value={option.value}
                checked={checkedValue === option.value} 
                onChange={onHandleChange}
              />
              <span className="absolute bg-orange-600 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>

            </label>
            <label
              className="ml-2 text-slate-700 cursor-pointer text-sm capitalize"
              htmlFor={option.label}
            >
              {option.value}
            </label>
          </div>
        ))}
      </div>
    </>
  );
}
