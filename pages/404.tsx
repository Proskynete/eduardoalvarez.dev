import Layout from 'components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Custom404 = () => {
	const { asPath } = useRouter();

	return (
		<Layout customTitle='404' image='/images/404/error.png' footer={false}>
			<div className='not-found'>
				<div className='not-found__inner'>
					<div className='not-found__inner__container'>
						<div className='not-found__inner__container__text'>
							<h1 className='not-found__inner__container__text__title'>404</h1>
							<p className='not-found__inner__container__text__description'>
								No encontré nada en la ruta <code>{asPath}</code>. Y si mejor
								volvemos al{' '}
								<Link href='/'>
									<a className='not-found__inner__container__text__description__link'>
										inicio
									</a>
								</Link>
								?
							</p>
						</div>
					</div>
					<div className='not-found__inner__container'>
						<div className='not-found__inner__container__image'>
							<img src='/images/404/error.png' alt='Error' />
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default Custom404;
