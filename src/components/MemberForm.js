import React, { useState, useEffect } from "react";

const MemberForm = ({ member, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    position: "Meio-campo",
    peDominante: "Destro",
    idade: 0,
    assists: 0,
    statusPagamento: "Adimplente"
  });

  // Preencher o formulário se estiver editando um membro existente
  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || "",
        position: member.position || "Meio-campo",
        peDominante: member.peDominante || "Destro",
        idade: member.idade || 0,
        assists: member.assists || 0,
        statusPagamento: member.statusPagamento || "Adimplente"
      });
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseInt(value) || 0 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação mais robusta
    if (!formData.name.trim()) {
      alert("O nome é obrigatório");
      return;
    }
    
    // Garantir valores para todos os campos
    const validatedData = {
      ...formData,
      name: formData.name.trim(),
      position: formData.position || "Meio-campo",
      peDominante: formData.peDominante || "Destro",
      idade: formData.idade || 0,
      assists: formData.assists || 0,
      statusPagamento: formData.statusPagamento || "Adimplente"
    };
    
    onSubmit(validatedData);
  };

  return (
    <div className="member-form-container">
      <h2>{member ? "Editar Associado" : "Adicionar Novo Associado"}</h2>
      <form onSubmit={handleSubmit} className="member-form">
        <div className="form-group">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="position">Posição</label>
          <select
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
          >
            <option value="Goleiro">Goleiro</option>
            <option value="Zagueiro">Zagueiro</option>
            <option value="Lateral">Lateral</option>
            <option value="Meio-campo">Meio-campo</option>
            <option value="Atacante">Atacante</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="peDominante">Pé Dominante</label>
          <select
            id="peDominante"
            name="peDominante"
            value={formData.peDominante}
            onChange={handleChange}
          >
            <option value="Destro">Destro</option>
            <option value="Canhoto">Canhoto</option>
            <option value="Ambidestro">Ambidestro</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="idade">Idade</label>
          <input
            type="number"
            id="idade"
            name="idade"
            min="0"
            value={formData.idade}
            onChange={handleNumberChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="assists">Assistências</label>
          <input
            type="number"
            id="assists"
            name="assists"
            min="0"
            value={formData.assists}
            onChange={handleNumberChange}
          />
        </div>
        
        <div className="form-group" style={{display: 'none'}}>
          <label htmlFor="statusPagamento">Status de Pagamento</label>
          <select
            id="statusPagamento"
            name="statusPagamento"
            value={formData.statusPagamento}
            onChange={handleChange}
          >
            <option value="Adimplente">Adimplente</option>
            <option value="Inadimplente">Inadimplente</option>
          </select>
        </div>
        
        <div className="form-buttons">
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="submit-button">
            {member ? "Atualizar" : "Adicionar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;
