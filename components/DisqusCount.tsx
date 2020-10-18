import { CommentCount } from 'disqus-react';

interface DiscusInterface {
	path: string;
	id: string;
	title: string;
	disqusShortName: string;
}

const DisqusCount = (props: DiscusInterface) => {
	const { path, id, title, disqusShortName } = props;

	const configDisqus = {
		url: `https://eduardoalvarez/${path}`,
		identifier: id,
		title: title,
	};

	return <CommentCount shortname={disqusShortName} config={configDisqus} />;
};

export default DisqusCount;
