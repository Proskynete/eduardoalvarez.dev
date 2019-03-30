import React from 'react';
import { Link } from "react-router-dom";
import './index.scss';

const Nav = () => (
    <nav className="nav">
        <li>
            <Link to="/">Home</Link>
        </li>
        <li>
            <Link to="/quien-soy/">Quien soy</Link>
        </li>
        <li>
            <Link to="/now/">Now</Link>
        </li>
        <li>
            <Link to="/blog/">Blog</Link>
        </li>
        <li>
            <Link to="/hablemos/">Hablemos</Link>
        </li>
    </nav>
);

export default Nav;
