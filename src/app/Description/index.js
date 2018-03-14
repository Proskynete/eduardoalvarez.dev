import React from 'react';
import image from '../../assets/img/me.png';
import './description.scss';

const Description = () => {
  return (
    <div className="description text-center">
      <div className="description__img">
        <img src={image} className="rounded-circle" />
      </div>
      <h1 className="description__logo text-center">EduardoAlvarez</h1>
      <hr />
      <div className="description__information">
        <p>
          <span>Holaaa!!</span> Mi nombre es <span>Eduardo Álvarez Castañeda</span>... Que genial el que hayas venido.
        </p>
        <p>
          Me gusta el <span>desarrollo web</span> en su amplio espectro, jugar <span>LOL</span> o algún partido de <span>fútbol</span>,
          y sobre todo, compartir con mis <span>amigos</span> los <span>fines de semana</span>.
        </p>

        <div className="description__socials">
          <a href="https://web.facebook.com/proskynete" target="_blank"><i className="fab fa-facebook-square"></i></a>
          <a href="https://twitter.com/proskynete" target="_blank"><i className="fab fa-twitter-square"></i></a>
          <a href="https://www.linkedin.com/in/proskynete/" target="_blank"><i className="fab fa-linkedin"></i></a>
          <a href="https://github.com/Proskynete" target="_blank"><i className="fab fa-github-square"></i></a>
          <a href="https://instagram.com/proskynete/" target="_blank"><i className="fab fa-instagram"></i></a>
          <a href="http://curriculum.eduardoalvarez.cl" target="_blank"><i className="far fa-file-alt"></i></a>
        </div>
      </div>
    </div>
  );
};

export default Description;
