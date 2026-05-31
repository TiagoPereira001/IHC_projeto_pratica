import React from "react";
import { UserProfile, useClerk } from "@clerk/clerk-react";

export default function ProfileScreen({ setTab }) {
  const { signOut } = useClerk();

  return (
    <div style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      background: "transparent",
      width: "100%",
      overflowX: "hidden",
    }}>
      {/* Container do Topo */}
      <div style={{
        padding: "8px 16px 16px 16px",
        zIndex: 20,
      }}>
        {/* Botão para voltar atrás */}
        <button 
          onClick={() => setTab("home")}
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "12px",
            color: "#fff",
            padding: "10px 16px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backdropFilter: "blur(4px)",
          }}
        >
          ← Voltar
        </button>
      </div>

      {/* Container do Perfil - Full Page com correções de largura */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        width: "100%",
        background: "rgba(255, 255, 255, 0.98)",
        borderRadius: "24px 24px 0 0", // Arredondado só no topo para parecer uma página que sobe
        boxShadow: "0 -10px 30px rgba(0,0,0,0.2)",
        position: "relative", // Necessário para o botão de sair absoluto
      }}>
        
        {/* Botão de Logout posicionado dentro do branco, no topo direito */}
        <button 
          onClick={() => signOut()}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "#fff5f5",
            border: "1px solid #feb2b2",
            borderRadius: "8px",
            color: "#c53030",
            padding: "8px 12px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            zIndex: 30, // Fica por cima do conteúdo do Clerk
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          Sair
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>

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
                display: "none", 
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
