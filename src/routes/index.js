import { lazy } from 'react';

const HomeView = lazy(() => import('../views/home'));
const AboutMeView = lazy(() => import('../views/about_me'));
const BlogView = lazy(() => import('../views/blog'));
const ArticleView = lazy(() => import('../views/article'));

export const routes = [
	{
		path: '/',
		name: 'Home',
		exact: true,
		component: HomeView,
	},
	{
		path: '/sobre_mi',
		name: 'Sobre mi',
		exact: true,
		component: AboutMeView,
	},
	{
		path: '/blog',
		name: 'Blog',
		exact: true,
		component: BlogView,
	},
	{
		path: '/blog/:slug',
		name: 'Artículo',
		exact: false,
		component: ArticleView,
	},
];
