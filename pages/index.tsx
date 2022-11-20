import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getPosts } from "helpers/posts.helper";
import { postsSortied } from "helpers/sorter.helper";
import config from "data/config.json";
import { BlogTemplatePropsInterface } from "models/blogtemplate.model";
import {
  ArticleContentInterface,
  GetStaticPropsReturnInterface,
  HomePropsInterface,
} from "models/index.model";
import dynamic from "next/dynamic";
import { memo } from "react";
import {
  SocialNetworkInterface,
  socialNetworkMap,
} from "models/social-network.model";

const Article = dynamic(() => import("components/Article"));
const Layout = dynamic(() => import("components/Layout"));

const Index = (props: HomePropsInterface) => {
  const { title, description, image, articles, algolia } = props;

  return (
    <Layout
      customTitle={title}
      description={description}
      image={image}
      algolia={algolia}
    >
      <div className="home">
        <div className="row">
          <div className="col-12">
            <div className="home__presentation">
              <div className="home__presentation__image">
                <img
                  decoding="async"
                  data-sizes="auto"
                  data-src="/images/me/eduardo_alvarez.gif"
                  alt="Imagen de Eduardo Álvarez"
                  loading="lazy"
                  className="home__presentation__image__img lazyload"
                />
              </div>

              <div className="home__presentation__description">
                <p className="home__presentation__description__title">
                  Hola! Mi nombre es Eduardo Álvarez
                </p>
                <p className="home__presentation__description__text">
                  Y soy un apasionado por las tecnologías web (JS Lover). Busco
                  compartir todo lo que he aprendido en estos años mediante
                  artículos, tutoriales y cursos.
                </p>

                <div className="home__presentation__description__social_network">
                  {config.social_network.map(
                    ({ show, name, link }: SocialNetworkInterface) =>
                      show && (
                        <a
                          href={link}
                          title={name}
                          className="home__presentation__description__social_network__link"
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          <FontAwesomeIcon
                            icon={socialNetworkMap.get(name)}
                            className="home__presentation__description__social_network__link__icon"
                          />
                        </a>
                      )
                  )}
                </div>
              </div>
            </div>

            <div className="row justify-content-md-center">
              <div className="col-12 col-md-9 col-xl-7">
                <section className="articles">
                  <div className="articles__header">
                    <p className="articles__header__title">
                      Últimas publicaciones
                    </p>
                  </div>

                  {articles.map((article: ArticleContentInterface) => (
                    <Article key={article.slug} {...article} />
                  ))}
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default memo(Index);

export const getStaticProps =
  async (): Promise<GetStaticPropsReturnInterface> => {
    const siteConfig = await import(`data/config.json`);

    const posts: BlogTemplatePropsInterface[] = ((context) =>
      getPosts(context))(
      require["context"]("../content/posts", false, /\.md$/)
    );
    const sortied = postsSortied<BlogTemplatePropsInterface>(posts, "slug");
    const articlesSliced = sortied.slice(0, 5);

    return {
      props: {
        articles: articlesSliced,
        title: siteConfig.title,
        description: siteConfig.description,
        image: siteConfig.image,
        algolia: {
          app_id: process.env.ALGOLIA_APPICATION_ID,
          api_key: process.env.ALGOLIA_ADMIN_API_KEY,
          index_name: process.env.ALGOLIA_INDEX_NAME,
        },
      },
    };
  };
