const FROM_DATE = "2015-11-01";

export const getDifferenceInYears = (): number => {
  const date = new Date(FROM_DATE);
  const currentDate = new Date();
  const yearsDifference = currentDate.getFullYear() - date.getFullYear();
  const monthDifference = currentDate.getMonth() - date.getMonth();
  const dayDifference = currentDate.getDate() - date.getDate();
  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    return yearsDifference - 1;
  }
  return yearsDifference;
};

export const prettyDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
