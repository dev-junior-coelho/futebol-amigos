import React from "react";

const MemberCard = ({ member }) => {
  return (
    <div className="member-card">
      <h3>{member.name}</h3>
      <p>Posição: {member.position}</p>
      <p>Status: {member.paymentStatus ? "✅ Adimplente" : "❌ Inadimplente"}</p>
    </div>
  );
};

export default MemberCard;
