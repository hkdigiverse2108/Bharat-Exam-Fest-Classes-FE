import React from "react";
import Navbar from "../Navigationbar/Navbar";

const DefaultLayout = ({ children }) => {
  return (
    <>
      <div className=" dark:bg-boxdark-2 dark:text-bodydark">
        <div className="relative flex flex-col h-screen overflow-hidden">
          <Navbar />
          <main className="h-full  overflow-hidden">
            <div className=" w-full  p-4 h-full overflow-y-auto overflow-x-hidden">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default DefaultLayout;
