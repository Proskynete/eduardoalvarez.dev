import { PropsInterface } from 'models/layout.model';
import { useRouter } from 'next/router';
import { FC, useEffect, useRef, useState } from 'react';

import Footer from './Footer';
import Meta from './Meta';
import Nav from './Nav';
import ProgressBarScrolling from './ProgressBarScrolling';

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
