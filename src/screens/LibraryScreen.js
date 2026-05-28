// src/screens/LibraryScreen.js
import React from "react";
import { C } from "../cores"; 

export default function LibraryScreen({ savedProgressions, openInPlayer, deleteProgression }) {
  return (
    <div>
      {/* Cabeçalho da biblioteca */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "14px"
      }}>
        <span style={{
          fontSize: "16px",
          fontWeight: "bold",
          color: "#fff"
        }}>
          Biblioteca
        </span>
        <span style={{
          fontSize: "12px",
          color: C.muted
        }}>
          {savedProgressions.length} guardadas
        </span>
      </div>

      {savedProgressions.length === 0 ? (
        /* Estado vazio */
        <div style={{
          textAlign: "center",
          color: C.muted,
          fontSize: "13px",
          marginTop: "60px"
        }}>
          <div style={{
            fontSize: "48px",
            marginBottom: "12px",
            opacity: 0.4
          }}>🎷</div>
          <p style={{ margin: "0 0 4px 0" }}>Ainda não tens progressões guardadas.</p>
          <p style={{ margin: 0, fontSize: "11px" }}>Gera e guarda uma na tab Início!</p>
        </div>
      ) : (
        savedProgressions.map(p => (
          <div key={p.id} style={{
            display: "flex",
            alignItems: "center",
            background: C.bgCard,
            border: `1px solid ${C.border}`,
            borderRadius: "12px",
            padding: "10px",
            marginBottom: "10px",
            gap: "10px",
          }}>

            {/* Botão play à esquerda */}
            <div onClick={() => openInPlayer(p)} style={{
              width: "48px", height: "48px", flexShrink: 0,
              background: C.accent, borderRadius: "8px",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              cursor: "pointer", gap: "2px",
            }}>
              <span style={{ fontSize: "16px" }}>▶</span>
              <span style={{ fontSize: "9px", color: "#fff" }}></span>
            </div>

            {/* Info central */}
            <div style={{
              flex: 1,
              minWidth: 0
            }}>

              {/* Linha 1: nota + tonalidade + estrutura */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "4px"
              }}>
                <span style={{ fontSize: "13px" }}>🎵</span>
                <span style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "#fff"
                }}>
                  {p.key}
                </span>
                <span style={{ 
                  fontSize: "11px", 
                  color: C.muted 
                  }}>♩♩</span>
                <span style={{ 
                  fontSize: "12px", 
                  color: C.muted 
                  }}>
                  {p.structure}
                </span>
              </div>

              {/* Linha 2: modulação + data */}
              <div style={{ fontSize: "11px", color: C.muted }}>
                Modulação: {p.modulation} {"•"}{" "}
                {new Date(p.created_at).toLocaleDateString("pt-PT", {
                  day: "2-digit", month: "2-digit",
                  hour: "2-digit", minute: "2-digit"
                })}
              </div>
            </div>

            {/* Botão apagar à direita */}
            <button onClick={() => deleteProgression(p.id)} style={{
              background: "none", border: "none",
              color: C.muted, cursor: "pointer",
              fontSize: "18px", flexShrink: 0,
              padding: "4px",
            }}>
              🗑
            </button>

          </div>
        ))
      )}
    </div>
  );
}