import { FC, memo } from "react";
import ReactMarkdown from "react-markdown/with-html";
import glob from "glob";
import matter from "gray-matter";
import { faCalendar, faClock } from "@fortawesome/free-regular-svg-icons";
import { faTag, faTags } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Layout from "components/Layout";
import TableOfSections from "components/TableOfSections";
import { prettyFormat } from "helpers/date.helper";
import { prettyReadingTime } from "helpers/reading-time.helper";
import { prettyTags } from "helpers/tags.helper";
import {
  FrontMatterInterface,
  PathsResponseInterface,
  PropsInterface,
  ReturnInterface,
} from "models/blogtemplate.model";

const BlogTemplate: FC<PropsInterface> = (props) => {
  const { frontmatter, markdownBody, slug } = props;
  const {
    date,
    description,
    hero_image,
    read_time,
    tags,
    sections,
    title,
    introduction,
    image_introduction,
  } = frontmatter;

  return (
    <Layout
      customTitle={title}
      description={description}
      image={hero_image}
      slug={`blog/${slug}`}
    >
      <section className="row">
        <header className="col-xs-12">
          <h1 className="hero-title">{title}</h1>

          <div className="meta-information">
            <div className="information">
              <div className="icon-container">
                <FontAwesomeIcon icon={faCalendar} />
              </div>
              <p className="content">
                <time dateTime={date}>Publicado el {prettyFormat(date)}</time>
              </p>
            </div>
            <div className="information">
              <div className="icon-container">
                <FontAwesomeIcon icon={faClock} />
              </div>
              <p className="content">{prettyReadingTime(read_time)}</p>
            </div>
            <div className="information">
              <div className="icon-container">
                <FontAwesomeIcon icon={tags.length > 1 ? faTags : faTag} />
              </div>
              <p className="tags-content">{prettyTags(tags)}</p>
            </div>
          </div>
        </header>

        <figure className="col-xs-12">
          <div className="hero-image-container">
            <img src={hero_image} className="hero-image" />
          </div>
        </figure>

        <TableOfSections sections={sections} />

        <aside id={introduction.anchor} className="col-xs-12 intro">
          <div className="isotipo-container">
            <img src="/images/isotipo/isotipo-blue.png" alt="isotipo" />
          </div>

          <div className="intro-container">
            <p className="intro-title">{introduction.title}</p>
            <ReactMarkdown
              source={introduction.content}
              className="article-content"
            />
          </div>
        </aside>

        <figure className="col-xs-12">
          <div className="intro-image">
            <img src={image_introduction} className="introduction-image" />
          </div>
        </figure>

        <article className="col-xs-12">
          <ReactMarkdown
            source={markdownBody}
            escapeHtml={false}
            className="article-content"
          />
        </article>
      </section>
    </Layout>
  );
};

export default memo(BlogTemplate);

export const getStaticProps = async ({ ...ctx }): Promise<ReturnInterface> => {
  const { slug } = ctx.params;
  const content = await import(`../../posts/${slug}.md`);
  const data = matter(content.default);

  return {
    props: {
      frontmatter: JSON.parse(
        JSON.stringify(data.data)
      ) as FrontMatterInterface,
      markdownBody: data.content,
      slug: slug,
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
