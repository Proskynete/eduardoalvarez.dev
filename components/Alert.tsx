interface AlertInterface {
	text: string;
}

const Alert = (props: AlertInterface) => {
	const { text } = props;

	<div className='alert'>{text}</div>;
};

export default Alert;
