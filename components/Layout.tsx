import { PropsInterface } from 'models/layout.model';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';

import Footer from './Footer';
import Meta from './Meta';
import Nav from './Nav';

const Layout: FC<PropsInterface> = (props) => {
	const { customTitle, description, image, slug, children } = props;
	const [path, setPath] = useState('');
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
			<main className='container-fluid'>
				<Nav path={path} />
				{children}
				<Footer />
			</main>
		</>
	);
};

export default Layout;
