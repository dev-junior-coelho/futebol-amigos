import React from 'react';
import '../styles/components/playerCard.css';
import defaultPlayerImage from '../assets/player.png';

const PlayerCard = ({ player, onAction, buttonText }) => {
  const { 
    id, 
    name, 
    position, 
    statusPagamento, 
    goals = 0, 
    assists = 0, 
    image = defaultPlayerImage 
  } = player;

  const isPaid = statusPagamento === "Adimplente";
  
  // Determina a classe do botão baseado no texto
  const getButtonClass = () => {
    if (buttonText === "Aguardando Sorteio") return "waiting";
    if (buttonText === "Time A") return "team-a";
    if (buttonText === "Time B") return "team-b";
    if (buttonText === "Time C") return "team-c";
    return "";
  };

  // Verifica se o botão deve estar desabilitado
  const isButtonDisabled = buttonText === "Aguardando Sorteio" || 
                          buttonText === "Time A" || 
                          buttonText === "Time B" ||
                          buttonText === "Time C";

  return (
    <div className="player-card">
      <div className="player-image-container">
        <img src={image} alt={name} className="player-image" />
        <div className={`player-status-badge ${isPaid ? 'status-paid' : 'status-unpaid'}`}>
          {isPaid ? '✓' : '✗'}
        </div>
      </div>
      
      <div className="player-info">
        <div>
          <h3 className="player-name">{name}</h3>
          <p className="player-position">{position}</p>
        </div>
        
        <div className="player-actions">
          <div className="player-stats">
            <span title="Gols">{goals} G</span>
            <span title="Assistências">{assists} A</span>
          </div>
          <button 
            className={`player-button ${getButtonClass()}`}
            onClick={() => onAction && onAction(player)}
            disabled={isButtonDisabled}
          >
            {buttonText || "Chegou"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
