import React from 'react';
import { DiscussionEmbed } from 'disqus-react';

interface DiscusInterface {
  path: string;
  id: string;
  title: string;
}

const DisqusComponent = (props: DiscusInterface) => {
  const { path, id, title } = props;

  const disqusShortName = 'Sitio web de Eduardo Álvarez';
  const configDisqus = {
    url: `https://eduardoalvarez/${path}`,
    identifier: id,
    title: title
  };

  return <><DiscussionEmbed shortname={disqusShortName} config={configDisqus} /></>
}

export default DisqusComponent;