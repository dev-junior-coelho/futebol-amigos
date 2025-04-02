import React, { useState, useEffect, useCallback, useContext } from "react";
import { ChegadosContext } from "../contexts/ChegadosContext";
import PlayerCard from "../components/PlayerCard";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/components/teams.css";

const Teams = () => {
  const { chegados, removerChegado, loading, error } = useContext(ChegadosContext);
  const [jogadoresDisponiveis, setJogadoresDisponiveis] = useState([]);
  const [times, setTimes] = useState({ timeA: [], timeB: [], timeC: [] });
  const [naoSorteados, setNaoSorteados] = useState([]);
  const [sorteioRealizado, setSorteioRealizado] = useState(false);
  const [mostrarNaoSorteados, setMostrarNaoSorteados] = useState(false);
  const [estatisticas, setEstatisticas] = useState(null);

  // Limites de jogadores por posição em cada time
  const limitesPosicao = {
    "Goleiro": 1,
    "Zagueiro": 2,
    "Lateral": 2,
    "Meio-campo": 4,
    "Atacante": 2
  };

  // Limite máximo de jogadores por time
  const LIMITE_JOGADORES_POR_TIME = 10;

  // Inicializa a lista de jogadores disponíveis quando os chegados mudam
  useEffect(() => {
    setJogadoresDisponiveis(chegados);
  }, [chegados]);

  // Função para remover jogador da lista de jogadores disponíveis para sorteio
  const handleRemoverJogador = async (player) => {
    try {
      // Delay para permitir a animação de remoção na UI
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Atualizar estado local
      setJogadoresDisponiveis(prev => 
        prev.filter(jogador => jogador.playerId !== player.id)
      );
      
      // Remover do Firebase
      await removerChegado(player.id);
    } catch (error) {
      console.error("Erro ao remover jogador:", error);
      setJogadoresDisponiveis(chegados);
    }
  };

  const contarPosicoes = (time) => {
    return time.reduce((acc, jogador) => {
      acc[jogador.position] = (acc[jogador.position] || 0) + 1;
      return acc;
    }, {});
  };

  const realizarSorteio = () => {
    if (jogadoresDisponiveis.length < 3) {
      alert("É necessário pelo menos 3 jogadores para realizar o sorteio!");
      return;
    }

    // Embaralha todos os jogadores
    const jogadoresEmbaralhados = [...jogadoresDisponiveis].sort(() => Math.random() - 0.5);
    
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
      if (jogadoresPorPosicao[jogador.playerPosition]) {
        jogadoresPorPosicao[jogador.playerPosition].push(jogador);
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
      const posicao = jogador.playerPosition;
      
      // Verifica se o time não excedeu o limite máximo de jogadores
      if (time.length >= LIMITE_JOGADORES_POR_TIME) {
        return false;
      }
      
      // Verifica se a posição está dentro dos limites ou se é uma posição não especificada
      if (!contadorPosicoes[timeNome][posicao] || 
          contadorPosicoes[timeNome][posicao] < (limitesPosicao[posicao] || 2)) {
        time.push(jogador);
        if (contadorPosicoes[timeNome][posicao] !== undefined) {
          contadorPosicoes[timeNome][posicao]++;
        }
        return true;
      }
      return false;
    };
    
    // Distribuir jogadores por posição para cada time
    Object.entries(jogadoresPorPosicao).forEach(([posicao, jogadores]) => {
      if (jogadores.length === 0) return;
      
      // Embaralha jogadores da posição
      const embaralhados = [...jogadores].sort(() => Math.random() - 0.5);
      
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
          naoDistribuidos.push(jogador);
        }
      }
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
        naoDistribuidos.push(jogador);
      }
    });
    
    setTimes({ timeA, timeB, timeC });
    setNaoSorteados(naoDistribuidos);
    setSorteioRealizado(true);
    setMostrarNaoSorteados(naoDistribuidos.length > 0);
  };

  // Efeito para calcular estatísticas quando os times mudam
  useEffect(() => {
    if (sorteioRealizado) {
      const stats = {
        timeA: {
          jogadores: times.timeA.length,
          posicoes: contarPosicoes(times.timeA)
        },
        timeB: {
          jogadores: times.timeB.length,
          posicoes: contarPosicoes(times.timeB)
        },
        timeC: {
          jogadores: times.timeC.length,
          posicoes: contarPosicoes(times.timeC)
        }
      };
      setEstatisticas(stats);
    }
  }, [sorteioRealizado, times]);

  const compartilharTimes = () => {
    const mensagem = `Times de hoje:\n\nTime A: ${times.timeA.map(p => p.playerName).join(', ')}\n\nTime B: ${times.timeB.map(p => p.playerName).join(', ')}\n\nTime C: ${times.timeC.map(p => p.playerName).join(', ')}`;
    
    // Tentar usar a API de compartilhamento nativa
    if (navigator.share) {
      navigator.share({
        title: 'Times de Futebol',
        text: mensagem
      }).catch(err => console.error('Erro ao compartilhar:', err));
    } else {
      // Fallback: copiar para área de transferência
      navigator.clipboard.writeText(mensagem)
        .then(() => alert('Times copiados para a área de transferência!'))
        .catch(err => console.error('Erro ao copiar:', err));
    }
  };

  if (loading) return <LoadingSpinner />;
  
  if (error) return <div className="error-message">{error}</div>;

  if (jogadoresDisponiveis.length === 0) {
    return (
      <div className="teams-container">
        <h1>Sorteio de Times</h1>
        <p className="no-players">Nenhum jogador registrou presença ainda. Vá para a tela inicial para registrar jogadores.</p>
      </div>
    );
  }

  return (
    <div className="teams-container">
      <h1>Sorteio de Times</h1>
      
      {!sorteioRealizado ? (
        <div className="pre-sorteio">
          <h2>Jogadores Disponíveis: {jogadoresDisponiveis.length}</h2>
          
          <div className="buttons-container">
            <button 
              className="action-button sorteio-button" 
              onClick={realizarSorteio}
              disabled={jogadoresDisponiveis.length < 3}
            >
              Realizar Sorteio
            </button>
          </div>
          
          <div className="players-grid">
            {jogadoresDisponiveis.map(player => (
              <PlayerCard 
                key={player.playerId} 
                player={{
                  id: player.playerId,
                  name: player.playerName,
                  position: player.playerPosition,
                  statusPagamento: "Adimplente"
                }}
                buttonText="Aguardando Sorteio"
                onAction={() => handleRemoverJogador({
                  id: player.playerId,
                  name: player.playerName
                })}
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
                    key={player.playerId} 
                    player={{
                      id: player.playerId,
                      name: player.playerName,
                      position: player.playerPosition,
                      statusPagamento: "Adimplente"
                    }}
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
                    key={player.playerId} 
                    player={{
                      id: player.playerId,
                      name: player.playerName,
                      position: player.playerPosition,
                      statusPagamento: "Adimplente"
                    }}
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
                    key={player.playerId} 
                    player={{
                      id: player.playerId,
                      name: player.playerName,
                      position: player.playerPosition,
                      statusPagamento: "Adimplente"
                    }}
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
                className="action-button toggle-button"
                onClick={() => setMostrarNaoSorteados(!mostrarNaoSorteados)}
              >
                {mostrarNaoSorteados ? "Ocultar Não Sorteados" : "Mostrar Não Sorteados"}
              </button>
            )}
            <button 
              className="action-button share-button"
              onClick={compartilharTimes}
            >
              Compartilhar Times
            </button>
          </div>
          
          {/* Seção de jogadores não sorteados */}
          {mostrarNaoSorteados && naoSorteados.length > 0 && (
            <div className="nao-sorteados-container">
              <h2>Jogadores Não Sorteados ({naoSorteados.length})</h2>
              <div className="players-grid">
                {naoSorteados.map(player => (
                  <PlayerCard 
                    key={player.playerId} 
                    player={{
                      id: player.playerId,
                      name: player.playerName,
                      position: player.playerPosition,
                      statusPagamento: "Adimplente"
                    }}
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