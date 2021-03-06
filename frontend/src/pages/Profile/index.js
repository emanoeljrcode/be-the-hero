import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi';

import api from '../../services/api';

import './styles.css';

import logoImg from '../../assets/logo.svg';

export default function Profile() {
  const [incidents, setIncidents] = useState([]);

  const history = useHistory();

  const ongId = localStorage.getItem('ongId');
  const ongName = localStorage.getItem('ongName');

  useEffect(() => {
    api
      .get('profile', {
        headers: {
          Authorization: ongId,
        },
      })
      .then((res) => {
        setIncidents(res.data);
      })
      .catch((err) => console.log(err));
  }, [ongId]);

  async function handleDeleteIncindent(id) {
    try {
      await api.delete(`incidents/${id}`, {
        headers: {
          Authorization: ongId,
        },
      });

      setIncidents(incidents.filter((i) => i.id !== id));
    } catch (err) {
      alert('Erro ao deletar caso. Tente novamente.');
    }
  }

  function handleLogout() {
    localStorage.clear();

    history.push('/');
  }

  return (
    <div className="profile-container">
      <header>
        <img src={logoImg} alt="Be The Hero" />
        <span>Bem Vindo, {ongName}</span>

        <Link className="button" to="/incidents/new">
          Cadastrar novo caso
        </Link>
        <button onClick={handleLogout}>
          <FiPower size={18} color="#e02041" />
        </button>
      </header>

      <h1>Casos cadastrados</h1>
      {incidents.length < 1 ? (
        <h1 className="centered">Você ainda não tem nenhum caso cadastrado.</h1>
      ) : (
        <ul>
          {incidents.map((i) => (
            <li key={i.id}>
              <strong>CASO:</strong>
              <p>{i.title}</p>

              <strong>DESCRIÇÃO:</strong>
              <p>{i.description}</p>

              <strong>VALOR:</strong>
              <p>
                {Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(i.value)}
              </p>

              <button onClick={() => handleDeleteIncindent(i.id)} type="button">
                <FiTrash2 size={20} color="#a8a8b3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
