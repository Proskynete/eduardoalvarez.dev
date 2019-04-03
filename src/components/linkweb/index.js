import React from 'react';

const LinkWeb = ({ link, title }) => (
    <a className="container__content__link" target="_blank" rel="noopener noreferrer" href={link}>{title}</a>
);

export default LinkWeb;
