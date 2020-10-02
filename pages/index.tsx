import { FC, memo } from "react";
import Layout from "components/Layout";
import { PropsInterface, ReturnInterface } from "models/index.model";

const Index: FC<PropsInterface> = (props) => {
  const { title, description, image, url } = props;

  return (
    <Layout
      customTitle={title}
      description={description}
      image={image}
      url={url}
    >
      <main>
        <h1>Welcome</h1>
      </main>
    </Layout>
  );
};

export default memo(Index);

export const getStaticProps = async (): Promise<ReturnInterface> => {
  const configData = await import("../data/config.json");

  return {
    props: {
      title: configData.title,
      description: configData.description,
      image: configData.image,
      url: configData.url,
    },
  };
};
