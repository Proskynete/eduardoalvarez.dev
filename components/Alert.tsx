import { AlertContext } from 'context/alertContext';
import { useContext } from 'react';

const Alert = () => {
	const { alert, close } = useContext(AlertContext);

	return (
		<div
			className={`custom-alert${alert.show ? ' show' : ''}${
				alert.variant ? ` ${alert.variant}` : ''
			}`}
		>
			<div className='custom-alert__inner'>
				<p className='custom-alert__inner__title'>{alert.title}</p>
				<div
					role='presentation'
					className='custom-alert__inner__button'
					onClick={() => close()}
				>
					X
				</div>
			</div>
		</div>
	);
};

export default Alert;
