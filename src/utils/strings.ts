export const clearString = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll(/ /g, "-")
    .replaceAll(/[:._ ]/g, "")
    .toLowerCase();
};
