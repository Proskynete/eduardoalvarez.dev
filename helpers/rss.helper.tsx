import config from 'data/config.json';
import { BlogTemplatePropsInterface } from 'models/blogtemplate.model';
import moment from 'moment';

export const generateRssItem = (post: BlogTemplatePropsInterface): string => `
  <item>
    <title>${post.frontmatter.title}</title>
    <link>https://eduardoalvarez.dev/blog/${post.slug}</link>
    <pubDate>${moment.utc(post.frontmatter.date)}</pubDate>
    <guid>https://eduardoalvarez.dev/blog/${post.slug}</guid>
    <description>${post.frontmatter.description}</description>
  </item>
`;

export const generateRss = (
	posts: Array<BlogTemplatePropsInterface>,
): string => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${config.title}</title>
      <link>${config.url}</link>
      <description>${config.description}</description>
      <language>${config.languaje}</language>
      <lastBuildDate>${new Date(
				posts[0].frontmatter.date,
			).toUTCString()}</lastBuildDate>
      <atom:link href="https://eduardoalvarez.dev/rss.xml" rel="self" type="application/rss+xml"/>
      ${posts.map(generateRssItem).join('')}
    </channel>
  </rss>
`;
