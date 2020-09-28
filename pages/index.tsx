import { FC } from "react";
import Head from "next/head";

const Home: FC = () => {
  return (
    <div>
      <Head>
        <title>
          eduardoalvarez.dev - Un desarrollador ayudando a futurxs
          desarrolladores web
        </title>
        <link rel="icon" href="/favicon/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome</h1>
      </main>
    </div>
  );
};

export default Home;
