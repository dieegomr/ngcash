import React from 'react';

import img from '../../images/homePhone.png';
import style from './Home.module.css';

function Home() {
  return (
    <section className={style.home_container}>
      <div className={style.column}>
        <h1>
          BEM-VINDO À <span>NG.CASH</span>
        </h1>
        <h2>Somos a carteira digital da Nova Geração</h2>
        <p>Viemos te ajudar a construir a sua independência financeira.</p>
        <p>
          Vivemos o novo, transformando o futuro. Afinal, depois do ponto, vem
          um novo começo.
        </p>
      </div>
      <div className={style.column}>
        <img src={img} alt="Ng Cash mobile app"></img>
      </div>
    </section>
  );
}

export default Home;
