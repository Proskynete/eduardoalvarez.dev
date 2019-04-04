import React from 'react';
import { Link } from "react-router-dom";
import './index.scss';

const Nav = () => (
    <nav className="nav">
        <li className="nav__item">
            <Link className="nav__item__link" to="/">Home</Link>
        </li>
        <li className="nav__item">
            <Link className="nav__item__link" to="/quien-soy">Quien soy</Link>
        </li>
        <li className="nav__item">
            <Link className="nav__item__link" to="/now">Now</Link>
        </li>
        <li className="nav__item">
            <Link className="nav__item__link" to="/blog">Blog</Link>
        </li>
    </nav>
);

export default Nav;
