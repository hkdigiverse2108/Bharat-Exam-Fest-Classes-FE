import * as React from "react";
import {
  Button,
  ButtonGroup,
  Menu,
  Box,
  MenuItem,
  TextField,
} from "@mui/material";
import { FiFilter } from "react-icons/fi";
// import Calander from "./Calander";

export default function FilterDropDownTest() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [filterType, setFilterType] = React.useState("day");
  const [selectedDay, setSelectedDay] = React.useState("");
  const [selectedWeek, setSelectedWeek] = React.useState("");
  const [selectedMonth, setSelectedMonth] = React.useState("");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFilterSelection = (type) => {
    setFilterType(type);
    setOpen(false);
  };

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  const handleWeekChange = (event) => {
    setSelectedWeek(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const filterByDay = (data) => {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    return data.filter((item) => {
      const createdAt = new Date(item.createdAt);
      return createdAt >= startOfDay && createdAt < endOfDay;
    });
  };
  const filterByWeek = (data) => {
    const today = new Date();
    const weekStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay() + 1
    ); // Monday
    const weekEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay() + 8
    ); // Next Monday

    return data.filter((item) => {
      const createdAt = new Date(item.createdAt);
      return createdAt >= weekStart && createdAt < weekEnd;
    });
  };
  const filterByMonth = (data) => {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    return data.filter((item) => {
      const createdAt = new Date(item.createdAt);
      return createdAt >= monthStart && createdAt < monthEnd;
    });
  };
  const data = [
    // ...  data
  ];

  const dayWiseData = filterByDay(data);
  // console.log("Day-wise Data:", dayWiseData);

  const weekWiseData = filterByWeek(data);
  // console.log("Week-wise Data:", weekWiseData);

  const monthWiseData = filterByMonth(data);
  // console.log("Month-wise Data:", monthWiseData);

  return (
    <>
      <div className="backdrop-blur-2xl  rounded-lg border border-slate-300 gap-x-2 flex justify-start">
        <Box class="w-full  rounded-lg shadow-md max-w-sm mx-auto">
          <ul class="flex flex-col items-start flex-wrap gap-y-2">
            <li className="w-full">
              <button
                onClick={() => handleFilterSelection("day")}
                class="flex p-2 px-3  border-orange-500 rounded font-medium hover:bg-transparent hover:border-orange-800 border bg-orange-400/25 text-black w-full"
              >
                Day wise
              </button>
            </li>
            <li className="w-full">
              <button
                onClick={() => handleFilterSelection("week")}
                class="flex p-2 px-3 border-orange-500 rounded font-medium hover:bg-transparent hover:border-orange-800 border bg-orange-400/25 text-black w-full"
              >
                Week wise
              </button>
            </li>
            <li className="w-full">
              <button
                onClick={() => handleFilterSelection("month")}
                class="flex p-2 px-3 border-orange-500 rounded font-medium hover:bg-transparent hover:border-orange-800 border bg-orange-400/25 text-black w-full"
              >
                Month wise
              </button>
            </li>
          </ul>
        </Box>
        <Box className="flex flex-col space-y-3 p-4  rounded-lg shadow-md">
          <div className=" md:w-48 lg:w-48 xl:w-48 md:ml-4 lg:ml-4 xl:ml-4">
            {filterType === "day" && (
              <div>
                <h3 className="text-2xl font-medium mb-2">Choose Day</h3>
                <TextField
                  type="date"
                  value={selectedDay}
                  onChange={handleDayChange}
                  fullWidth
                  variant="outlined"
                  className="bg-gray-100 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}

            {filterType === "week" && (
              <div>
                <h3 className="text-2xl font-medium mb-2">Choose Week</h3>
                <TextField
                  type="week"
                  value={selectedWeek}
                  onChange={handleWeekChange}
                  fullWidth
                  variant="outlined"
                  className="bg-gray-100 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}

            {filterType === "month" && (
              <div>
                <h3 className="text-2xl font-medium mb-2">Choose Month</h3>
                <TextField
                  type="month"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  fullWidth
                  variant="outlined"
                  className="bg-gray-100 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          <div className="">
            {filterType === "day" && selectedDay && (
              <p className="text-gray-600">Selected Day: {selectedDay}</p>
            )}
            {filterType === "week" && selectedWeek && (
              <p className="text-gray-600">Selected Week: {selectedWeek}</p>
            )}
            {filterType === "month" && selectedMonth && (
              <p className="text-gray-600">Selected Month: {selectedMonth}</p>
            )}
          </div>
        </Box>
      </div>
    </>
  );
}
