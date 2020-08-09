import React from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

import logoImg from '../../assets/Logo.svg';

import './styles.css';

type Props = {
  menuButton?: React.ReactNode;
};

const Header: React.FC<Props> = ({ menuButton }) => {
  const history = useHistory();

  const auth = useAuth();

  function handleSignOut() {
    auth.setUser(undefined);
    history.push('/login');
  }

  return (
    <header className="page-header">
      <div className="logo-container">
        {menuButton}

        <Link to="/" className="logo-link">
          <img src={logoImg} alt="PDF Viewer" className="logo-img" />
        </Link>
      </div>

      <button className="button-signout" onClick={handleSignOut}>
        Sair
      </button>
    </header>
  );
};

export default Header;
