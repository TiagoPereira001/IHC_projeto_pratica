// src/WebserviceTest.js
import { useEffect, useState, useRef } from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import bgJazz from "./assets/bg-jazz.png";

// Importar as  cores e estilos
import { C, selectStyle, btnStyle } from "./cores"; 

// Importar o componente da Roda
import ChordWheel from "./components/ChordWheel";

const BASE_URL = "https://genjazz-api.fly.dev";


function WebserviceTestForm() {
  const [tempo, setTempo] = useState(100); // Estado para controlar os BPMs do slider
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const [keys, setKeys] = useState([]);
  const [structures, setStructures] = useState([]);
  const [modulations, setModulations] = useState([]);

  const [selectedKey, setSelectedKey] = useState("");
  const [selectedStructure, setSelectedStructure] = useState("");
  const [selectedModulation, setSelectedModulation] = useState("");

  const [progression, setProgression] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const [savedProgressions, setSavedProgressions] = useState([]);

  const [tab, setTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  // tudo os "const" que estao abaixo servem para a barra de play no ecra de progressoes
  const audioRef = useRef(null);
  const scrollRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeChordIndex, setActiveChordIndex] = useState(-1);

  // -----------------------------
  // Load data
  // -----------------------------
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [kRes, sRes, mRes] = await Promise.all([
          fetch(`${BASE_URL}/api/keys`),
          fetch(`${BASE_URL}/api/structures`),
          fetch(`${BASE_URL}/api/modulations`)
        ]);

        const kData = await kRes.json();
        const sData = await sRes.json();
        const mData = await mRes.json();

        setKeys(kData.map(k => k.key ?? k));
        setStructures(sData.map(s => s.structure ?? s).slice(0, 10)); // TOP 10
        setModulations(mData.map(m => m.modulation ?? m));

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // -----------------------------
  // Load saved progressions
  // -----------------------------
  const loadSavedProgressions = async () => {
    if (!email) return;

    try {
      const res = await fetch(`${BASE_URL}/api/chords/user/${email}?t=${Date.now()}`);
      const data = await res.json();
      const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setSavedProgressions(sortedData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (email) loadSavedProgressions();
  }, [email]);
// Efeito para centrar a nota ativa automaticamente no deslize horizontal

  useEffect(() => {
    if (scrollRef.current && activeChordIndex >= 0) {
      const container = scrollRef.current;
      const activeElement = container.children[activeChordIndex]; // Encontra a nota branca atual

      if (activeElement) {
        // Calcula a posição para deixar a nota exatamente no centro
        const scrollPos = activeElement.offsetLeft - (container.clientWidth / 2) + (activeElement.clientWidth / 2);
        
        container.scrollTo({
          left: scrollPos,
          behavior: "smooth" // Faz o deslize suave (swipe left automático)
        });
      }
    }
  }, [activeChordIndex]);
  // -----------------------------
  // Generate progression
  // -----------------------------
const generateProgression = async (forceKey, forceStructure, forceModulation) => {
    try {
      const key        = forceKey        || selectedKey        || "Random";
      const structure  = forceStructure  || selectedStructure  || "Random";
      const modulation = forceModulation || selectedModulation || "Random";

      const res = await fetch(`${BASE_URL}/api/generate/${key}/${structure}/${modulation}`);
      const data = await res.json();

      setProgression(data);
      setAudioUrl(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setActiveChordIndex(-1);
      setSaved(true);
      
      await loadSavedProgressions(); 
      
      setTimeout(() => setSaved(false), 3000); 
    } catch (err) {
      setError(err.message);
    }
  };

  // -----------------------------
  // Convert to MP3
  // -----------------------------
  const convertToMp3 = async () => {
    if (!progression?.chords) return;

    try {
      const encoded = encodeURIComponent(progression.chords);
      const res = await fetch(`${BASE_URL}/api/chords2mp3/${encoded}`);
      const data = await res.json();

      setAudioUrl(`${BASE_URL}${data.mp3_url}`);
    } catch (err) {
      setError(err.message);
    }
  };
// -----------------------------
  // Tocar Áudio Instantaneamente
  // -----------------------------
  const playChords = async (chords) => {
    if (!chords) return;

    try {
      const encoded = encodeURIComponent(chords);
      const res = await fetch(`${BASE_URL}/api/chords2mp3/${encoded}`);
      const data = await res.json();

      // Toca a música diretamente em background sem precisar de um <audio> tag!
      const audio = new Audio(`${BASE_URL}${data.mp3_url}`);
      audio.play();
    } catch (err) {
      setError(err.message);
    }
  };

  
  const openInPlayer = (p) => {
    setProgression(p);       // Carrega a progressão escolhida para o ecrã
    setAudioUrl(null);       // Limpa o áudio da música anterior (se houver)
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveChordIndex(-1);
    setTab("progressions");  // Muda a tab automaticamente
  };

  //aqui vai toda a logica do player avançado na pagina de progressoes
  const formatTime = (time) => {
    if (isNaN(time) || time < 0) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Botão Play/Pause principal
  const togglePlay = async () => {
    if (!progression?.chords) return;

    // Se já tem áudio, apenas faz Play ou Pause
    if (audioRef.current && audioUrl) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      return;
    }

    // Se é a primeira vez que clica no play, vai buscar a música
    try {
      const encoded = encodeURIComponent(progression.chords);
      const res = await fetch(`${BASE_URL}/api/chords2mp3/${encoded}`);
      const data = await res.json();
      setAudioUrl(`${BASE_URL}${data.mp3_url}`);
    } catch (err) {
      setError(err.message);
    }
  };

  // Dispara automaticamente quando a música é carregada
  useEffect(() => {
    if (audioUrl && audioRef.current && tab === "progressions") {
      audioRef.current.play().catch(e => console.log(e));
    }
  }, [audioUrl, tab]);

  // Atualiza a barra de tempo e a nota branca (activeChordIndex)
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const dur = audioRef.current.duration;
    setCurrentTime(current);

    if (dur > 0 && progression?.chords) {
      const chordsArray = progression.chords.split("|");
      const progressPercentage = current / dur;
      // Calcula qual acorde está a tocar agora
      let index = Math.floor(progressPercentage * chordsArray.length);
      if (index >= chordsArray.length) index = chordsArray.length - 1;
      setActiveChordIndex(index);
    }
  };

  // Eventos do áudio
  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };
  
  const handleEnded = () => {
    setIsPlaying(false);
    setActiveChordIndex(-1);
    setCurrentTime(0);
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      audioRef.current.currentTime = e.target.value;
      setCurrentTime(e.target.value);
    }
  }
  

  // -----------------------------
  // Save progression
  // -----------------------------
  const saveProgression = async () => {
    if (!progression?.chords || !email) return;

    try {
      await fetch(`${BASE_URL}/api/chords`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          chords: progression.chords,
          
          key: progression.key || selectedKey || "Random",
          structure: progression.structure || selectedStructure || "Random",
          modulation: progression.modulation || selectedModulation || "Random"
        })
      });

      await loadSavedProgressions();
    } catch (err) {
      setError(err.message);
    }
  };

  // -----------------------------
  // Delete progression
  // -----------------------------
  const deleteProgression = async (id) => {
    if (!email) return;

    try {
      await fetch(`${BASE_URL}/api/chords/${email}/${id}`, {
        method: "DELETE"
      });

      await loadSavedProgressions();
    } catch (err) {
      setError(err.message);
    }
  };

  // -----------------------------
  // UI states
  // -----------------------------
  if (loading) return (
    <div style={{
      height: "100%",
      background: C.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <p style={{ color: C.muted }}> A carregar...</p>
    </div>
  );

  if (error) return (
    <div style={{
      height: "100%",
      background: C.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <p style={{ color: "#ff6b6b" }}> Erro: {error}</p>
    </div>
  );

  return (
    <div style={{
      height: "100%",
      background: C.bg,
      backgroundImage: `url(${bgJazz})`,  // ← imagem de fundo
      backgroundSize: "cover",
      backgroundPosition: "center bottom",
      backgroundRepeat: "no-repeat",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Georgia', serif",
      color: "#fff",
      overflow: "visible",
    }}>
      {/* header */}
      <div style={{
        padding: "80px 14px 10px 14px",
        flexShrink: 0,
        backdropFilter: "blur(4px)",
      }}>
        {/* avatar + tabs na mesma linha */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}>
          
          {/* Avatar isolado numa caixa rígida para não bloquear os botões */}
          <div style={{ width: "40px", height: "40px", flexShrink: 0, zIndex: 10 }}>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  rootBox: {
                      width: "40px",
                      height: "40px",
                  },
                  userButtonBox: {
                    width: "100%",
                    height: "100%",
                  },
                  userButtonTrigger: {
                    width: "40px",
                    height: "40px",
                    padding:"0",
                    margin:0,
                    boxShadow: "none",
                    borderRadius:"50%",
                  },
                  userButtonAvatarBox: {
                    width: "100%",
                    height: "100%",
                  }
                }
              }} 
            />
          </div>

          {/*tabs*/}
          <div style={{
            display: "flex",
            gap: "6px",
            flex: 1,
            justifyContent: "center",
            zIndex: 10, /* Garante que os cliques funcionam sempre */
          }}>
            {[
              ["home", "Inicio"],
              ["progressions", "Progressoes"],
              ["library", "Biblioteca"]
            ].map(([id, label]) => (
              <div key={id}
                onClick={() => setTab(id)} 
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxSizing: "border-box",
                  height: "40px",
                  padding: "4px 12px",
                  flex: 1,
                  background: tab === id ? "#c8d8b0" : "none",
                  border: "1px solid #c8d8b0",
                  borderRadius: "20px",
                  color: tab === id ? "#2e3d1f" : "#c8d8b0",
                  fontWeight: tab === id ? "bold" : "normal",
                  fontSize: "15px",
                  cursor: "pointer",
                  fontFamily: "SF Pro, sans-serif", 
                  transition: "all 0.2s",
                }}>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/*conteudo*/}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px"
      }}>

        {/*inicio*/}
        {tab === "home" && (
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
              letterspacing: "-0.14px",
            }}>
              Gerar progressão aleatória
            </button>

            <button onClick={() => generateProgression()} style={{
              ...btnStyle,
              marginTop: "12px",
              width: "100%",
              height: "48px",
              fontSize: "14px",
              background: "#fff",
              border: "none",
              background: "#2E4A2C",
              fontFamily: "Helvetica Now Display",
              color: "#fff",
              borderRadius: "12px",
              alignItems: "center",
              gap: "10px",
              padding: "10px 24px",
              fontWeight:"500",
              lineHeight:"140%",
              letterspacing: "-0.14px",
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
                    fontfamily: "Inter",
                    fontWeight:"400",
                    }}>
                    Progressões recentes
                  </span>
                  <button onClick={() => setTab("library")} style={{
                    background: "none",
                    border: "none",
                    color: "#fff",
                    fontfamily: "Inter",
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
        )}  {/* ← fim do tab home */}

        {/*progressions*/}
        {tab === "progressions" && (
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
                }}>
                  {/*tenho que por um css aqui para esconder a barra de horizontal de scrooll*/}
                  <style>{`div::-webkit-scrollbar { display: none; }`}</style>

                  {progression.chords.split("|").map((chord, i) => (
                    <div key={i} style={{
                      background: i === activeChordIndex ? "#FFFFFF" : "#A3AE8DCC",
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
                      color: i === activeChordIndex ? C.btn : "#FFFFFF",
                      boxShadow: i === activeChordIndex ? "0 4px 12px #ffffff4d" : "0 4px 6px #0000001a",
                      flexShrink: 0,
                      transition: "all 0.2s ease",
                    }}>
                      {chord.trim()}
                    </div>
                  ))}
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

                  {/* progressoes salvas */}
                {savedProgressions.length > 0 && (
                  <div style={{ 
                    marginTop: "16px" 
                    }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}>
                      <span style={{ 
                        fontSize: "19px",
                        fontWeight:"400",
                        color: "#fff" 
                        }}>
                        Progressões salvas
                      </span>
                      <button onClick={() => setTab("library")} style={{
                        background: "none", 
                        border: "none",
                        color: "#fff", 
                        fontSize: "19px", 
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
                        alignItems: "center",
                        background: C.bgCard,
                        border: `1px solid ${C.border}`,
                        borderRadius: "12px",
                        padding: "10px",
                        marginBottom: "10px",
                        gap: "10px",
                      }}>

                        {/* Botão play à esquerda */}
                        <button onClick={() => playChords(p.chords)} style={{
                          width: "44px", height: "44px", flexShrink: 0,
                          padding: 0, background: C.accent, border: "2px solid #c8d8b0",
                          borderRadius: "50%", color: "#fff", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "2px" }}>
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                        </button>

                        {/* Info central da pagina progressao */}
                        <div style={{ 
                          flex: 1, 
                          minWidth: 0 
                          }}>
                          <div style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "6px", 
                            marginBottom: "4px" 
                            }}>
                            <span style={{ 
                              fontSize: "13px" 
                              }}>🎵</span>
                            <span style={{ 
                              fontSize: "13px", 
                              fontWeight: "bold", 
                              color: "#fff" 
                              }}>{p.key}</span>
                            <span style={{ 
                              fontSize: "11px", 
                              color: C.muted 
                              }}>♩♩</span>
                            <span style={{ 
                              fontSize: "12px", 
                              color: C.muted 
                              }}>{p.structure}</span>
                          </div>
                          <div style={{ 
                            fontSize: "11px", 
                            color: "#A3AE8D", 
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
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>🎹</div>
                Ainda não geraste nenhuma progressão.<br />
                <span style={{ fontSize: "11px" }}>Vai ao Início e gera uma!</span>
              </div>
            )}
          </div>
        )}  {/* ← fim do tab progressions */}

        {/* Biblioteca */}
        {tab === "library" && (
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
        )}  {/* ← fim do tab library */}

      </div>
    </div>
  );
}

export default WebserviceTestForm;