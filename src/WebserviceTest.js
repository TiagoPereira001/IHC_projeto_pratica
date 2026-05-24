import { useEffect, useState } from "react";
import { useUser, UserButton } from "@clerk/clerk-react";

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
  width: "100%", padding: "10px",
  background: "#3f5230", border: "1px solid #5a7040",
  borderRadius: "8px", color: "#fff", fontSize: "13px",
  fontFamily: "'Georgia', serif",
};

const btnStyle = {
  padding: "10px", background: "#2e3d1f",
  color: "#fff", border: "none", borderRadius: "8px",
  cursor: "pointer", fontFamily: "'Georgia', serif",
};

const cardStyle = {
  background: "#3f5230", border: "1px solid #5a7040",
  borderRadius: "10px", padding: "14px", marginTop: "16px",
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
    <svg width="290" height="290" viewBox="0 0 290 290"
      style={{ display: "block", margin: "0 auto" }}>

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
              fontSize="10" fontWeight="bold" fill="#fff"
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
              fontSize="7.5" fill="#fff"
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
        fontSize="11" fontWeight="bold" fill="#c8d8b0">
        {selectedKey || "?"}
      </text>
    </svg>
  );
}

function WebserviceTestForm() {
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
  const [saved, setSaved] = useState(false); // ← estado do aviso de progressao criada

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
      const res = await fetch(`${BASE_URL}/api/chords/user/${email}`);
      const data = await res.json();
      setSavedProgressions(data);
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

      const res = await fetch(
        `${BASE_URL}/api/generate/${key}/${structure}/${modulation}`
      );

      const data = await res.json();

      setProgression(data);
      setAudioUrl(null);
      setSaved(true);                          // ← ativa o aviso
      setTimeout(() => setSaved(false), 3000); // ← desaparece após 3 segundos
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
          key: progression.key,
          structure: selectedStructure || "Random",
          modulation: selectedModulation || "Random"
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
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Georgia', serif",
      color: "#fff",
      overflow: "hidden",
    }}>
      {/* header */}
      <div style={{
        background: C.bgDark,
        padding: "12px 14px 0 14px",
        flexShrink: 0
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px"
        }}>
          {/* avatar do utilizador */}
          <UserButton afterSignOutUrl="/" />

          <span style={{
            fontSize: "18px",
            color: "#fff"
          }}>
            generative<strong>jazz</strong>
          </span>
        </div>

        {/*tabs*/}
        <div style={{ display: "flex" }}>
          {[
            ["home", "Inicio"],
            ["progressions", "Progressoes"],
            ["library", "Biblioteca"]
          ].map(([id, label]) => (
            <button key={id}
              onClick={() => setTab(id)} style={{
                flex: 1,
                padding: "7px 2px",
                background: "none",
                border: "none",
                borderBottom: tab === id ? "2px solid #fff" : "2px solid transparent",
                color: tab === id ? "#fff" : C.accent,
                fontWeight: tab === id ? "bold" : "normal",
                fontSize: "11px",
                cursor: "pointer",
                fontFamily: "'Georgia', serif",
              }}>
              {label}
            </button>
          ))}
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
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "4px" }}>
              <ChordWheel
                selectedKey={selectedKey}
                onSelectKey={setSelectedKey}
              />
            </div>

            {/* dropdowns lado a lado */}
            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: "11px",
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
                  fontSize: "11px",
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
            <button onClick={() => generateProgression("Random", "Random", "Random")} style={{
              ...btnStyle,
              marginTop: "12px",
              width: "100%",
              fontSize: "13px",
              background: C.bgCard,
              border: `1px solid ${C.border}`,
            }}>
              Gerar progressão aleatória
            </button>

            <button onClick={() => generateProgression()} style={{
              ...btnStyle,
              marginTop: "8px",
              width: "100%",
              fontSize: "13px",
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
                fontSize: "13px",
                textAlign: "center",
              }}>
                ✅ Progressão criada! Vai ao tab Progressões para ouvir.
              </div>
            )}

            {/* progressoes recentes */}
            {savedProgressions.length > 0 && (
              <div style={{ marginTop: "16px" }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px"
                }}>
                  <span style={{ fontSize: "12px", color: C.muted }}>
                    Progressões recentes
                  </span>
                  <button onClick={() => setTab("library")} style={{
                    background: "none", border: "none",
                    color: C.accent, fontSize: "11px", cursor: "pointer"
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
                    borderRadius: "10px",
                    padding: "8px 10px",
                    marginBottom: "8px",
                    gap: "8px",
                  }}>
                    {/* mini play */}
                    <div style={{
                      width: "36px", height: "36px", flexShrink: 0,
                      background: C.accent, borderRadius: "6px",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      gap: "1px",
                    }}>
                      <span style={{ fontSize: "12px" }}>▶</span>
                      <span style={{ fontSize: "8px", color: "#fff" }}>1:34</span>
                    </div>

                    {/* info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "12px" }}>🎵</span>
                        <span style={{ fontSize: "12px", fontWeight: "bold" }}>{p.key}</span>
                        <span style={{ fontSize: "10px", color: C.muted }}>♩♩</span>
                        <span style={{ fontSize: "11px", color: C.muted }}>{p.structure}</span>
                      </div>
                      <div style={{ fontSize: "10px", color: C.muted, marginTop: "2px" }}>
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
        )}  {/* ← fim do tab home */}

        {/*progressions*/}
        {tab === "progressions" && (
          <div>
            <p style={{
              fontSize: "12px",
              color: C.muted,
              margin: "0 0 10px 0"
            }}>Ultima progressao criada</p>

            {/* gera o resultado */}
            {progression ? (
              <div style={cardStyle}>
                <p style={{
                  fontSize: "11px",
                  color: C.muted,
                  margin: "0 0 6px 0"
                }}>
                  Tonalidade: <strong style={{ color: "#fff" }}>{progression.key}</strong>
                </p>

                {/* acordes como blocos invidiauis como pusemos no figma*/}
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  marginBottom: "12px"
                }}>
                  {progression.chords.split("|").map((chord, i) => (
                    <span key={i} style={{
                      background: C.bgDark,
                      border: `1px solid ${C.border}`,
                      borderRadius: "6px",
                      padding: "4px 8px",
                      fontSize: "12px",
                      color: "#fff",
                      fontFamily: "'Georgia', serif",
                    }}>
                      {chord.trim()}
                    </span>
                  ))}
                </div>

                <div style={{
                  display: "flex",
                  gap: "8px"
                }}>
                  <button onClick={convertToMp3} style={{
                    ...btnStyle,
                    flex: 1,
                    fontSize: "12px"
                  }}>
                    Ouvir
                  </button>
                  <button onClick={saveProgression} style={{
                    ...btnStyle,
                    flex: 1,
                    fontSize: "12px"
                  }}>
                    guardar
                  </button>
                </div>

                {/* Audio */}
                {audioUrl && (
                  <audio controls src={audioUrl}
                    style={{
                      width: "100%",
                      marginTop: "12px",
                      height: "36px",
                    }} />
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
                  <div style={{
                    width: "48px", height: "48px", flexShrink: 0,
                    background: C.accent, borderRadius: "8px",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    cursor: "pointer", gap: "2px",
                  }}>
                    <span style={{ fontSize: "16px" }}>▶</span>
                    <span style={{ fontSize: "9px", color: "#fff" }}>1:34</span>
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
                      <span style={{ fontSize: "11px", color: C.muted }}>♩♩</span>
                      <span style={{ fontSize: "12px", color: C.muted }}>
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