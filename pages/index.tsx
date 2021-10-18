import { getPosts } from "helpers/posts.helper";
import { postsSortered } from "helpers/sorter.helper";
import { BlogTemplatePropsInterface } from "models/blogtemplate.model";
import {
  ArticleContentInterface,
  GetStaticPropsReturnInterface,
  HomePropsInterface,
} from "models/index.model";
import dynamic from "next/dynamic";
import Link from "next/link";
import { memo } from "react";

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
                  data-src="/images/me/eduardo_alvarez.png"
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
                  ... Y soy un apasionado por las tecnologías web (JS Lover).
                  Busco compartir todo lo que he aprendido en estos años
                  mediante artículos, tutoriales y cursos.
                </p>

                <Link href="/autor">
                  <a className="home__presentation__description__link">
                    Conoce más sobre mi
                  </a>
                </Link>
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-12 col-lg-7 col-xl-6">
                <section className="articles">
                  <div className="articles__header">
                    <p className="articles__header__title">Últimos artículos</p>
                    <Link href="/articulos">
                      <a className="articles__header__subtitle">Ver más</a>
                    </Link>
                  </div>
                  {articles.map((article: ArticleContentInterface) => {
                    return <Article key={article.slug} {...article} />;
                  })}
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
      getPosts(context))(require["context"]("../content/posts", true, /\.md$/));
    const sortered = postsSortered<BlogTemplatePropsInterface>(posts);
    const articlesSliced = sortered.slice(0, 3);

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
