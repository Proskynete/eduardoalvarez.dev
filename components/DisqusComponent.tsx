import { DiscussionEmbed } from 'disqus-react';
import { memo } from 'react';

export interface DiscusInterface {
	path: string;
	id: string;
	title: string;
	disqusShortName: string;
}

const DisqusComponent = (props: DiscusInterface) => {
	const { path, id, title, disqusShortName } = props;

	const configDisqus = {
		url: `https://eduardoalvarez/${path}`,
		identifier: id,
		title: title,
	};

	return (
		<section className='disqus'>
			<article className='disqus-inner'>
				<DiscussionEmbed shortname={disqusShortName} config={configDisqus} />
			</article>
		</section>
	);
};

export default memo(DisqusComponent);
