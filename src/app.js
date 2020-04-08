/* eslint-disable import/no-unresolved */
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from '@Views/home';
import WhoIAm from '@Views/whoiam';
import Blog from '@Views/blog';
import Article from '@Views/article';

import Nav from '@Components/nav';

const App = () => (
	<Router>
		<Nav />
		<Switch>
			<Route path="/" exact component={Home} />
			<Route path="/about" exact component={WhoIAm} />
			<Route path="/blog" exact component={Blog} />
			<Route path="/blog/:slug" component={Article} />
		</Switch>
	</Router>
);

export default App;
