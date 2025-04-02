import React, { useState, useEffect, useRef } from 'react';
import '../styles/components/playerCard.css';
import defaultPlayerImage from '../assets/player.png';

const PlayerCard = ({ player, onAction, buttonText }) => {
  const [localButtonText, setLocalButtonText] = useState(buttonText);
  const [isRemoving, setIsRemoving] = useState(false);
  const cardRef = useRef(null);
  
  useEffect(() => {
    setLocalButtonText(buttonText);
  }, [buttonText]);

  if (!player) {
    return <div className="player-card loading">Carregando...</div>;
  }

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
  
  const getButtonClass = () => {
    const text = localButtonText || buttonText;
    if (text === "Aguardando Sorteio") return "player-button aguardando";
    if (text === "Time A") return "player-button team-a";
    if (text === "Time B") return "player-button team-b";
    if (text === "Time C") return "player-button team-c";
    return "player-button";
  };

  const isButtonDisabled = (localButtonText || buttonText) === "Time A" || 
                          (localButtonText || buttonText) === "Time B" ||
                          (localButtonText || buttonText) === "Time C";

  const handleButtonClick = () => {
    if (onAction && !isButtonDisabled) {
      // Feedback visual do botão
      const button = document.activeElement;
      button.classList.add('button-clicked');
      
      // Se o botão é "Aguardando Sorteio" e estamos na tela de sorteio, iniciar animação de remoção
      if ((localButtonText || buttonText) === "Aguardando Sorteio" && window.location.pathname.includes("teams")) {
        setIsRemoving(true);
        
        // Aguardar a animação terminar antes de remover
        setTimeout(() => {
          setLocalButtonText("Chegou");
          // Remover a classe depois da animação
          setTimeout(() => {
            onAction(player);
          }, 50);
        }, 450); // Um pouco menos que a duração da animação
      } else {
        // Comportamento normal
        const newText = (localButtonText || buttonText) === "Aguardando Sorteio" ? "Chegou" : "Aguardando Sorteio";
        setLocalButtonText(newText);
        
        // Remover a classe depois de um tempo
        setTimeout(() => {
          button.classList.remove('button-clicked');
          onAction(player);
        }, 150);
      }
    }
  };

  return (
    <div 
      ref={cardRef}
      className={`player-card ${isRemoving ? 'removing' : ''}`}
    >
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
            className={getButtonClass()}
            onClick={handleButtonClick}
            disabled={isButtonDisabled}
            aria-label={localButtonText ? `${localButtonText} para ${player.name}` : `Marcar ${player.name} como presente`}
          >
            {localButtonText || "Chegou"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
