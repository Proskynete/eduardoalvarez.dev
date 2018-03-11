import React from 'react';
import image from '../../assets/img/me.png';

const Description = () => {
  return (
    <div className="description">
      <img src={image} className=""/>
      <h1 className="name">Eduardo Alvarez Castañeda</h1>
      <div className="information">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
        sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <div className="socials">
          <i className="fa fa-twitter-square"></i>
          <i className="fa fa-twitter-square"></i>
          <i className="fa fa-twitter-square"></i>
        </div>
      </div>
    </div>
  );
};

export default Description;
