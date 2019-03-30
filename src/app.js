import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import Nav from './components/nav/';

const App = () => (
    <BrowserRouter>
        <Nav />

        <Route path="/" exact component={Home} />
        <Route path="/quien-soy/" component={WhoIAm} />
        <Route path="/now/" component={Now} />
        <Route path="/blog/" component={Blog} />
        <Route path="/hablemos/" component={LetsTalk} />
    </BrowserRouter>
);

export default App;
