import { useEffect, useState, useRef } from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import bgJazz from "./assets/bg-jazz.png";

const BASE_URL = "https://genjazz-api.fly.dev";

// fazer a paleta de cores que esta no figma
const C = {
  bg: "#4a5e38",
  bgDark: "#3a4d2a",
  bgCard: "#3f5230",
  btn: "#2e3d1f",
  muted: "#c8d8b0",
  border: "#5a7040",
  accent: "#7aab6a",
};

const selectStyle = {
  width: "100%",
  height: "46px",
  padding: "11px 13px 11px 10px",
  borderRadius: "8px",
  border: "1px solid #5a7040",
  background: "#FDFDFD",
  color: "#1A1C1E",
  fontSize: "13px",
  fontfamily: "Helvetica",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const btnStyle = {
  padding: "10px", 
  background: "#2e3d1f",
  color: "#fff", 
  border: "none", 
  borderRadius: "8px",
  cursor: "pointer", 
  fontFamily: "'Georgia', serif",
};

const cardStyle = {
  background: "#3f5230", 
  border: "1px solid #5a7040",
  borderRadius: "10px", 
  padding: "14px", 
  marginTop: "16px",
};

// roda das tonalidades - chaves e cores
const WHEEL_KEYS = [
  { key: "C",  minor: "Am",  color: "#E74C3C" },
  { key: "G",  minor: "Em",  color: "#E67E22" },
  { key: "D",  minor: "Bm",  color: "#F39C12" },
  { key: "A",  minor: "F#m", color: "#F1C40F" },
  { key: "E",  minor: "C#m", color: "#2ECC71" },
  { key: "B",  minor: "G#m", color: "#1ABC9C" },
  { key: "Gb", minor: "Ebm", color: "#3498DB" },
  { key: "Db", minor: "Bbm", color: "#2980B9" },
  { key: "Ab", minor: "Fm",  color: "#9B59B6" },
  { key: "Eb", minor: "Cm",  color: "#8E44AD" },
  { key: "Bb", minor: "Gm",  color: "#E91E63" },
  { key: "F",  minor: "Dm",  color: "#FF5722" },
];

// funcao para calcular o path de um segmento da roda
function segmentPath(cx, cy, r1, r2, startAngle, endAngle) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const x1 = cx + r2 * Math.cos(toRad(startAngle));
  const y1 = cy + r2 * Math.sin(toRad(startAngle));
  const x2 = cx + r2 * Math.cos(toRad(endAngle));
  const y2 = cy + r2 * Math.sin(toRad(endAngle));
  const x3 = cx + r1 * Math.cos(toRad(endAngle));
  const y3 = cy + r1 * Math.sin(toRad(endAngle));
  const x4 = cx + r1 * Math.cos(toRad(startAngle));
  const y4 = cy + r1 * Math.sin(toRad(startAngle));
  return `M ${x1} ${y1} A ${r2} ${r2} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${r1} ${r1} 0 0 0 ${x4} ${y4} Z`;
}

// funcao para calcular o centro de um segmento 
function segmentCenter(cx, cy, r, angle) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(toRad(angle)),
    y: cy + r * Math.sin(toRad(angle)),
  };
}

// componente da roda das tonalidades
function ChordWheel({ selectedKey, onSelectKey }) {
  const cx = 145, cy = 145;
  const outerR = 130, midR = 88, innerR = 52;
  const startOffset = -90; // começa no topo

  return (
    <svg width="115%" height="auto" viewBox="0 0 290 290"
      style={{ 
        display: "block", 
        margin: "0 auto" 
        }}>

      {WHEEL_KEYS.map((item, i) => {
        const startAngle = startOffset + i * 30;
        const endAngle   = startOffset + (i + 1) * 30;
        const midAngle   = startOffset + i * 30 + 15;
        const isSelected = selectedKey === item.key;

        const outerCenter = segmentCenter(cx, cy, (outerR + midR) / 2, midAngle);
        const innerCenter = segmentCenter(cx, cy, (midR + innerR) / 2, midAngle);

        return (
          <g key={item.key} onClick={() => onSelectKey(item.key)}
            style={{ cursor: "pointer" }}>

            {/* segmento exterior - tonalidade major */}
            <path
              d={segmentPath(cx, cy, midR, outerR, startAngle, endAngle)}
              fill={item.color}
              opacity={isSelected ? 1 : 0.72}
              stroke="#3a4d2a" strokeWidth="1.5"
            />
            <text x={outerCenter.x} y={outerCenter.y}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="20" fontWeight="bold" fill="#fff"
              style={{ pointerEvents: "none" }}>
              {item.key}
            </text>

            {/* segmento interior - tonalidade minor */}
            <path
              d={segmentPath(cx, cy, innerR, midR, startAngle, endAngle)}
              fill={item.color}
              opacity={isSelected ? 0.6 : 0.35}
              stroke="#3a4d2a" strokeWidth="1"
            />
            <text x={innerCenter.x} y={innerCenter.y}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="15" fill="#fff"
              style={{ pointerEvents: "none" }}>
              {item.minor}
            </text>
          </g>
        );
      })}

      {/* circulo central */}
      <circle cx={cx} cy={cy} r={innerR}
        fill="#3a4d2a" stroke="#5a7040" strokeWidth="1.5" />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
        fontSize="15" fontWeight="bold" fill="#c8d8b0">
        {selectedKey || "?"}
      </text>
    </svg>
  );
}

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
                  fontFamily: "SF Pro, sans-serif", /* Corrigido de fontfamily para fontFamily */
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
              background: "#2e3d1f",
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
              Gerar progressao
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
                <div style={{
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
                      background: i === activeChordIndex ? "#FFFFFF" : C.muted,
                      minWidth: "80px",
                      height: "75px",
                      padding:"15px 20px",
                      borderRadius: "12px",
                      display: "flex",
                      fontSize: "14px",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      color: C.btn,
                      boxShadow: i === activeChordIndex ? "0 4px 12px rgba(255,255,255,0.3)" : "0 4px 6px rgba(0,0,0,0.1)",
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
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.3)",
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
                  <div style={{ marginTop: "16px" }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px"
                    }}>
                      <span style={{ 
                        fontSize: "12px", 
                        color: "#fff" 
                        }}>
                        Progressões salvas
                      </span>
                      <button onClick={() => setTab("library")} style={{
                        background: "none", 
                        border: "none",
                        color: "#fff", 
                        fontSize: "11px", 
                        cursor: "pointer"
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
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
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
                            color: C.muted 
                            }}>
                            Modulação: {p.modulation} • {new Date(p.created_at).toLocaleDateString("pt-PT", {
                              day: "2-digit", month: "2-digit",
                              hour: "2-digit", minute: "2-digit"
                            })}
                          </div>
                        </div>

                        {/* seta */}
                        <span style={{ color: C.muted, fontSize: "14px" }}>›</span>
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