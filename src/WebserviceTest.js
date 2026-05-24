import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

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
  const generateProgression = async () => {
    try {
      const key = selectedKey || "Random";
      const structure = selectedStructure || "Random";
      const modulation = selectedModulation || "Random";

      const res = await fetch(
        `${BASE_URL}/api/generate/${key}/${structure}/${modulation}`
      );

      const data = await res.json();

      setProgression(data);
      setAudioUrl(null);
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
          <span style={{
            fontSize: "18px",
            color: "#fff"
          }}>
            generative<strong>jazz</strong>
          </span>
        </div>

        {/*tabs*/}
        <div style={{ display: "flex" }}>
          {[["home", "Inicio"], ["library", "Biblioteca"]].map(([id, label]) => (
            <button key={id}
              onClick={() => setTab(id)} style={{
                flex: 1,
                padding: "8px 4px",
                background: "none",
                border: "none",
                borderBottom: tab === id ? "2px solid #fff" : "2px solid transparent",
                color: tab === id ? "#fff" : C.accent,
                fontWeight: tab === id ? "bold" : "normal",
                fontSize: "13px",
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
            <p style={{
              fontSize: "11px",
              color: C.muted,
              margin: "0 0 4px 0"
            }}>Tonalidade</p>
            <select value={selectedKey}
              onChange={e => setSelectedKey(e.target.value)}
              style={selectStyle}>
              {keys.map(k => <option key={k} value={k}>{k}</option>)}
            </select>

            <p style={{
              fontSize: "11px",
              color: C.muted,
              margin: "12px 0 4px 0"
            }}>Estrutura</p>
            <select value={selectedStructure}
              onChange={e => setSelectedStructure(e.target.value)}
              style={selectStyle}>
              {structures.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <p style={{
              fontSize: "11px",
              color: C.muted,
              margin: "12px 0 4px 0"
            }}>Modulação</p>
            <select value={selectedModulation}
              onChange={e => setSelectedModulation(e.target.value)}
              style={selectStyle}>
              {modulations.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            <button onClick={generateProgression} style={{
              ...btnStyle,
              marginTop: "16px",
              width: "100%",
              fontSize: "14px"
            }}>
              Gerar progressao
            </button>

            {/* gera o resultado */}
            {progression && (
              <div style={cardStyle}>
                <p style={{
                  fontSize: "11px",
                  color: C.muted,
                  margin: "0 0 6px 0"
                }}>
                  Tonalidade: <strong style={{ color: "#fff" }}>{progression.key}</strong>
                </p>
                <p style={{
                  fontSize: "13px",
                  wordBreak: "break-all",
                  lineHeight: "1.7",
                  margin: "0 0 12px 0"
                }}>
                  {progression.chords}
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
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
            )}
          </div>
        )}

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
                color: "#fff" }}>
                Biblioteca
              </span>
              <span style={{ 
                fontSize: "12px", 
                color: C.muted }}>
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
                <p style={{ 
                  margin: "0 0 4px 0" 
                  }}>Ainda não tens progressões guardadas.</p>
                <p style={{ 
                  margin: 0, 
                  fontSize: "11px" 
                  }}>Gera e guarda uma na tab Início!</p>
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
                    <span style={{ 
                      fontSize: "16px" 
                      }}>▶</span>
                    <span style={{ 
                      fontSize: "9px", 
                      color: "#fff" 
                      }}>1:34</span>
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
                      <span style={{ 
                        fontSize: "13px" 
                        }}>🎵</span>
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
                    <div style={{ 
                      fontSize: "11px", 
                      color: C.muted 
                      }}>
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
        )}
      </div>
    </div>
  );
}

export default WebserviceTestForm;