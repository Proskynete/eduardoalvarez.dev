import { faEnvelope, faUser } from '@fortawesome/free-regular-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AlertContext } from 'context/alertContext';
import { CONSTANTS, event } from 'lib/gtag';
import {
	InputsInterface,
	TargetElementInterface,
} from 'models/subscribe.model';
import { memo, SyntheticEvent, useContext, useRef, useState } from 'react';

const defaultValues: InputsInterface = {
	name: '',
	email: '',
};

const Subscribe = () => {
	const [values, setValues] = useState<InputsInterface>(defaultValues);
	const [buttonState, setButtonState] = useState({
		disabled: true,
		loading: false,
	});
	const { setAlert } = useContext(AlertContext);

	const _name = useRef(null);
	const _email = useRef(null);

	const handleChangeInput = (e: TargetElementInterface): void => {
		setValues({
			...values,
			[e.target.name]: e.target.value,
		});

		if (values.name !== '' && values.name.length >= 3 && values.email !== '') {
			setButtonState({ ...buttonState, disabled: false });
		} else {
			setButtonState({ ...buttonState, disabled: true });
		}
	};

	const handleSubscribe = async (e: SyntheticEvent) => {
		e.preventDefault();
		setButtonState({ ...buttonState, loading: true });

		try {
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

			event({
				action: 'SUBSCRIBE_ACTION',
				category: CONSTANTS.EVENT_ACTION.CATEGORY,
				label: 'Track action - subscribe action',
				value: `Llamar a la función para suscribirse`,
			});

			const { code, error, message } = await res.json();

			setAlert({
				show: true,
				variant: code !== 200 ? 'error' : 'success',
				title: code !== 200 ? error : message,
			});

			if (code === 200) setValues(defaultValues);

			setButtonState({ ...buttonState, loading: false });
		} catch (_) {
			setAlert({
				show: true,
				variant: 'error',
				title:
					'Error de comunicación. Revisa tu internet e intenta nuevamente.',
			});
			setButtonState({ ...buttonState, loading: false });
		}
	};

	return (
		<form className='subscribe' onSubmit={handleSubscribe}>
			<div className='subscribe-container'>
				<p className='subscribe-title'>Suscríbete</p>
				<p className='subscribe-subtitle'>Para novedades, cursos y ofertas.</p>
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
								ref={_name}
								className='with-icon'
								placeholder='Tu nombre'
								value={values.name}
								onChange={handleChangeInput}
								required
								autoComplete='off'
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
								ref={_email}
								className='with-icon'
								placeholder='Tu correo'
								value={values.email}
								onChange={handleChangeInput}
								required
								autoComplete='off'
							/>
						</div>
					</div>
				</div>
				<div className='subscribe-button'>
					<button
						type='submit'
						className='button secondary'
						disabled={buttonState.disabled}
					>
						{buttonState.loading ? (
							<FontAwesomeIcon icon={faSpinner} spin />
						) : (
							'Suscribirse'
						)}
					</button>
				</div>
			</div>
		</form>
	);
};

export default memo(Subscribe);
