import { createContext, useContext, useState } from "react";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [playersOnField, setPlayersOnField] = useState([]);

  const addPlayerToField = (player) => {
    setPlayersOnField((prevPlayers) =>
      prevPlayers.some((p) => p.id === player.id) ? prevPlayers : [...prevPlayers, player]
    );
  };

  return (
    <PlayerContext.Provider value={{ playersOnField, addPlayerToField }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => useContext(PlayerContext);
