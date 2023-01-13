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
const Subscribe = dynamic(() => import("components/Subscribe"));

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
        <div className="justify-content-md-center">
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
                  Software Engineer con +8 años de experiencia. He trabajado en
                  diferentes proyectos y empresas, las cuales han aportado
                  conocimientos y habilidades las que comparto en este blog.
                </p>

                <div className="home__presentation__description__social_network">
                  {config.social_network.map(
                    ({ show, name, link }: SocialNetworkInterface) =>
                      show && (
                        <a
                          key={name}
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
              <div className="col-12 col-md-7 col-xl-6">
                <section className="articles">
                  <div className="articles__header">
                    <p className="articles__header__title">Últimos artículos</p>
                  </div>

                  {articles.map((article: ArticleContentInterface) => (
                    <Article key={article.slug} {...article} />
                  ))}

                  <div className="articles__show_more">
                    <a
                      href="/articulos"
                      className="articles__show_more__link"
                      title="Ver todos"
                    >
                      Ver todos los artículos
                    </a>
                  </div>
                </section>
              </div>

              <aside className="col-12 col-md-3 col-xl-2 home__aside">
                <Subscribe />
              </aside>
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
