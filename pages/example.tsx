import { fetcher } from "helpers/fetcher.helper";
import Head from "next/head";
import { FC } from "react";
import useSWR from "swr";

const Home: FC = () => {
  const { data, error } = useSWR("/api/hello", fetcher);

  if (error) return <p>Error in server</p>;
  if (!data) return <p>Cargando...</p>;

  return (
    <>
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
    </>
  );
};

export default Home;
