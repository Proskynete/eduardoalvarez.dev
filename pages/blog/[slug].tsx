import { FC, memo } from "react";
import glob from "glob";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown/with-html";
import {
  SectionsInterface,
  FrontMatterInterface,
  PropsInterface,
  ReturnInterface,
  PathsResponseInterface,
} from "models/blogtemplate.model";
import Layout from "components/Layout";
import { prettyFormat } from "helpers/date.helper";
import { prettyReadingTime } from "helpers/reading-time.helper";

const BlogTemplate: FC<PropsInterface> = (props) => {
  const { frontmatter, markdownBody, siteTitle } = props;
  const {
    date,
    description,
    hero_image,
    read_time,
    sections,
    title,
  } = frontmatter;

  return (
    <Layout customTitle={siteTitle} description={description}>
      <article>
        <figure>
          <img src={hero_image} />
        </figure>
        <header>
          <h1>{title}</h1>
          <time dateTime={date}>Publicado el {prettyFormat(date)}</time>
          <p>{prettyReadingTime(read_time)}</p>
        </header>
        <aside>
          {sections.map((section: SectionsInterface) => (
            <a href={section.anchor} key={section.anchor}>
              {section.title}
            </a>
          ))}
        </aside>
        <div>
          <ReactMarkdown source={markdownBody} escapeHtml={false} />
        </div>
      </article>
    </Layout>
  );
};

export default memo(BlogTemplate);

export const getStaticProps = async ({ ...ctx }): Promise<ReturnInterface> => {
  const { slug } = ctx.params;
  const content = await import(`../../posts/${slug}.md`);
  const config = await import(`../../data/config.json`);
  const data = matter(content.default);

  return {
    props: {
      siteTitle: config.title,
      frontmatter: JSON.parse(
        JSON.stringify(data.data)
      ) as FrontMatterInterface,
      markdownBody: data.content,
    },
  };
};

export const getStaticPaths = async (): Promise<PathsResponseInterface> => {
  const blogs = glob.sync("posts/**/*.md");

  const blogSlugs = blogs.map((file: any) =>
    file.split("/")[1].replace(/ /g, "-").slice(0, -3).trim()
  );

  const paths = blogSlugs.map((slug: string) => `/blog/${slug}`);

  return {
    paths,
    fallback: false,
  };
};
