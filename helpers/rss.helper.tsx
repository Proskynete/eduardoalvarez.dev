import data from 'data/config.json';
import { PropsInterface } from 'models/blogtemplate.model';

export const generateRssItem = (post: PropsInterface): string => `
  <item>
    <guid>https://eduardoalvarez.dev/blog/${post.slug}</guid>
    <title>${post.frontmatter.title}</title>
    <link>https://eduardoalvarez.dev/blog/${post.slug}</link>
    <description>${post.frontmatter.description}</description>
    <pubDate>${new Date(post.frontmatter.date).toUTCString()}</pubDate>
  </item>
`;

export const generateRss = (posts: Array<PropsInterface>): string => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${data.title}</title>
      <link>https://eduardoalvarez.dev/blog</link>
      <description>${data.description}</description>
      <language>es</language>
      <lastBuildDate>${new Date(
				posts[0].frontmatter.date,
			).toUTCString()}</lastBuildDate>
      <atom:link href="https://eduardoalvarez.dev/rss.xml" rel="self" type="application/rss+xml"/>
      ${posts.map(generateRssItem).join('')}
    </channel>
  </rss>
`;
