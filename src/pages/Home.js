import React, { useState, useContext, useEffect, useMemo } from "react";
import { getPlayers, getAdimplentePlayers } from "../firebase/playerService";
import "../styles/components/home.css";
import { ChegadosContext } from "../contexts/ChegadosContext";
import PlayerCard from "../components/PlayerCard";
import LoadingSpinner from "../components/LoadingSpinner";

const Home = () => {
  const [showOnlyAdimplentes, setShowOnlyAdimplentes] = useState(false);
  const { chegados, adicionarChegado, removerChegado } = useContext(ChegadosContext);
  const [jogadores, setJogadores] = useState([]);
  const [textosBotoes, setTextosBotoes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = useMemo(() => {
    return jogadores.filter(player => 
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jogadores, searchTerm]);

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        setLoading(true);
        const players = showOnlyAdimplentes 
          ? await getAdimplentePlayers() 
          : await getPlayers();
        setJogadores(players);
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar jogadores:", err);
        setError("Não foi possível carregar a lista de jogadores.");
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();
  }, [showOnlyAdimplentes]);

  useEffect(() => {
    const novosTextos = {};
    chegados.forEach(chegado => {
      novosTextos[chegado.playerId] = "Aguardando Sorteio";
    });
    setTextosBotoes(novosTextos);
  }, [chegados]);

  const handleChegou = async (player) => {
    try {
      const jaChegou = chegados.some(chegado => chegado.playerId === player.id);
      
      // Atualiza o estado local imediatamente para feedback instantâneo
      if (jaChegou) {
        setTextosBotoes(prev => {
          const newTextos = { ...prev };
          delete newTextos[player.id];
          return newTextos;
        });
        
        // Depois faz a operação assíncrona
        removerChegado(player.id).catch(error => {
          // Em caso de erro, reverte a mudança de UI
          console.error("Erro ao remover chegado:", error);
          setTextosBotoes(prev => ({ ...prev, [player.id]: "Aguardando Sorteio" }));
        });
      } else {
        setTextosBotoes(prev => ({ ...prev, [player.id]: "Aguardando Sorteio" }));
        
        // Depois faz a operação assíncrona
        adicionarChegado(player).catch(error => {
          // Em caso de erro, reverte a mudança de UI
          console.error("Erro ao adicionar chegado:", error);
          setTextosBotoes(prev => {
            const newTextos = { ...prev };
            delete newTextos[player.id];
            return newTextos;
          });
        });
      }
    } catch (err) {
      console.error("Erro ao gerenciar chegada:", err);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) return <div className="error-message">{error}</div>;

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

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar jogador por nome ou posição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          aria-label="Buscar jogador"
        />
      </div>

      <div className="players-grid">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map((player) => (
            <PlayerCard 
              key={player.id} 
              player={player}
              onAction={handleChegou}
              buttonText={textosBotoes[player.id] || "Chegou"}
            />
          ))
        ) : (
          <p className="no-players">Nenhum jogador encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default Home;