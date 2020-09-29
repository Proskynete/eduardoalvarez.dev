const Index = (props) => {
  return (
    <Layout
      pathname="/"
      siteTitle={props.title}
      siteDescription={props.description}
    >
      <main>
        <h1>BlogList</h1>
      </main>
    </Layout>
  );
};

export default Index;

export async function getStaticProps() {
  const configData = await import("../data/config.json");

  return {
    props: {
      title: configData.title,
      description: configData.description,
    },
  };
}
