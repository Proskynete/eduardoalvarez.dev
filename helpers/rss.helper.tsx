export const generateRssItem = (post: Post): string => `
  <item>
    <guid>https://emilioschepis.com/blog/${post.id}</guid>
    <title>${post.title}</title>
    <link>https://emilioschepis.com/blog/${post.id}</link>
    <description>${post.description}</description>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
  </item>
`;

export const generateRss = (posts: Post[]): string => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>EduardoÁlvarez - Blog</title>
      <link>https://eduardoalvarez.dev/blog</link>
      <description>[...]</description>
      <language>es</language>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="https://emilioschepis.com/rss.xml" rel="self" type="application/rss+xml"/>
      ${posts.map(generateRssItem).join('')}
    </channel>
  </rss>
`;
