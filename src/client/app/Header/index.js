import React from 'react';
import image from '../../assets/img/me.png';

const Header = () => {
  return (
    <div className="header">
      <img src={image} />
      <h1>Eduardo Alvarez Castañeda</h1>
    </div>
  );
};

export default Header;
