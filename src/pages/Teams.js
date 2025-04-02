import React, { useState, useContext } from "react";
import { ChegadosContext } from "../contexts/ChegadosContext";
import PlayerCard from "../components/PlayerCard";
import "../styles/components/teams.css";

const Teams = () => {
  const { chegados } = useContext(ChegadosContext);
  const [times, setTimes] = useState({ timeA: [], timeB: [], timeC: [] });
  const [naoSorteados, setNaoSorteados] = useState([]);
  const [sorteioRealizado, setSorteioRealizado] = useState(false);
  const [mostrarNaoSorteados, setMostrarNaoSorteados] = useState(false);

  // Limites de jogadores por posição em cada time
  const limitesPosicao = {
    "Zagueiro": 2,
    "Lateral": 2,
    "Meio-campo": 4,
    "Atacante": 2,
    "Goleiro": 1
  };

  // Limite máximo de jogadores por time
  const LIMITE_JOGADORES_POR_TIME = 10;

  const realizarSorteio = () => {
    if (chegados.length < 3) {
      alert("É necessário pelo menos 3 jogadores para realizar o sorteio!");
      return;
    }

    // Embaralha todos os jogadores
    const jogadoresEmbaralhados = [...chegados].sort(() => Math.random() - 0.5);
    
    // Separar jogadores por posição
    const jogadoresPorPosicao = {
      "Zagueiro": [],
      "Lateral": [],
      "Meio-campo": [],
      "Atacante": [],
      "Goleiro": []
    };
    
    // Outras posições que não estejam nas categorias principais
    const outrosPosicoes = [];
    
    jogadoresEmbaralhados.forEach(jogador => {
      if (jogadoresPorPosicao[jogador.position]) {
        jogadoresPorPosicao[jogador.position].push(jogador);
      } else {
        outrosPosicoes.push(jogador);
      }
    });
    
    // Inicializa times vazios
    const timeA = [];
    const timeB = [];
    const timeC = [];
    const naoDistribuidos = [];
    
    // Contador de posições por time
    const contadorPosicoes = {
      timeA: { "Zagueiro": 0, "Lateral": 0, "Meio-campo": 0, "Atacante": 0, "Goleiro": 0 },
      timeB: { "Zagueiro": 0, "Lateral": 0, "Meio-campo": 0, "Atacante": 0, "Goleiro": 0 },
      timeC: { "Zagueiro": 0, "Lateral": 0, "Meio-campo": 0, "Atacante": 0, "Goleiro": 0 }
    };
    
    // Função para adicionar jogador ao time respeitando os limites
    const adicionarAoTime = (jogador, time, timeNome) => {
      const posicao = jogador.position;
      
      // Verifica se o time não excedeu o limite máximo de jogadores
      if (time.length >= LIMITE_JOGADORES_POR_TIME) {
        return false;
      }
      
      // Verifica se a posição está dentro dos limites ou se é uma posição não especificada
      if (!contadorPosicoes[timeNome][posicao] || 
          contadorPosicoes[timeNome][posicao] < limitesPosicao[posicao]) {
        time.push(jogador);
        if (contadorPosicoes[timeNome][posicao] !== undefined) {
          contadorPosicoes[timeNome][posicao]++;
        }
        return true;
      }
      return false;
    };
    
    // Função para distribuir jogadores por posição
    const distribuirPorPosicao = (jogadoresDaPosicao, posicao) => {
      // Embaralha jogadores da posição
      const embaralhados = [...jogadoresDaPosicao].sort(() => Math.random() - 0.5);
      
      // Distribui para os times na ordem
      for (const jogador of embaralhados) {
        // Tenta adicionar ao time com menos jogadores da posição
        const times = [
          { nome: 'timeA', time: timeA, contador: contadorPosicoes.timeA[posicao] || 0 },
          { nome: 'timeB', time: timeB, contador: contadorPosicoes.timeB[posicao] || 0 },
          { nome: 'timeC', time: timeC, contador: contadorPosicoes.timeC[posicao] || 0 }
        ];
        
        // Ordena times pelo número de jogadores da posição
        times.sort((a, b) => a.contador - b.contador);
        
        let adicionado = false;
        for (const { nome, time } of times) {
          if (adicionarAoTime(jogador, time, nome)) {
            adicionado = true;
            break;
          }
        }
        
        if (!adicionado) {
          naoDistribuidos.push({ ...jogador, motivo: `Limite de ${posicao}s atingido em todos os times` });
        }
      }
    };
    
    // Distribuir jogadores por posição
    Object.entries(jogadoresPorPosicao).forEach(([posicao, jogadores]) => {
      distribuirPorPosicao(jogadores, posicao);
    });
    
    // Distribuir jogadores de outras posições
    outrosPosicoes.forEach(jogador => {
      // Calcular tamanho de cada time
      const tamanhosTime = [
        { nome: 'timeA', tamanho: timeA.length, time: timeA },
        { nome: 'timeB', tamanho: timeB.length, time: timeB },
        { nome: 'timeC', tamanho: timeC.length, time: timeC }
      ];
      
      // Adicionar ao time com menos jogadores
      tamanhosTime.sort((a, b) => a.tamanho - b.tamanho);
      
      let adicionado = false;
      for (const { nome, time } of tamanhosTime) {
        if (time.length < LIMITE_JOGADORES_POR_TIME) {
          time.push(jogador);
          adicionado = true;
          break;
        }
      }
      
      if (!adicionado) {
        naoDistribuidos.push({ ...jogador, motivo: "Todos os times estão completos" });
      }
    });
    
    setTimes({ timeA, timeB, timeC });
    setNaoSorteados(naoDistribuidos);
    setSorteioRealizado(true);
    setMostrarNaoSorteados(naoDistribuidos.length > 0);
  };

  const completarTimes = () => {
    if (naoSorteados.length === 0) {
      return;
    }

    // Copiar os times atuais
    const novoTimeA = [...times.timeA];
    const novoTimeB = [...times.timeB];
    const novoTimeC = [...times.timeC];
    
    // Embaralhar jogadores não sorteados
    const jogadoresEmbaralhados = [...naoSorteados].sort(() => Math.random() - 0.5);
    const jogadoresRestantes = [];
    
    // Distribuir jogadores para completar os times
    for (const jogador of jogadoresEmbaralhados) {
      // Verificar qual time tem menos jogadores
      const timesSorted = [
        { nome: 'timeA', time: novoTimeA },
        { nome: 'timeB', time: novoTimeB },
        { nome: 'timeC', time: novoTimeC }
      ].sort((a, b) => a.time.length - b.time.length);
      
      let adicionado = false;
      for (const { time } of timesSorted) {
        if (time.length < LIMITE_JOGADORES_POR_TIME) {
          time.push(jogador);
          adicionado = true;
          break;
        }
      }
      
      if (!adicionado) {
        jogadoresRestantes.push(jogador);
      }
    }
    
    // Atualizar os times e jogadores não sorteados
    setTimes({ timeA: novoTimeA, timeB: novoTimeB, timeC: novoTimeC });
    setNaoSorteados(jogadoresRestantes);
    setMostrarNaoSorteados(jogadoresRestantes.length > 0);
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
              <p className="time-info">Jogadores: {times.timeA.length}/{LIMITE_JOGADORES_POR_TIME}</p>
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
              <p className="time-info">Jogadores: {times.timeB.length}/{LIMITE_JOGADORES_POR_TIME}</p>
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
              <p className="time-info">Jogadores: {times.timeC.length}/{LIMITE_JOGADORES_POR_TIME}</p>
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
            {naoSorteados.length > 0 && (
              <button 
                className="action-button completar-button"
                onClick={completarTimes}
              >
                Completar Times
              </button>
            )}
            {naoSorteados.length > 0 && (
              <button 
                className="action-button toggle-button"
                onClick={() => setMostrarNaoSorteados(!mostrarNaoSorteados)}
              >
                {mostrarNaoSorteados ? "Ocultar Não Sorteados" : "Mostrar Não Sorteados"}
              </button>
            )}
          </div>
          
          {/* Seção de jogadores não sorteados */}
          {mostrarNaoSorteados && naoSorteados.length > 0 && (
            <div className="nao-sorteados-container">
              <h2>Jogadores Não Sorteados ({naoSorteados.length})</h2>
              <div className="players-grid">
                {naoSorteados.map(player => (
                  <PlayerCard 
                    key={player.id} 
                    player={player}
                    buttonText="Não Sorteado"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Teams;