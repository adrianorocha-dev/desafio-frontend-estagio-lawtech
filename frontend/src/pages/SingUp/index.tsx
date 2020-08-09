import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import heroImg from '../../assets/HeroImg.svg';
import logoImg from '../../assets/Logo.svg';

import './styles.css';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const SingUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const auth = useAuth();

  const history = useHistory();

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== passwordConfirmation) {
      alert('As senhas não batem');
      return;
    }

    try {
      const response = await api.post('register', { email, password });
      const { token } = response.data;

      auth.setUser({ email, token });

      history.push('/');
    } catch (error) {
      alert('Erro ao cadastrar.');

      console.error(error);
    }
  }

  return (
    <div id="page-signup">
      <div id="page-signup-content" className="container">
        <img src={heroImg} alt="PDF Viewer" className="hero-img" />
        <img src={logoImg} alt="PDF Viewer Logo" className="logo-img" />

        <form className="signup-form" onSubmit={handleSignUp}>
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

          <input
            type="password"
            placeholder="Confirmar Senha"
            value={passwordConfirmation}
            onChange={event => setPasswordConfirmation(event.target.value)}
          />

          <button type="submit">Cadastrar</button>
        </form>

        <footer>
          <p>Já possui cadastro?</p>
          <Link to="/login">
            <FiArrowLeft />
            <span>Fazer login</span>
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default SingUp;
