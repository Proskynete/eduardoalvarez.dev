import { faEnvelope, faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	InputsInterface,
	TargetElementInterface,
} from 'models/subscribe.model';
import { memo, SyntheticEvent, useState } from 'react';

const defaultValues: InputsInterface = {
	name: '',
	email: '',
};

const Subscribe = () => {
	const [values, setValues] = useState<InputsInterface>(defaultValues);
	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [messageResponse, setMessageResponse] = useState('');

	const handleChangeInput = (e: TargetElementInterface): void => {
		setValues({
			...values,
			[e.target.name]: e.target.value,
		});

		if (values.name !== '' && values.name.length >= 3 && values.email !== '') {
			setButtonDisabled(false);
		} else {
			setButtonDisabled(true);
		}
	};

	const handleSubscribe = async (e: SyntheticEvent) => {
		e.preventDefault();

		const res = await fetch('/api/subscribe', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: values.email,
				name: values.name,
			}),
		});

		const { error, message } = await res.json();

		if (error) setMessageResponse(error);

		setValues(defaultValues);
		setMessageResponse(message);
	};

	return (
		<form className='subscribe' onSubmit={(e) => handleSubscribe(e)}>
			<div className='subscribe-container'>
				<p className='subscribe-title'>Suscríbete</p>
				<p className='subscribe-subtitle'>Para novedades, cursos y ofertas</p>
				<div className='subscribe-input-container'>
					<div className='subscribe-label'>
						<div className='subscribe-input'>
							<label htmlFor='name' className='read-only'>
								Tu nombre
							</label>
							<div className='icon'>
								<FontAwesomeIcon icon={faUser} />
							</div>
							<input
								id='name'
								name='name'
								type='text'
								className='with-icon'
								placeholder='Tu nombre'
								value={values.name}
								onChange={handleChangeInput}
								required
							/>
						</div>
					</div>
					<div className='subscribe-label'>
						<div className='subscribe-input'>
							<label htmlFor='email' className='read-only'>
								Tu correo
							</label>
							<div className='icon'>
								<FontAwesomeIcon icon={faEnvelope} />
							</div>
							<input
								id='email'
								name='email'
								type='email'
								className='with-icon'
								placeholder='Tu correo'
								value={values.email}
								onChange={handleChangeInput}
								required
							/>
						</div>
					</div>
				</div>
				<div className='subscribe-button'>
					<button
						type='submit'
						className='button secondary'
						disabled={buttonDisabled}
					>
						Suscribirse
					</button>
				</div>
				<div>{messageResponse}</div>
			</div>
		</form>
	);
};

export default memo(Subscribe);
