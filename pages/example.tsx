import { fetcher } from 'helpers/fetcher.helper';
import Head from 'next/head';
import useSWR from 'swr';

const Home = () => {
	const { data, error } = useSWR('/api/hello', (url) => fetcher<string>(url));

	if (error) return <p>Error in server</p>;
	if (!data) return <p>Cargando...</p>;

	return (
		<>
			<Head>
				<title>
					eduardoalvarez.dev - Un desarrollador ayudando a futurxs
					desarrolladores web
				</title>
				<link rel='icon' href='/favicon/favicon.ico' />
			</Head>

			<main>
				<h1>Welcome</h1>
			</main>
		</>
	);
};

export default Home;
