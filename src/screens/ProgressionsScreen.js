import React, { useEffect } from "react";
import { C, btnStyle } from "../cores";

export default function ProgressionsScreen({
  progression, scrollRef, activeChordIndex, togglePlay,
  isPlaying, formatTime, currentTime, duration, handleSeek,
  audioRef, audioUrl, handleTimeUpdate, handleLoadedMetadata,
  handleEnded, setIsPlaying, saveProgression, savedProgressions,
  setTab, playChords, openInPlayer
}) {

  // ==========================================
  // LÓGICA DE UX: AUTO-SCROLL À PROVA DE iOS
  // ==========================================
  useEffect(() => {
    // Voltámos ao scrollIntoView porque é nativo e não é bloqueado pelo Safari!
    if (activeChordIndex !== null && activeChordIndex !== undefined && activeChordIndex >= 0) {
      const activeElement = document.getElementById(`chord-${activeChordIndex}`);
      if (activeElement && scrollRef.current) {
        // Calcula a posição para deixar a nota exatamente no centro
        const container = scrollRef.current;
        const scrollPos = activeElement.offsetLeft - (container.clientWidth / 2) + (activeElement.clientWidth / 2);
        
        container.scrollTo({
          left: scrollPos,
          behavior: "smooth"
        });
      }
    }
  }, [activeChordIndex, scrollRef]);

  return (
    <div>
      <p style={{
        fontSize: "20px",
        fontFamily: "Inter, sans-serif",
        color: "#fff",
        margin: "0 0 12px 0",
        fontWeight:"300",
      }}>Ultima progressão criada</p>

      {/* gera o resultado */}
      {progression ? (
        <div>
          {/* layout tipo figma */}
          <div
          ref={scrollRef}
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "24px",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            paddingBottom: "4px",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollBehavior: "smooth",
          }}>
            {/*tenho que por um css aqui para esconder a barra de horizontal de scrooll*/}
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>

            {/* --- ESPAÇO FANTASMA INICIAL --- */}
            {/* Ajustado para calc(50% - 40px) para centrar perfeitamente a nota de 80px */}
            <div style={{ minWidth: "calc(50% - 40px)", flexShrink: 0 }}></div>

            {progression.chords.split("|").map((chord, i) => (
              <div 
                key={i} 
                id={`chord-${i}`} // O nosso Bilhete de Identidade
                style={{
                  background: i === activeChordIndex ? "#FFFFFF" : "#FFFFFF26",
                  minWidth: "80px",
                  backdropFilter: "blur(10px)",
                  height: "75px",
                  padding:"15px 20px",
                  borderRadius: "12px",
                  display: "flex",
                  fontSize: "14px",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: i === activeChordIndex ? "#000000" : "#FFFFFFB3",
                  boxShadow: i === activeChordIndex ? "0 4px 12px #ffffffb3" : "0 4px 6px #0000001a",
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                  border: i === activeChordIndex ? "2px solid #FFFFFF" : "1px solid #FFFFFF26",
              }}>
                {chord.trim()}
              </div>
            ))}

            {/* --- ESPAÇO FANTASMA FINAL --- */}
            <div style={{ minWidth: "calc(50% - 40px)", flexShrink: 0 }}></div>

          </div>

          {/*aqui vai o mini player visual*/}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}>
            {/*botao play da musica*/}
            <button onClick={togglePlay} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap:"6px",
              background: isPlaying ? "#FFFFFF4C": "#FFFFFF26",
              border: `1px solid ${C.muted}`,
              borderRadius: "8px",
              padding: "10px 16px",
              color: "#fff",
              cursor: "pointer",
              height: "46px",
              flexShrink: 0,
              transition: "all 0.2s",
              minWidth: "90px"
            }}>
              <span style={{
                fontSize: "14px",
              }}> {isPlaying ? "⏸" : "▶"}</span>
              <span style={{
                fontSize: "14px",
                fontWeight: "bold",
              }}> {formatTime(currentTime)}
              </span>
            </button>
            {/*caixa do tempo com a borda*/}
            <div style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#ffffff1a",
              border: "1px solid #ffffff4d",
              borderRadius: "8px",
              padding: "8px 10px",
              height: "40px",
              boxSizing: "border-box",
            }}>
              <input
                type="range"
                min= "0"
                max={duration || 100}
                value={currentTime || 0}
                onChange={handleSeek}
                style={{
                  flex: 1,
                  accentColor: C.muted,
                  cursor: "pointer",
                }}
                />
                <span style={{
                  fontSize: "12px",
                  color: "#fff",
                  minWidth: "30px",
                  textAlign: "right",
                }}>-{formatTime(duration - currentTime)}
                </span>
            </div>
          </div>

          {/* este vai ser o tag do audio nativo que esta escondido */}
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            style={{
              display: "none"
            }}
          />
          
          {/* botao salvar progressao */}
          <button onClick={saveProgression} style={{
            ...btnStyle,
            width: "100%",
            fontSize: "14px",
            padding: "13px",
            background: "#2E4A2C",
            borderRadius: "12px",
            fontWeight: "bold",
          }}>
            Salvar progressão
          </button>

          {/* progressoes salvas  */}
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
              {savedProgressions.slice(0, 20).map(p => (
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
      ) : (
        /* sem progressao criada */
        <div style={{
          textAlign: "center",
          color: C.muted,
          fontSize: "13px",
          marginTop: "60px"
        }}>
          <div style={{ 
            fontSize: "40px", 
            marginBottom: "10px" 
            }}>🎹</div>
          <span style={{
            fontSize: "20px",
            display:"flex",
            justifyContent:"center",
          }}>Ainda não geraste nenhuma progressão.</span>
          <span style={{ 
            fontSize: "20px" 
            }}>Vai ao Início e gera uma!</span>
        </div>
      )}
    </div>
  );
}