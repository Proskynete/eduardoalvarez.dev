import { SayInterface } from 'models/say.model';
import Image from 'next/image';
import { memo } from 'react';
import ReactMarkdown from 'react-markdown';

const Say = (props: SayInterface) => {
	const { title, content, anchor, variant } = props;

	return (
		<aside id={anchor || ''} className='say col-12'>
			<div className='say__image'>
				<Image
					src='/images/isotipo/isotipo-blue.png'
					alt='isotipo'
					unsized={true}
					loading='lazy'
				/>
			</div>

			<div className='say__container' data-type={variant || 'primary'}>
				<p className='say__container__title' data-type={variant || 'primary'}>
					{title}
				</p>
				<ReactMarkdown source={content} className='say__container__content' />
			</div>
		</aside>
	);
};

export default memo(Say);
