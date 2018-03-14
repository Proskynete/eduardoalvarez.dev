import React from 'react';
import Footer from '../Footer/index.jsx';

import image from '../../assets/img/me.png';
import './description.scss';

const Description = () => {
  return (
    <div className="description text-center">
      <h1 className="description__logo text-center">EduardoAlvarez</h1>

      <div className="description__img">
        <img src={image} className="rounded-circle" />
      </div>

      <div className="description__socials">
        <a href="https://www.linkedin.com/in/proskynete/" target="_blank"><i className="fab fa-linkedin"></i></a>
        <a href="https://github.com/Proskynete" target="_blank"><i className="fab fa-github-square"></i></a>
        <a href="http://curriculum.eduardoalvarez.cl" target="_blank"><i className="far fa-file-alt"></i></a>
      </div>

      <hr />

      <div className="description__information">
        <p>
          <span>Holaaa!!</span> Mi nombre es <span>Eduardo Álvarez</span>... Que genial el que hayas venido.
        </p>
        <p>
          Me gusta el <span>desarrollo web</span> en su amplio espectro, jugar <span>LOL</span> o algún partido de <span>fútbol</span>,
          pero sobre todo, compartir una <span>cerveza</span> con mis <span>amigos</span> los <span>fines de semana</span>.
        </p>
        <p>
          <span>Si no</span> estás dispuesto <span>a darlo todo</span>, no tienes <span>derecho a intentarlo</span>.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default Description;
