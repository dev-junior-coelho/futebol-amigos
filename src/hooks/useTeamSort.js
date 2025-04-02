import { useState } from "react";
import { sortTeams } from "../utils/sortTeams";
import mockPlayers from "../utils/mockPlayers";

const useTeamSort = () => {
  const [teams, setTeams] = useState(null);

  const handleSortTeams = () => {
    setTeams(sortTeams(mockPlayers));
  };

  return { teams, handleSortTeams };
};

export default useTeamSort;