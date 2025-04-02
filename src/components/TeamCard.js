import React from "react";
import "../styles/components/teamCard.css";
import playerImage from "../assets/player.png";

const TeamCard = ({ player }) => { // Remove onPlayerArrival
  return (
    <div className={`team-card ${player.statusPagamento === "Adimplente" ? "paid" : "unpaid"}`}>
      <img src={playerImage} alt="Jogador" className="player-icon" />
      <h3>{player.name}</h3>
      <p className="position">{player.position}</p>
      <p className="status">
        {player.statusPagamento === "Adimplente" ? "✅ Adimplente" : "❌ Inadimplente"}
      </p>
    </div>
  );
};

export default TeamCard;