import React, { useState, useContext } from "react";
import mockPlayers from "../utils/mockPlayers";
import "../styles/components/home.css";
import { ChegadosContext } from "../contexts/ChegadosContext";
import PlayerCard from "../components/PlayerCard";

const Home = () => {
  const [showOnlyAdimplentes, setShowOnlyAdimplentes] = useState(false);
  const { adicionarChegado } = useContext(ChegadosContext);
  const [jogadores, setJogadores] = useState(mockPlayers);
  const [textosBotoes, setTextosBotoes] = useState({});

  const filteredPlayers = showOnlyAdimplentes
    ? jogadores.filter((player) => player.statusPagamento === "Adimplente")
    : jogadores;

  const handleChegou = (player) => {
    adicionarChegado(player);
    setTextosBotoes({ ...textosBotoes, [player.id]: "Aguardando Sorteio" });
  };

  return (
    <div className="home-container">
      <h1>Associados da Associação de Futebol</h1>

      <div className="buttons-container">
        <button 
          className={`filter-button ${showOnlyAdimplentes ? 'filter-button-green' : 'filter-button-blue'}`} 
          onClick={() => setShowOnlyAdimplentes(!showOnlyAdimplentes)}
        >
          {showOnlyAdimplentes ? "Mostrar Todos" : "Mostrar Adimplentes"}
        </button>
      </div>

      <div className="players-grid">
        {filteredPlayers.map((player) => (
          <PlayerCard 
            key={player.id} 
            player={player}
            onAction={handleChegou}
            buttonText={textosBotoes[player.id] || "Chegou"}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;