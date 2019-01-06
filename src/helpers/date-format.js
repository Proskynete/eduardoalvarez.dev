import moment from 'moment';

const onlyDate = datetime => datetime.split('T')[0];
const onlyTime = datetime => datetime.split('T')[1].split('.')[0];
const agoFormat = datetime => moment(datetime).locale('es').fromNow();
const prettyFormat = datetime => moment(datetime).locale('es').format('LL');


export {
    onlyDate,
    onlyTime,
    agoFormat,
    prettyFormat,
};
