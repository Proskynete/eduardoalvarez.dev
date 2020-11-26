import { PropsInterface } from 'models/layout.model';
import { useRouter } from 'next/router';
import { FC, lazy, useEffect, useRef, useState } from 'react';

const Footer = lazy(() => import('./Footer'));
const Meta = lazy(() => import('./Meta'));
const Nav = lazy(() => import('./Nav'));
const ProgressBarScrolling = lazy(() => import('./ProgressBarScrolling'));

const Layout: FC<PropsInterface> = (props) => {
	const { customTitle, description, image, slug, children } = props;
	const [path, setPath] = useState('');
	const target = useRef(null);
	const router = useRouter();

	useEffect(() => {
		setPath(router.pathname);
	}, [router.pathname]);

	return (
		<>
			<Meta
				customTitle={customTitle}
				description={description}
				image={image}
				slug={slug}
			/>
			<ProgressBarScrolling target={target} />
			<Nav path={path} />
			<main className='container-fluid' ref={target}>
				{children}
				<Footer />
			</main>
		</>
	);
};

export default Layout;
