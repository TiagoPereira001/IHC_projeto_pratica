// src/screens/ProfileScreen.js
import React from "react";
import { UserProfile } from "@clerk/clerk-react";

export default function ProfileScreen({ setTab }) {
  return (
    <div style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      background: "transparent",
      width: "100%",
      overflowX: "hidden",
    }}>
      {/* Botão para voltar atrás - Restaurado */}
      <button 
        onClick={() => setTab("home")}
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "12px",
          color: "#fff",
          padding: "10px 16px",
          margin: "8px 16px 16px 16px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "14px",
          alignSelf: "flex-start",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backdropFilter: "blur(4px)",
          zIndex: 20,
        }}
      >
        ← Voltar
      </button>

      {/* Container do Perfil - Full Page com correções de largura */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        width: "100%",
        background: "rgba(255, 255, 255, 0.98)",
        borderRadius: "24px 24px 0 0", // Arredondado só no topo para parecer uma página que sobe
        boxShadow: "0 -10px 30px rgba(0,0,0,0.2)",
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
                padding: "0",
              },
              navbar: {
                display: "none", // Mantemos escondido para ganhar largura
              },
              scrollBox: {
                borderRadius: "0",
                padding: "16px",
                width: "100%",
                boxSizing: "border-box",
              },
              pageScrollBox: {
                padding: "16px",
                width: "100%",
                boxSizing: "border-box",
              },
              userProfile: {
                width: "100%",
                maxWidth: "100%",
              },
              headerTitle: {
                fontSize: "1.25rem",
              },
              headerSubtitle: {
                fontSize: "0.85rem",
                whiteSpace: "normal", // Forçar quebra de linha no subtítulo
              },
              profileSection: {
                flexDirection: "column", // Forçar empilhamento vertical
                alignItems: "flex-start",
                gap: "8px",
              },
              formFieldRow: {
                flexDirection: "column",
                alignItems: "stretch",
              },
              formField: {
                width: "100%",
              },
              avatarRow: {
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }
            }
          }}
        />
      </div>
    </div>
  );
}
