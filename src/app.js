import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Footer } from '@Components';
import { HomeView, AboutMeView, BlogView, ArticleView } from '@Views/';
import { changeMetadataValue } from '@Helpers/add_metadata.helper';
import Nav from '@Components/nav';

const App = () => (
	<>
		{changeMetadataValue({})}
		<Router>
			<Nav />
			<Switch>
				<Route path="/" exact component={HomeView} />
				<Route path="/about_me" exact component={AboutMeView} />
				<Route path="/blog/" exact component={BlogView} />
				<Route path="/blog/:slug" component={ArticleView} />
			</Switch>
			<Footer />
		</Router>
	</>
);

export default App;
