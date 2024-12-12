import moment from "moment-timezone";

export const convertIscToUtc = (istDate) => {
  const utcDate = moment
    .tz(istDate, "Asia/Kolkata")
    .utc()
    .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  // console.log(utcDate);

  return utcDate.replace("+00:00", "Z");
};

export const convertUtcToIst = (utcDate) => {
  const istDate = moment
    .utc(utcDate)
    .tz("Asia/Kolkata")
    .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  // console.log(istDate);

  return istDate.replace("Z", "+05:30");
};
