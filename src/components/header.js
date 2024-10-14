import React from 'react';
import './header.css';
import wcoinImage from '../images/ico_wcoin_reverse.png';

const Header = () => (
  <header id="header" className="collect-header">
    <h1 className="collect-header__title">KOONIE <span className="color--yellow">COLLECTION</span></h1>
    <a href="//csd.cafe24.com/myHome_v3" target="_blank" className="collect-header__link--home" rel="noopener noreferrer">
      <img src={wcoinImage} alt="왕쿤홈" />
    </a>
    <button className="menu-trigger">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </header>
);

export default Header;