import React from "react";
import ChordWheel from "../components/ChordWheel";
import { C, selectStyle, btnStyle } from "../cores";

export default function HomeScreen({
  selectedKey, setSelectedKey,
  selectedStructure, setSelectedStructure, structures,
  selectedModulation, setSelectedModulation, modulations,
  generateProgression, saved,
  savedProgressions, setTab, openInPlayer
}) {
  return (
    <div>
      {/* roda das tonalidades */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "4px"
      }}>
        <ChordWheel
          selectedKey={selectedKey}
          onSelectKey={setSelectedKey}
        />
      </div>

      {/* dropdowns lado a lado */}
      <div style={{
        display: "flex",
        gap: "8px",
        marginTop: "12px"
      }}>
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: "20px",
            color: C.muted,
            margin: "0 0 4px 0"
          }}>Estrutura</p>
          <select value={selectedStructure}
            onChange={e => setSelectedStructure(e.target.value)}
            style={{ ...selectStyle, width: "100%" }}>
            {structures.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: "20px",
            color: C.muted,
            margin: "0 0 4px 0"
          }}>Modulação</p>
          <select value={selectedModulation}
            onChange={e => setSelectedModulation(e.target.value)}
            style={{ ...selectStyle, width: "100%" }}>
            {modulations.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* 2 botoes de gerar */}
      <button onClick={() => generateProgression("Random", "Random", "Random")} 
      style={{
        ...btnStyle,
        marginTop: "12px",
        width: "100%",
        height: "48px",
        fontSize: "14px",
        background: "#fff",
        border: "none",
        fontFamily: "Helvetica Now Display",
        color: "#000",
        borderRadius: "12px",
        alignItems: "center",
        gap: "10px",
        padding: "10px 24px",
        fontWeight:"500",
        lineHeight:"140%",
        letterSpacing: "-0.14px", 
      }}>
        Gerar progressão aleatória
      </button>

      <button onClick={() => generateProgression()} style={{
        ...btnStyle,
        marginTop: "12px",
        width: "100%",
        height: "48px",
        fontSize: "14px",
        background: "#2E4A2C",
        border: "none",
        fontFamily: "Helvetica Now Display",
        color: "#fff",
        borderRadius: "12px",
        alignItems: "center",
        gap: "10px",
        padding: "10px 24px",
        fontWeight:"500",
        lineHeight:"140%",
        letterSpacing: "-0.14px",
      }}>
        Gerar progressão
      </button>

      {/*aviso de progressao que foi criada*/}
      {saved && (
        <div style={{
          marginTop: "10px",
          padding: "10px",
          background: "#2e5c2e",
          border: "1px solid #4a8a4a",
          borderRadius: "8px",
          color: "#90ee90",
          fontSize: "16px",
          textAlign: "center",
        }}>
          ✅ Progressão criada! Vai ao tab Progressões para ouvir.
        </div>
      )}

      {/* progressoes recentes */}
      {savedProgressions.length > 0 && (
        <div style={{ 
          marginTop: "16px" 
          }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px"
          }}>
            <span style={{ 
              fontSize: "19px", 
              color: "#fff",
              fontFamily: "Inter", 
              fontWeight:"400",
              }}>
              Progressões recentes
            </span>
            <button onClick={() => setTab("library")} style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontFamily: "Inter",
              fontSize: "19px ",
              cursor: "pointer",
              fontWeight:"400",
            }}>
              Ver biblioteca →
            </button>
          </div>

          {/* mostra as 3 mais recentes */}
          {savedProgressions.slice(0, 3).map(p => (
            <div key={p.id} style={{
              display: "flex",
              height: "69px",              
              alignItems: "center",         
              background: "#fff",
              border: `1px solid ${C.border}`,
              borderRadius: "10px",
              padding: "0 14px",            
              marginBottom: "10px",
              gap: "14px",                  
              boxSizing: "border-box",
            }}>
              
              {/* Botão Play */}
              <button onClick={() => openInPlayer(p)} style={{
                width: "44px",              
                height: "44px",
                padding: 0,
                background: "#2e3d1f",
                border: "2px solid #c8d8b0",
                borderRadius: "50%",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{ marginLeft: "2px" }} 
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>

              {/* Bloco de Informação (Texto) */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "10px",                 
                flex: 1,
                minWidth: 0,
              }}>
                
                {/* Linha 1: 🎵 C ♩♩ AABA */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"               
                }}>
                  <span style={{ 
                    fontSize: "16px", 
                    color: "#000" 
                    }}>🎵</span>
                  <span style={{ 
                    fontSize: "16px", 
                    fontWeight: "bold", 
                    color: "#000" 
                    }}>
                    {p.key}
                  </span>
                  <span style={{ 
                    fontSize: "16px", 
                    color: "#666" 
                    }}>♩♩</span>
                  <span style={{ 
                    fontSize: "16px", 
                    color: "#000" 
                    }}>
                    {p.structure}
                  </span>
                </div>

                {/* Linha 2: Modulação e Data */}
                <div style={{
                  fontSize: "12px",
                  color: "#666",
                  letterSpacing: "0.2px",
                }}>
                  Modulação: {p.modulation} • {new Date(p.created_at).toLocaleDateString("pt-PT", {
                    day: "2-digit", month: "2-digit",
                    hour: "2-digit", minute: "2-digit"
                  })}
                </div>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}