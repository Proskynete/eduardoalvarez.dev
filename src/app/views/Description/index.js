import React from 'react';
import Footer from '../../components/Footer/';
import config from '../../../config/config';
import randomText from '../../../helpers/random-text';

import image from '../../../assets/img/me.png';
import './index.scss';

const Description = () =>
  (<div className="description text-center">
    <h1 className="description__logo text-center">{config.description.logoName}</h1>
    <div className="description__img">
      <img src={image} className="rounded-circle" alt={config.description.name} />
    </div>

    <div className="description__socials">
      <a
        href={config.links.linkedin}
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fab fa-linkedin" />
      </a>
      <a
        href={config.links.github}
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fab fa-github-square" />
      </a>
      <a
        href={config.links.curriculum}
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="far fa-file-alt" />
      </a>
    </div>

    <hr />

    <div className="description__information">
      <p>{config.description.parragraph[0].text}</p>
      <p>
        {config.description.parragraph[1].text}
        {config.description.parragraph[2].text}
      </p>
      <p>{randomText(config.philosophies)}</p>
    </div>

    <Footer />
  </div>);

export default Description;
