import React from 'react';
import './index.scss';

const Author = () => (
  <section className="author">
    <img
      className="author__image"
      src="http://curriculum.eduardoalvarez.cl/assets/images/me.jpg"
      alt="Eduardo Alvarez"
    />
    <article className="author__description">
      Hola!! Mi nombre es Eduardo Alvarez y soy un apacionado por las tecnologías web. JS Lover
      {' '}
      <i className="far fa-heart" />
    </article>
  </section>
);

export default Author;
