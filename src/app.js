import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import Nav from './components/nav/';

import Home from './views/home/';
import WhoIAm from './views/whoiam/';
import Now from './views/now/';
import Blog from './views/blog/';

const App = () => (
    <BrowserRouter>
        <Nav />

        <Route path="/" exact component={Home} />
        <Route path="/quien-soy" component={WhoIAm} />
        <Route path="/now" component={Now} />
        <Route path="/blog" component={Blog} />
    </BrowserRouter>
);

export default App;
