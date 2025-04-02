import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PlayerProvider } from "./contexts/PlayerContext";

// Importações de CSS - ordem importa!
import './styles/global.css'; // Primeiro o CSS global
import './index.css'; // Depois o CSS do index
// Depois os componentes específicos
import './styles/components/navbar.css';
import './styles/components/darkModeToggle.css'; // Adicionar importação do toggle de modo escuro
import './styles/components/home.css';
import './styles/components/teams.css'; // Adicionar importação do CSS de times
import './styles/components/teamCard.css';
import './styles/components/playerCard.css'; // Adicionar importação do playerCard.css

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <PlayerProvider>
    <App />
  </PlayerProvider>
);
