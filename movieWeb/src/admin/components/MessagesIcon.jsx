import React from "react";
import { FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MessagesIcon = () => {
  const navigate = useNavigate();

  return (
    <div className="icon-container" onClick={() => navigate("/admin/messages")}>
      <FaEnvelope className="icon" />
      <span className="badge">5</span>
    </div>
  );
};

export default MessagesIcon;