// src/screens/ProfileScreen.js
import React from "react";
import { UserProfile } from "@clerk/clerk-react";

export default function ProfileScreen({ setTab }) {
  return (
    <div style={{
      height: "100%",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0, 0, 0, 0.4)", // Efeito de escurecimento do fundo
      backdropFilter: "blur(4px)",
      position: "relative",
      padding: "10px",
      boxSizing: "border-box",
    }}>
      {/* Janela Flutuante Pequena */}
      <div style={{
        width: "280px", // Largura pequena para caber no frame de 320px
        height: "450px", // Altura controlada
        background: "#fff",
        borderRadius: "24px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        animation: "appear 0.3s ease-out",
      }}>
        
        {/* Estilo para animação e scroll */}
        <style>{`
          @keyframes appear {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .cl-userProfile-root {
            width: 100% !important;
          }
        `}</style>

        {/* Cabeçalho da Janela com Botão Fechar */}
        <div style={{
          padding: "12px 16px",
          display: "flex",
          justifyContent: "flex-end",
          background: "#f9fafb",
          borderBottom: "1px solid #eee",
          zIndex: 10,
        }}>
          <button 
            onClick={() => setTab("home")}
            style={{
              background: "#eee",
              border: "none",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "16px",
              color: "#666",
              fontWeight: "bold"
            }}
          >
            ✕
          </button>
        </div>

        {/* Container do Clerk com Escala Reduzida */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "0",
        }}>
          <div style={{
            width: "100%",
            transform: "scale(0.85)", // Diminuímos para caber melhor
            transformOrigin: "top center",
            height: "117%", // Compensar a escala na altura
            marginBottom: "-17%",
          }}>
            <UserProfile 
              routing="hash"
              appearance={{
                elements: {
                  rootBox: {
                    width: "100%",
                    maxWidth: "100%",
                  },
                  card: {
                    width: "100%",
                    maxWidth: "100%",
                    boxShadow: "none",
                    borderRadius: "0",
                    border: "none",
                  },
                  navbar: {
                    display: "none", // Esconder barra lateral para poupar espaço
                  },
                  scrollBox: {
                    borderRadius: "0",
                    padding: "10px",
                  },
                  pageScrollBox: {
                    padding: "10px",
                  },
                  userProfile: {
                    maxWidth: "100%",
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
