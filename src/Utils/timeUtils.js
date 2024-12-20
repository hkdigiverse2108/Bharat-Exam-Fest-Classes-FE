

export const convertUtcToIst = (utcDate) => {
  const utcTime = new Date(utcDate); // Convert UTC string to Date object
  const indiaTime = new Date(utcTime.getTime() + 5.5 * 60 * 60 * 1000); // Convert UTC to IST (adding 5 hours 30 minutes)

  return indiaTime.toISOString(); // Return ISO formatted date in IST
};
