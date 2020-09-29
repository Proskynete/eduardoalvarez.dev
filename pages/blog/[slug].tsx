import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import {
  FrontMatterInterface,
  PropsInterface,
  ReturnInterface,
  PathsResponseInterface,
} from "../../models/blogtemplate.model";
import Layout from "../../components/Layout";
const glob = require("glob");

const BlogTemplate = (props: PropsInterface) => {
  const { frontmatter, markdownBody, siteTitle } = props;

  const reformatDate = (fullDate: string) => {
    const date = new Date(fullDate);
    return date.toDateString().slice(4);
  };

  if (!frontmatter) return <></>;

  return (
    <Layout customTitle={siteTitle}>
      <article>
        <figure>{/* <img src={frontmatter.top_image} /> */}</figure>
        <header>
          <h1>{frontmatter.title}</h1>
          <h3>{reformatDate(frontmatter.date)}</h3>
        </header>
        <div>
          <ReactMarkdown source={markdownBody} />
        </div>
      </article>
    </Layout>
  );
};

export default BlogTemplate;

export const getStaticProps = async ({ ...ctx }): Promise<ReturnInterface> => {
  const { slug } = ctx.params;
  const content = await import(`../../posts/${slug}.md`);
  const config = await import(`../../data/config.json`);
  const data = matter(content.default);

  return {
    props: {
      siteTitle: config.title,
      frontmatter: data.data as FrontMatterInterface,
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
