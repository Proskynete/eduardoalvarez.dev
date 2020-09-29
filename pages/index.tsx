import { FC } from "react";
import Head from "next/head";
import useSWR from "swr";

const fetcher = async (url: string): Promise<string> => {
  const res = await fetch(url);
  const data = await res.json();

  if (res.status !== 200) throw new Error(data.message);

  return data;
};

const Home: FC = (props) => {
  console.log(props);
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
