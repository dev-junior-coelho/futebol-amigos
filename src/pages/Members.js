import React, { useState, useEffect } from "react";
import { getPlayers, addPlayer, updatePlayer, deletePlayer } from "../firebase/playerService";
import LoadingSpinner from "../components/LoadingSpinner";
import MemberForm from "../components/MemberForm";
import "../styles/components/members.css";

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Buscar jogadores do Firestore ao carregar o componente
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const data = await getPlayers();
        setMembers(data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar membros:", err);
        setError("Não foi possível carregar a lista de membros.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Filtrar membros pelo termo de busca
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Adicionar novo membro
  const handleAddMember = async (memberData) => {
    try {
      setLoading(true);
      // Garantir que o objeto tenha todos os campos necessários
      const completeData = {
        ...memberData,
        // Adicionar campos padrão que podem estar faltando
        name: memberData.name,
        position: memberData.position || "Meio-campo",
        peDominante: memberData.peDominante || "Destro",
        idade: memberData.idade || 0,
        assists: memberData.assists || 0,
        statusPagamento: memberData.statusPagamento || "Adimplente"
      };
      
      const newMember = await addPlayer(completeData);
      setMembers([...members, newMember]);
      setShowForm(false);
    } catch (err) {
      console.error("Erro detalhado:", err);
      setError(`Erro ao adicionar membro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar membro existente
  const handleUpdateMember = async (memberData) => {
    try {
      setLoading(true);
      const updatedMember = await updatePlayer(currentMember.id, memberData);
      setMembers(
        members.map((member) =>
          member.id === currentMember.id ? updatedMember : member
        )
      );
      setShowForm(false);
      setCurrentMember(null);
    } catch (err) {
      setError("Erro ao atualizar membro.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Remover membro
  const handleDeleteMember = async (id) => {
    if (window.confirm("Tem certeza que deseja remover este associado?")) {
      try {
        setLoading(true);
        await deletePlayer(id);
        setMembers(members.filter((member) => member.id !== id));
      } catch (err) {
        setError("Erro ao remover membro.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Abrir formulário para edição
  const handleEditMember = (member) => {
    setCurrentMember(member);
    setShowForm(true);
  };

  if (loading && members.length === 0) return <LoadingSpinner />;

  return (
    <div className="members-container">
      <h1>Associados do Futebol Amigos</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="members-actions">
        <button 
          className="action-button add-button" 
          onClick={() => {
            setCurrentMember(null);
            setShowForm(true);
          }}
        >
          Adicionar Novo Associado
        </button>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por nome ou posição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      {showForm && (
        <MemberForm
          member={currentMember}
          onSubmit={currentMember ? handleUpdateMember : handleAddMember}
          onCancel={() => {
            setShowForm(false);
            setCurrentMember(null);
          }}
        />
      )}
      
      {!loading && filteredMembers.length === 0 && (
        <p className="no-players">Nenhum associado encontrado.</p>
      )}
      
      <div className="members-list">
        <table className="members-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Posição</th>
              <th>Pé Dominante</th>
              <th>Idade</th>
              <th>Assistências</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.position}</td>
                <td>{member.peDominante}</td>
                <td>{member.idade}</td>
                <td>{member.assists || 0}</td>
                <td className="action-cell">
                  <button
                    className="edit-button"
                    onClick={() => handleEditMember(member)}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteMember(member.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Members;
