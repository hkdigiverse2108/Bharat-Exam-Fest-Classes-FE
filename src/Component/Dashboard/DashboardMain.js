import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import ContestwiseEarn from "./ContestwiseEarn";
import Privacy from "./Privacy";
import OtpVerify from "../OtpVerify/OtpVerify";
import { fetchDashboardData } from "../../Hooks/dashboardService";
import { useSelector } from "react-redux";
import Loading from "../Loader/Loading";

export default function DashboardMain() {
  const accessToken = useSelector(
    (state) =>
      state.authConfig.userInfo[0]?.data?.token ||
      state.authConfig.userInfo[0]?.token
  );
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [totalQuestion, setTotalQuestion] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getContestData = async () => {
      setLoading(true);
      try {
        const result = await fetchDashboardData(accessToken);

        if (result && result.success) {

          setData1(result.section1);
          setData2(result.section2);
          setLoading(false);
        } else {
          setError("No data available or invalid response structure.");
        }
      } catch (err) {
        console.error("Error fetching contest data:", err);
        setError(
          err.message || "An error occurred while fetching contest data"
        );
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    getContestData();
  }, [accessToken]);

  if (loading) return <Loading />;

  return (
    <>
      <div className=" overflow-hidden space-y-6 pb-4">
        <Dashboard data={data1} earning={data2}/>
        <ContestwiseEarn data={data2}/>
        {/* <Privacy /> */}
      </div>
    </>
  );
}
