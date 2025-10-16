import React from "react";
import "../styles/FallbackTank.css";

const FallbackTank = () => (
  <div className="fallback-tank-bg">
    <div className="dinh-doc-lap"></div>
    <div className="tank-animation">
      {/* Xe tăng SVG */}
      <svg width="220" height="90" viewBox="0 0 220 90">
        {/* Thân xe tăng */}
        <rect x="40" y="50" width="120" height="30" rx="10" fill="#388e3c" stroke="#222" strokeWidth="2"/>
        {/* Nòng súng */}
        <rect x="160" y="60" width="50" height="8" rx="3" fill="#444" />
        {/* Bánh xe */}
        <circle cx="60" cy="85" r="10" fill="#222" />
        <circle cx="100" cy="85" r="10" fill="#222" />
        <circle cx="140" cy="85" r="10" fill="#222" />
        {/* Cabin */}
        <ellipse cx="80" cy="55" rx="18" ry="12" fill="#4caf50" stroke="#222" strokeWidth="2"/>
        {/* Lá cờ Việt Nam */}
        <g>
          <rect x="45" y="30" width="32" height="18" fill="#d32f2f" stroke="#b71c1c" strokeWidth="1"/>
          {/* Sao vàng */}
          <polygon
            points="61,33 63,40 70,40 64,44 66,51 61,47 56,51 58,44 52,40 59,40"
            fill="#ffd600"
          />
          {/* Cột cờ */}
          <rect x="44" y="30" width="3" height="25" fill="#888" />
        </g>
      </svg>
    </div>
    <div className="fallback-tank-text">
      <span>Đang giải phóng miền Nam...</span>
    </div>
  </div>
);

export default FallbackTank;