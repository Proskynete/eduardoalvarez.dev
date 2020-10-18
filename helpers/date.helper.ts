import moment from 'moment';
moment.locale('es');

const getDiffDates = (datetime: string): number => {
	const today = moment(new Date());
	const date = moment(datetime);
	return today.diff(date, 'days');
};

const dateFromNow = (datetime: string): string => moment(datetime).fromNow();

const dateFormated = (datetime: string): string =>
	moment(datetime).format('LL');

export const prettyFormat = (datetime: string): string => {
	const _diff = getDiffDates(datetime);

	if (_diff <= 7) {
		return dateFromNow(datetime);
	}

	return dateFormated(datetime);
};

export const onlyDate = (datetime: string): string => datetime.split('T')[0];
