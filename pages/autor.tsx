import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import matter from "gray-matter";
import { dataSerialized } from "helpers/serializer.helper";
import { AuthorGSPInterface, AuthorPropsInterface } from "models/author";
import { FrontMatterInterface } from "models/blogtemplate.model";
import dynamic from "next/dynamic";
import { memo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const Layout = dynamic(() => import("components/Layout"));
const TableOfSections = dynamic(() => import("components/TableOfSections"));

const BlogTemplate = (props: AuthorPropsInterface) => {
  const { markdownBody, github_post_url, frontmatter, algolia } = props;
  const { title, description, sections } = frontmatter;

  return (
    <Layout
      customTitle={title}
      description={description}
      image="/"
      slug={title.toLocaleLowerCase()}
      algolia={algolia}
    >
      <div className="author">
        <article className="row justify-content-md-center">
          <div className="col-12">
            <div className="article__body">
              <div className="row justify-content-center justify-content-lg-start">
                <div
                  className="col-12 col-lg-2 offset-lg-1 sticky-top"
                  style={{ padding: "0", backgroundColor: "#fff" }}
                >
                  <TableOfSections sections={sections} />
                </div>

                <div className="col-12 col-md-10 col-lg-7">
                  <div className="article__body__content">
                    <ReactMarkdown
                      rehypePlugins={[rehypeRaw]}
                      children={markdownBody}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="errata">
              ¿Encontraste alguna errata? Ayudame a mejorar haciendo un{" "}
              <a
                href={github_post_url}
                target="_blank"
                rel="noreferrer noopener"
              >
                Pull Request.{" "}
                <FontAwesomeIcon
                  icon={faGithub}
                  className="info__content__icon__svg"
                />
              </a>
            </div>
          </div>
        </article>
      </div>
    </Layout>
  );
};

export default memo(BlogTemplate);

export const getStaticProps = async (): Promise<AuthorGSPInterface> => {
  const fileName = "about-me";
  const content = await import(`content/author/${fileName}.md`);
  const data = matter(content.default);

  return {
    props: {
      github_post_url: `https://github.com/Proskynete/blog/blob/master/content/author/about-me.md`,
      frontmatter: dataSerialized(data.data as FrontMatterInterface),
      markdownBody: data.content,
      algolia: {
        app_id: process.env.ALGOLIA_APPICATION_ID,
        api_key: process.env.ALGOLIA_ADMIN_API_KEY,
        index_name: process.env.ALGOLIA_INDEX_NAME,
      },
    },
  };
};
