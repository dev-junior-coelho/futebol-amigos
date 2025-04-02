export const sortTeams = (players) => {
    // Embaralhar jogadores
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
  
    // Separar jogadores por posição
    const groupedPlayers = {
      Zagueiro: shuffledPlayers.filter((p) => p.position === "Zagueiro"),
      Lateral: shuffledPlayers.filter((p) => p.position === "Lateral"),
      Meia: shuffledPlayers.filter((p) => p.position === "Meia"),
      Atacante: shuffledPlayers.filter((p) => p.position === "Atacante"),
    };
  
    // Criar times vazios
    const teams = { Time_Vermelho: [], Time_Azul: [], Time_Verde: [] };
    const teamKeys = Object.keys(teams);
  
    // Distribuir jogadores conforme a regra
    const positionsNeeded = { Zagueiro: 2, Lateral: 2, Meia: 4, Atacante: 2 };
  
    for (let pos in positionsNeeded) {
      for (let i = 0; i < positionsNeeded[pos] * teamKeys.length; i++) {
        const teamIndex = i % teamKeys.length;
        const player = groupedPlayers[pos].shift();
        if (player) teams[teamKeys[teamIndex]].push(player);
      }
    }
  
    return teams;
  };
  