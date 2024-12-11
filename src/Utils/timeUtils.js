import moment from "moment-timezone";

export const convertUtcToIsc = (utcDate) => {
  const istDate = moment(utcDate).tz("Asia/Kolkata", true);
  console.log("istDate", istDate);
  return istDate.toISOString();
};

export const convertIscToUtc = (iscDate) => {
  const utcTime = moment(iscDate).tz("Asia/Kolkata", true).utc();
  console.log("utcTime", utcTime);
  return utcTime.toISOString();
};
