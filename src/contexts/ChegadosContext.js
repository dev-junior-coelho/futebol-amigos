import React, { createContext, useState } from 'react';

export const ChegadosContext = createContext();

export const ChegadosProvider = ({ children }) => {
  const [chegados, setChegados] = useState([]);

  const adicionarChegado = (player) => {
    // Verifica se o jogador já foi adicionado
    if (!chegados.some(chegado => chegado.id === player.id)) {
      setChegados([...chegados, player]);
    }
  };

  const removerChegado = (playerId) => {
    setChegados(chegados.filter(chegado => chegado.id !== playerId));
  };

  return (
    <ChegadosContext.Provider value={{ chegados, adicionarChegado, removerChegado }}>
      {children}
    </ChegadosContext.Provider>
  );
};