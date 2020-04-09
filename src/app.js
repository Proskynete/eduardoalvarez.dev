/* eslint-disable import/no-unresolved */
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Footer } from '@Components';
import { Home, WhoIAm, Blog, ArticleView } from '@Views/';

import Nav from '@Components/nav';

const App = () => (
	<Router forceRefresh={true}>
		<Nav />
		<Switch>
			<Route path="/" exact component={Home} />
			<Route path="/about" exact component={WhoIAm} />
			<Route path="/blog" exact component={Blog} />
			<Route path="/blog/:slug" component={ArticleView} />
		</Switch>
		<Footer />
	</Router>
);

export default App;
