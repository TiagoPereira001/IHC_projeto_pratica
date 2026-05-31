import React, { useState, useMemo } from "react";
import { C } from "../cores"; 
import LibraryFilters from "../components/LibraryFilters";

/**
 * Ecrã principal da Biblioteca.
 * Responsável por apresentar a lista de progressões guardadas e invocar o modal de filtros.
 */
export default function LibraryScreen({ savedProgressions, openInPlayer, deleteProgression }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [appliedFilters, setAppliedFilters] = useState({ key: [], structure: [], modulation: [] });

  const availableKeys = useMemo(() => [...new Set(savedProgressions.map(p => p.key))], [savedProgressions]);
  const availableStructures = useMemo(() => [...new Set(savedProgressions.map(p => p.structure))], [savedProgressions]);
  const availableModulations = useMemo(() => [...new Set(savedProgressions.map(p => p.modulation))], [savedProgressions]);

  const filteredProgressions = useMemo(() => {
    return savedProgressions.filter(p => {
      const matchKey = appliedFilters.key.length === 0 || appliedFilters.key.includes(p.key);
      const matchStructure = appliedFilters.structure.length === 0 || appliedFilters.structure.includes(p.structure);
      const matchModulation = appliedFilters.modulation.length === 0 || appliedFilters.modulation.includes(p.modulation);
      return matchKey && matchStructure && matchModulation;
    });
  }, [savedProgressions, appliedFilters]);

  return (
    <>
      <div>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "14px" 
          }}>
          
          {/* Título com a contagem dinâmica injetada */}
          <span style={{ 
            fontSize: "25px", 
            fontWeight: "400", 
            fontFamily: "Inter, sans-serif", 
            color: "#fff" 
            }}>
            Biblioteca ({savedProgressions.length})
          </span>
          
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px" 
            }}>
            
            {savedProgressions.length > 0 && (
              <button onClick={() => setIsFilterOpen(true)} style={{
                background: "none", 
                border: "none", 
                color: "#fff", 
                display: "flex", 
                alignItems: "center", 
                gap: "4px", 
                cursor: "pointer", 
                fontFamily: "Inter, sans-serif", 
                fontSize: "19px", 
                padding: 0
              }}>
                Filtros
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="21" x2="4" y2="14"></line>
                  <line x1="4" y1="10" x2="4" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12" y2="3"></line>
                  <line x1="20" y1="21" x2="20" y2="16"></line>
                  <line x1="20" y1="12" x2="20" y2="3"></line>
                  <line x1="1" y1="14" x2="7" y2="14"></line>
                  <line x1="9" y1="8" x2="15" y2="8"></line>
                  <line x1="17" y1="16" x2="23" y2="16"></line>
                </svg>
              </button>
            )}
          </div>
        </div>

        {filteredProgressions.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            color: C.muted, 
            fontSize: "13px", 
            marginTop: "60px", 
            fontFamily: "Inter, sans-serif" 
            }}>
            <div style={{ 
              fontSize: "48px", 
              marginBottom: "12px", 
              opacity: 0.4 
              }}>🎷</div>
            <p style={{ 
              fontSize: "20px",
              margin: "0 0 4px 0" 
              }}>Nenhuma progressão encontrada.</p>
            <p style={{ 
              margin: 0, 
              fontSize: "20px" 
              }}>Tenta remover os filtros ou gerar mais!</p>
          </div>
        ) : (
          filteredProgressions.map(p => (
            <div key={p.id} style={{
              display: "flex", 
              height: "69px", 
              alignItems: "center", 
              background: "#FFF",
              border: `1px solid ${C.border}`, 
              borderRadius: "10px", 
              padding: "0 14px",
              marginBottom: "10px", 
              gap: "14px", 
              boxSizing: "border-box",
            }}>
              <div onClick={() => openInPlayer(p)} style={{
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
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "2px" }}>
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>

              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "center", 
                alignItems: "flex-start", 
                gap: "6px", 
                flex: 1, 
                minWidth: 0 
                }}>
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
                    color: "#000", 
                    fontFamily: "Inter, sans-serif" 
                    }}>{p.key}</span>
                  <span style={{ 
                    fontSize: "16px", 
                    color: "#666" 
                    }}>♩♩</span>
                  <span style={{ 
                    fontSize: "16px", 
                    color: "#000", 
                    fontFamily: "Inter, sans-serif" 
                    }}>{p.structure}</span>
                </div>
                <div style={{ 
                  fontSize: "12px", 
                  color: "#666", 
                  letterSpacing: "0.2px", 
                  fontFamily: "Inter, sans-serif" 
                  }}>
                    Modulação: {p.modulation} • {new Date(p.created_at).toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>

              <button onClick={() => deleteProgression(p.id)} style={{
                background: "none", 
                border: "none", 
                color: "#666", 
                cursor: "pointer",
                fontSize: "18px", 
                flexShrink: 0, 
                padding: "4px", 
                display: "flex",
                alignItems: "center", 
                justifyContent: "center"
              }}>
                🗑
              </button>
            </div>
          ))
        )}
      </div>

      {/* RENDERIZAÇÃO DO COMPONENTE BOTTOM SHEET (Sobrepõe-se à UI principal) */}
      {isFilterOpen && (
        <LibraryFilters 
          appliedFilters={appliedFilters}
          availableKeys={availableKeys}
          availableStructures={availableStructures}
          availableModulations={availableModulations}
          onClose={() => setIsFilterOpen(false)}
          onApply={(newFilters) => {
            setAppliedFilters(newFilters);
            setIsFilterOpen(false); 
          }}
        />
      )}
    </>
  );
}