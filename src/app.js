import React, { Suspense, memo } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
} from 'react-router-dom';
import { Footer, Notifications } from '@Components';
import { changeMetadataValue } from '@Helpers/add_metadata.helper';
import { routes } from './routes';
import Nav from '@Components/nav';

const mainRoutes = routes.map((route) => (
	<Route
		key={route.name}
		path={route.path}
		exact={route.exact}
		component={(props) => <route.component {...props} />}
	/>
));

const App = () => (
	<>
		{changeMetadataValue({})}
		<Notifications />
		<Router basename='/'>
			<Nav />
			<Suspense fallback={''}>
				<Switch>
					{mainRoutes}
					<Redirect to='/' />
				</Switch>
			</Suspense>
		</Router>
		<Footer />
	</>
);

export default memo(App);
