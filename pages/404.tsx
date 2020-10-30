import Link from 'next/link';
import { useRouter } from 'next/router';

const Custom404 = () => {
	const router = useRouter();

	return (
		<>
			<section>
				<h1>Error 404</h1>
				<h2>Página no encontrada</h2>
				<p>
					Esto es incómodo, pero la ruta <code>{router.asPath}</code> en
					realidad no existe
				</p>
				<p>
					Volvamos a la
					<span>
						<Link href='/'>
							<a> página principal</a>
						</Link>
					</span>
				</p>
			</section>
			<style jsx>{`
				section {
					color: rgb(10, 63, 102);
					text-align: center;
					height: 100vh;
					width: 100vw;
					display: flex;
					flex-direction: column;
					justify-content: center;
				}
				h1 {
					font-size: 40px;
					font-weight: 500;
					margin-bottom: 10px;
				}
				h2 {
					font-size: 28px;
					margin-bottom: 20px;
				}
				p {
					margin-top: 20px;
					margin-bottom: 5px;
				}
				a {
					color: rgb(234, 82, 132);
					width: max-content;
					margin-left: auto;
					margin-right: auto;
					padding: 10px 20px 10px 0;
				}
				a:hover {
					color: rgb(76, 188, 196);
					text-decoration: none;
				}
			`}</style>
		</>
	);
};

export default Custom404;
