import { formatDistanceToNow, format, differenceInDays } from "date-fns";
import es from "date-fns/locale/es";

const dateFromNow = (date: Date): string =>
  formatDistanceToNow(date, { locale: es, addSuffix: true });

const dateFormatted = (date: Date): string =>
  format(date, "PPP", { locale: es });

export const onlyDate = (date: string): string => date.split("T")[0];

export const getDiffDates = (date: Date): number =>
  differenceInDays(new Date(), date);

export const prettyFormat = (d: Date, type: "short" | "full"): string => {
  const date = new Date(d);

  return getDiffDates(date) <= 7
    ? dateFromNow(date)
    : type === "full"
    ? `Publicado el ${dateFormatted(date)}`
    : dateFormatted(date);
};
