import { DiscussionEmbed } from 'disqus-react';
import React from 'react';

interface DiscusInterface {
	path: string;
	id: string;
	title: string;
}

const DisqusComponent = (props: DiscusInterface) => {
	const { path, id, title } = props;

	const disqusShortName =
		process.env.DISQUS_SHORT_NAME || process.env.NEXT_PUBLIC_DISQUS_SHORT_NAME;

	const configDisqus = {
		url: `https://eduardoalvarez/${path}`,
		identifier: id,
		title: title,
	};

	return <DiscussionEmbed shortname={disqusShortName} config={configDisqus} />;
};

export default DisqusComponent;
