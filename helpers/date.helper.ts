import moment from 'moment';
moment.locale('es');

const dateFromNow = (date: string): string => moment(date).fromNow();
const dateFormated = (date: string): string => moment(date).format('LL');

export const onlyDate = (date: string): string => date.split('T')[0];

export const getDiffDates = (date: string): number => {
	const today = moment(new Date());
	const _date = moment(date);
	return today.diff(_date, 'days');
};

export const prettyFormat = (date: string): string => {
	const _diff = getDiffDates(date);
	if (_diff <= 7) return dateFromNow(date);
	return dateFormated(date);
};
