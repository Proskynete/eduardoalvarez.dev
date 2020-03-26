/* eslint-disable import/no-unresolved */
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from '@Views/home';
import WhoIAm from '@Views/whoiam';
import Blog from '@Views/blog';

import Nav from '@Components/nav';

const App = () => (
	<BrowserRouter>
		<Nav />
		<Route path="/" exact component={Home} />
		<Route path="/about" exact component={WhoIAm} />
		<Route path="/blog" exact component={Blog} />
	</BrowserRouter>
);

export default App;
