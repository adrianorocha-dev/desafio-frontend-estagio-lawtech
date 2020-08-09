import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';

import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

import heroImg from '../../assets/HeroImg.svg';
import logoImg from '../../assets/Logo.svg';

import './styles.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const auth = useAuth();

  const history = useHistory();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await api.post('authenticate', { email, password });
      console.log(response.status);

      const { token } = response.data;

      auth.setUser({ email, token });

      history.push('/');
    } catch (error) {
      alert('Erro ao fazer login.');

      console.error(error);
    }
  }

  return (
    <div id="page-login">
      <div id="page-login-content" className="container">
        <img src={heroImg} alt="PDF Viewer" className="hero-img" />
        <img src={logoImg} alt="PDF Viewer Logo" className="logo-img" />

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={event => setPassword(event.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        <footer>
          <p>Ainda não possui cadastro?</p>
          <Link to="/signup">
            <FiLogIn />
            <span>Cadastre-se</span>
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default Login;
