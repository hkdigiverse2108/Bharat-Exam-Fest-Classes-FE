

export const convertUtcToIsc = (utcDate) => {
  const utc = new Date(utcDate); 
  const offset = 5.5 * 60 * 60 * 1000; 
  const istDate = new Date(utc.getTime() + offset); 
  return istDate.toISOString();
};

export const convertIscToUtc = (istDate) => {
  const ist = new Date(istDate);
  const offset = 5.5 * 60 * 60 * 1000; 
  const utcDate = new Date(ist.getTime() - offset);
  return utcDate.toISOString(); 
};