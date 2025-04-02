import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PlayerProvider } from "./contexts/PlayerContext";

// Importações de CSS - ordem importa!
import './styles/global.css'; // Primeiro o CSS global
import './index.css'; // Depois o CSS do index
// Depois os componentes específicos
import './styles/components/general.css'; // Novo arquivo com estilos gerais
import './styles/components/navbar.css';
import './styles/components/darkModeToggle.css';
import './styles/components/home.css';
import './styles/components/teams.css';
import './styles/components/teamCard.css';
import './styles/components/playerCard.css';
import './styles/components/loadingSpinner.css';
import './styles/components/members.css'; // Adicionar esta linha

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <PlayerProvider>
    <App />
  </PlayerProvider>
);
