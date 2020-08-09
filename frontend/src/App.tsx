import React from 'react';

import AuthContextWrapper from './context/AuthContext';
import Routes from './routes';

import './global.css';

const App: React.FC = () => {
  return (
    <AuthContextWrapper>
      <Routes />
    </AuthContextWrapper>
  );
};

export default App;
