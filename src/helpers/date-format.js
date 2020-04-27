import moment from 'moment';

moment.locale('es');

const onlyDate = datetime => datetime.split('T')[0];
const onlyTime = datetime => datetime.split('T')[1].split('.')[0];
const fromNow = datetime => moment(datetime).fromNow();
const prettyFormat = datetime => moment(datetime).format('LL');

export { onlyDate, onlyTime, fromNow, prettyFormat };
