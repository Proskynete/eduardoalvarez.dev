import moment from "moment";
moment.locale("es");

export const onlyDate = (datetime: string): string => datetime.split("T")[0];

export const prettyFormat = (datetime: string): string =>
  moment(datetime).format("LL");
