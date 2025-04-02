import React, { useState, useContext, useEffect } from "react";
import { ChegadosContext } from "../contexts/ChegadosContext";
import PlayerCard from "../components/PlayerCard";
import "../styles/components/teams.css";

const Teams = () => {
  const { chegados } = useContext(ChegadosContext);
  const [times, setTimes] = useState({ timeA: [], timeB: [], timeC: [] });
  const [sorteioRealizado, setSorteioRealizado] = useState(false);

  const realizarSorteio = () => {
    if (chegados.length < 3) {
      alert("É necessário pelo menos 3 jogadores para realizar o sorteio!");
      return;
    }

    // Cria uma cópia para não modificar o original
    const jogadoresEmbaralhados = [...chegados].sort(() => Math.random() - 0.5);
    
    // Divide em três times
    const tamanhoTime = Math.ceil(jogadoresEmbaralhados.length / 3);
    const timeA = jogadoresEmbaralhados.slice(0, tamanhoTime);
    const timeB = jogadoresEmbaralhados.slice(tamanhoTime, tamanhoTime * 2);
    const timeC = jogadoresEmbaralhados.slice(tamanhoTime * 2);
    
    setTimes({ timeA, timeB, timeC });
    setSorteioRealizado(true);
  };

  return (
    <div className="teams-container">
      <h1>Sorteio de Times</h1>
      
      {!sorteioRealizado ? (
        <div className="pre-sorteio">
          <h2>Jogadores Disponíveis: {chegados.length}</h2>
          
          <div className="buttons-container">
            <button 
              className="action-button sorteio-button" 
              onClick={realizarSorteio}
              disabled={chegados.length < 3}
            >
              Realizar Sorteio
            </button>
          </div>
          
          <div className="players-grid">
            {chegados.map(player => (
              <PlayerCard 
                key={player.id} 
                player={player}
                buttonText="Aguardando Sorteio"
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="pos-sorteio">
          <div className="times-container">
            <div className="time">
              <h2 className="time-titulo">Time A</h2>
              <div className="players-grid">
                {times.timeA.map(player => (
                  <PlayerCard 
                    key={player.id} 
                    player={player}
                    buttonText="Time A"
                  />
                ))}
              </div>
            </div>
            
            <div className="time">
              <h2 className="time-titulo">Time B</h2>
              <div className="players-grid">
                {times.timeB.map(player => (
                  <PlayerCard 
                    key={player.id} 
                    player={player}
                    buttonText="Time B"
                  />
                ))}
              </div>
            </div>

            <div className="time">
              <h2 className="time-titulo">Time C</h2>
              <div className="players-grid">
                {times.timeC.map(player => (
                  <PlayerCard 
                    key={player.id} 
                    player={player}
                    buttonText="Time C"
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="buttons-container">
            <button 
              className="action-button novo-sorteio-button"
              onClick={() => setSorteioRealizado(false)}
            >
              Voltar
            </button>
            <button 
              className="action-button novo-sorteio-button"
              onClick={realizarSorteio}
            >
              Novo Sorteio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;