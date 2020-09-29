import Layout from "../components/Layout";
import { PropsInterface, ReturnInterface } from "../models/index.model";

const Index = (props: PropsInterface) => {
  const { title, description } = props;

  return (
    <Layout customTitle={title} description={description}>
      <main>
        <h1>BlogList</h1>
      </main>
    </Layout>
  );
};

export default Index;

export async function getStaticProps(): Promise<ReturnInterface> {
  const configData = await import("../data/config.json");

  return {
    props: {
      title: configData.title,
      description: configData.description,
    },
  };
}
