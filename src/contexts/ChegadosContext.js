import React, { createContext, useState, useEffect } from 'react';
import { getChegados, addChegado as addChegadoService, removeChegado as removeChegadoService } from '../firebase/chegadosService';

export const ChegadosContext = createContext();

export const ChegadosProvider = ({ children }) => {
  const [chegados, setChegados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar jogadores chegados ao iniciar
  useEffect(() => {
    const loadChegados = async () => {
      try {
        setLoading(true);
        const chegadosData = await getChegados();
        setChegados(chegadosData);
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar chegados:", err);
        setError("Não foi possível carregar a lista de jogadores chegados.");
      } finally {
        setLoading(false);
      }
    };

    loadChegados();
  }, []);

  // Adicionar jogador à lista de chegados
  const adicionarChegado = async (player) => {
    try {
      // Verificar se o jogador já está na lista
      if (chegados.some(chegado => chegado.playerId === player.id)) {
        return;
      }
      
      // Adicionar ao Firestore
      const novoChegado = await addChegadoService(player);
      
      // Atualizar estado local
      setChegados(prevChegados => [...prevChegados, novoChegado]);
      
      return novoChegado;
    } catch (err) {
      console.error("Erro ao adicionar chegado:", err);
      setError("Erro ao registrar chegada do jogador.");
      throw err;
    }
  };

  // Remover jogador da lista de chegados
  const removerChegado = async (playerId) => {
    try {
      console.log(`Removendo chegado no contexto, ID: ${playerId}`);
      
      // Atualizar estado local imediatamente para feedback instantâneo
      setChegados(prevChegados => prevChegados.filter(chegado => chegado.playerId !== playerId));
      
      // Remover do Firestore
      await removeChegadoService(playerId);
      console.log(`Chegado removido com sucesso do Firestore: ${playerId}`);
      
      return playerId;
    } catch (err) {
      console.error("Erro detalhado ao remover chegado:", err);
      
      // Restaurar estado em caso de erro
      const fetchChegados = async () => {
        const chegadosData = await getChegados();
        setChegados(chegadosData);
      };
      fetchChegados().catch(e => console.error("Erro ao recarregar chegados:", e));
      
      setError("Erro ao remover jogador da lista de chegados.");
      throw err;
    }
  };

  return (
    <ChegadosContext.Provider value={{ 
      chegados, 
      adicionarChegado, 
      removerChegado, 
      loading,
      error 
    }}>
      {children}
    </ChegadosContext.Provider>
  );
};