import React from 'react';
import Logo from '../assets/icons8-bow-tie.svg';

const Header = () => (
  <header className="flex items-center px-4 py-2 bg-white shadow-sm">
    <img src={Logo} alt="Samah Store Logo" width={32} height={32} className="mr-2" />
    <span className="text-lg font-semibold text-gray-900">Samah Store</span>
  </header>
);

export default Header;
