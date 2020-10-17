import { SayInterface } from 'models/say.model';
import ReactMarkdown from 'react-markdown';

const Say = (props: SayInterface) => {
	const { title, content, anchor } = props;

	return (
		<aside id={anchor || ''} className='say col-12'>
			<div className='say__image'>
				<img src='/images/isotipo/isotipo-blue.png' alt='isotipo' />
			</div>

			<div className='say__container'>
				<p className='say__container__title'>{title}</p>
				<ReactMarkdown source={content} className='say__container__content' />
			</div>
		</aside>
	);
};

export default Say;
