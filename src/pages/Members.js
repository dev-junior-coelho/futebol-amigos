import React, { useState } from "react";
import MemberCard from "../components/MemberCard";
//import "../styles/Members.css";


function Members() {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({ name: "", position: "Zagueiro", paymentStatus: false });

  const addMember = () => {
    setMembers([...members, { ...newMember, id: Date.now() }]);
    setNewMember({ name: "", position: "Zagueiro", paymentStatus: false });
  };

  return (
    <div>
      <h2>Cadastro de Associados</h2>
      <input type="text" placeholder="Nome" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} />
      <select value={newMember.position} onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}>
        <option>Zagueiro</option>
        <option>Lateral</option>
        <option>Meia</option>
        <option>Atacante</option>
      </select>
      <button onClick={addMember}>Adicionar</button>

      <h3>Lista de Associados</h3>
      {members.map((member) => <MemberCard key={member.id} member={member} />)}
    </div>
  );
}

export default Members;
