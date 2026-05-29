// src/components/LibraryFilters.js
import React, { useState, useEffect } from "react";
import { C } from "../cores";

/**
 * Componente responsável pelo ecrã de filtros da Biblioteca (Bottom Sheet Modal).
 * Utiliza um padrão de "Segmented Control" (Tabs) no topo para alternar categorias,
 * e "Toggle Buttons" (Pills/Círculos) para as seleções, maximizando a área de toque
 * (Lei de Fitts) e garantindo uma estética moderna e nativa.
 */
export default function LibraryFilters({
  appliedFilters,
  availableKeys,
  availableStructures,
  availableModulations,
  onApply,
  onClose
}) {
  const [tempFilters, setTempFilters] = useState(appliedFilters);
  
  // Estado para gerir qual a aba (Tab) ativa na barra superior
  const [activeTab, setActiveTab] = useState('key'); 
  
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsAnimating(true));
  }, []);

  const handleCloseAnim = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  const handleApplyAnim = () => {
    setIsAnimating(false);
    setTimeout(() => onApply(tempFilters), 300);
  };

  const handleClearAnim = () => {
    setIsAnimating(false);
    setTimeout(() => onApply({ 
        key: [], 
        structure: [], 
        modulation: [] 
    }), 300);
  };

  const handleToggleFilter = (category, value) => {
    setTempFilters(prev => {
      const current = prev[category];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  // Renderização do conteúdo consoante a aba selecionada
  const renderTabContent = () => {
    const options = activeTab === 'key' ? availableKeys 
                  : activeTab === 'structure' ? availableStructures 
                  : availableModulations;

    if (options.length === 0) {
      return (
        <div style={{ 
            textAlign: "center", 
            color: "#ffffff66", 
            marginTop: "40px", 
            fontFamily: "Inter, sans-serif" }}>
          Nenhuma opção disponível nesta categoria.
        </div>
      );
    }

    // O layout adapta-se à categoria (Tons = Círculos centralizados, Resto = Pills alinhadas)
    const isKey = activeTab === 'key';

    return (
      <div style={{ 
        display: "flex", 
        flexWrap: "wrap", 
        gap: isKey ? "12px" : "10px", 
        justifyContent: "center",
        marginTop: "16px"
      }}>
        {options.map(opt => {
          const isSelected = tempFilters[activeTab].includes(opt);
          
          return (
            <button
              key={opt}
              onClick={() => handleToggleFilter(activeTab, opt)}
              style={{
                // Se for "Tom", fazemos círculos (54x54px). Se for outro, fazemos cápsulas "Pills" horizontais.
                height: isKey ? "54px" : "42px",
                minWidth: isKey ? "54px" : "auto",
                padding: isKey ? "0" : "0 20px",
                borderRadius: isKey ? "50%" : "20px", 
                background: isSelected ? "#fff" : "rgba(255, 255, 255, 0.08)",
                border: isSelected ? "1px solid #fff" : "1px solid rgba(255, 255, 255, 0.1)",
                color: isSelected ? "#000" : "#fff",
                fontSize: isKey ? "16px" : "15px",
                fontWeight: isSelected ? "600" : "400",
                fontFamily: "Inter, sans-serif",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease"
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ 
      position: "absolute", 
      top: -20, 
      left: -20, 
      right: -20, 
      bottom: -20, 
      zIndex: 999, 
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "flex-end", 
      overflow: "hidden" 
    }}>
      
      {/* Camada Backdrop Escura */}
      <div 
        onClick={handleCloseAnim}
        style={{ 
          position: "absolute", 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          backgroundColor: "#00000080", 
          backdropFilter: "blur(4px)",
          opacity: isAnimating ? 1 : 0, 
          transition: "opacity 0.3s ease", 
          cursor: "pointer"
        }}
      />

      {/* Cartão do Bottom Sheet */}
      <div style={{ 
        position: "relative", 
        width: "100%", 
        maxHeight: "85%",
        backgroundColor: "#3A4B2C", 
        borderTopLeftRadius: "28px", 
        borderTopRightRadius: "28px",
        padding: "16px 24px 32px 24px", 
        boxSizing: "border-box", 
        display: "flex", 
        flexDirection: "column",
        transform: isAnimating ? "translateY(0)" : "translateY(100%)", 
        transition: "transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)", 
        boxShadow: "0 -4px 32px #00000099"
      }}>
        
        {/* Puxador visual (Handlebar) */}
        <div style={{ 
          width: "48px", 
          height: "5px", 
          backgroundColor: "#ffffff40", 
          borderRadius: "100px", 
          margin: "0 auto 24px auto" 
        }} />

        {/* Topbar do Modal */}
        <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "20px" 
            }}>
          <span style={{ 
            fontSize: "20px", 
            fontWeight: "600", 
            fontFamily: "Inter, sans-serif", 
            color: "#fff" }}>
            Filtros
          </span>
          <button onClick={handleCloseAnim} style={{ 
            background: "#ffffff1a", 
            border: "none", 
            color: "#fff", 
            width: "32px", 
            height: "32px", 
            borderRadius: "50%",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            cursor: "pointer", 
            padding: 0 
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* BARRA EM CIMA: Segmented Control (Tabs) */}
        <div style={{
          display: "flex",
          background: "#00000026", // Fundo ligeiramente escuro para a barra
          borderRadius: "12px",
          padding: "4px",
          marginBottom: "16px"
        }}>
          {[
            { id: 'key', label: 'Tom' },
            { id: 'structure', label: 'Estrutura' },
            { id: 'modulation', label: 'Modulação' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "10px 0",
                background: activeTab === tab.id ? "#fff" : "transparent",
                color: activeTab === tab.id ? "#000" : "#fff",
                border: "none",
                borderRadius: "8px", // O botão ativo fica com cantos arredondados dentro da barra
                fontSize: "14px",
                fontWeight: activeTab === tab.id ? "600" : "500",
                fontFamily: "Inter, sans-serif",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Área dinâmica que muda consoante a Tab ativa */}
        <div style={{ flex: 1, 
            overflowY: "auto", 
            minHeight: "180px", 
            paddingBottom: "20px" 
            }}>
          {renderTabContent()}
        </div>

        {/* Acções Finais */}
        <div style={{ 
          display: "flex", 
          gap: "24px", // Aumentámos a margem ao centro (antes era 12px)
          marginTop: "24px" 
        }}>
          {/* Botão Secundário (Outline) */}
          <button onClick={handleClearAnim} style={{ 
            flex: 1, 
            background: "transparent", 
            border: "1.5px solid rgba(255, 255, 255, 0.3)", 
            borderRadius: "14px", 
            color: "#fff", 
            padding: "16px", 
            fontFamily: "Inter, sans-serif", 
            fontSize: "15px", 
            fontWeight: "500", 
            cursor: "pointer",
            transition: "background 0.2s ease"
          }}>
            Limpar tudo
          </button>
          
          {/* Botão Primário (Alto Contraste) */}
          <button onClick={handleApplyAnim} style={{ 
            flex: 1, 
            background: "#A3AE8D", // Verde claro para destacar do fundo escuro
            border: "none", 
            borderRadius: "14px", 
            color: "#111", // Texto quase preto para contraste perfeito (Acessibilidade)
            padding: "16px", 
            fontFamily: "Inter, sans-serif", 
            fontSize: "15px", 
            fontWeight: "600", 
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)" // Pequena sombra para dar profundidade
          }}>
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}