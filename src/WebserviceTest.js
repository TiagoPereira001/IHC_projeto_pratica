import { useEffect, useState, useRef } from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import bgJazz from "./assets/bg-jazz.png";
import HomeScreen from "./screens/HomeScreen";
import LibraryScreen from "./screens/LibraryScreen";
import ProgressionsScreen from "./screens/ProgressionsScreen";
import ProfileScreen from "./screens/ProfileScreen";

// Importar as  cores e estilos
import { C, selectStyle, btnStyle } from "./cores"; 

// Importar o componente da Roda
import ChordWheel from "./components/ChordWheel";

const BASE_URL = "https://genjazz-api.fly.dev";


function WebserviceTestForm() {
  const [tempo, setTempo] = useState(100); 
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
        setModulations(mData.map(m => m.modulation ?? m).filter(m => m !== "Chromatic"));

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
      // Encode dots as %2E because the backend route parsing can be sensitive
      const encodedEmail = encodeURIComponent(email).replace(/\./g, "%2E");
      const res = await fetch(`${BASE_URL}/api/chords/user/${encodedEmail}?t=${Date.now()}`);
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

      const res = await fetch(`${BASE_URL}/api/generate/${encodeURIComponent(key)}/${encodeURIComponent(structure)}/${encodeURIComponent(modulation)}`);
      
      if (!res.ok) {
        throw new Error(`Erro do servidor: ${res.status}`);
      }

      const data = await res.json();

      if (!data || !data.chords) {
        throw new Error("A API não retornou uma progressão válida.");
      }

      setProgression(data);
      setAudioUrl(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setActiveChordIndex(-1);
      setSaved(true);
      
      // Auto-save removido a pedido do utilizador para não guardar automaticamente
      /*
      if (email) {
        await fetch(`${BASE_URL}/api/chords`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            chords: data.chords,
            key: data.key || (key === "Random" ? data.key : key),
            structure: data.structure || (structure === "Random" ? data.structure : structure),
            modulation: data.modulation || (modulation === "Random" ? data.modulation : modulation)
          })
        });
        await loadSavedProgressions();
      }
      */

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
      const encoded = encodeURIComponent(progression.chords.trim());
      const res = await fetch(`${BASE_URL}/api/chords2mp3/${encoded}`);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Erro do servidor (Audio): ${res.status} ${errorData.error || ""}`);
      }

      const data = await res.json();
      setAudioUrl(`${BASE_URL}${data.mp3_url}`);
    } catch (err) {
      setError(`Erro ao gerar áudio: ${err.message}`);
    }
  };
  // -----------------------------
  // Tocar Áudio Instantaneamente
  // -----------------------------
  const playChords = async (chords) => {
    if (!chords) return;

    try {
      const encoded = encodeURIComponent(chords.trim());
      const res = await fetch(`${BASE_URL}/api/chords2mp3/${encoded}`);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Erro do servidor (Audio): ${res.status} ${errorData.error || ""}`);
      }

      const data = await res.json();

      // Toca a música diretamente em background sem precisar de um <audio> tag!
      const audio = new Audio(`${BASE_URL}${data.mp3_url}`);
      audio.play();
    } catch (err) {
      setError(`Erro ao tocar: ${err.message}`);
    }
  };


  const openInPlayer = async (p) => {
    if (!p || !p.chords) return;

    setProgression(p);       // Carrega a progressão escolhida para o ecrã
    setAudioUrl(null);       // Limpa o áudio da música anterior (se houver)
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveChordIndex(-1);
    setTab("progressions");  // Muda a tab automaticamente

    // Fetch do áudio para permitir Auto-Play
    try {
      const encoded = encodeURIComponent(p.chords.trim());
      const res = await fetch(`${BASE_URL}/api/chords2mp3/${encoded}`);
      
      if (!res.ok) {
        console.error(`Erro ao gerar áudio no auto-play: ${res.status}`);
        return;
      }

      const data = await res.json();
      setAudioUrl(`${BASE_URL}${data.mp3_url}`);
    } catch (err) {
      console.error("Erro no auto-play:", err);
    }
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
      const encoded = encodeURIComponent(progression.chords.trim());
      const res = await fetch(`${BASE_URL}/api/chords2mp3/${encoded}`);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Erro do servidor (Audio): ${res.status} ${errorData.error || ""}`);
      }

      const data = await res.json();
      setAudioUrl(`${BASE_URL}${data.mp3_url}`);
    } catch (err) {
      setError(`Erro ao gerar áudio: ${err.message}`);
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
      const val = parseFloat(e.target.value);
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  }
  

  // -----------------------------
  // Save progression
  // -----------------------------
  const saveProgression = async () => {
    if (!progression?.chords || !email) return;

    try {
      const res = await fetch(`${BASE_URL}/api/chords`, {
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

      if (!res.ok) {
        throw new Error(`Erro ao salvar: ${res.status}`);
      }

      await loadSavedProgressions();
      // setTab("library"); // Removido para permanecer no ecrã atual após salvar
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
      // O backend tem problemas com pontos no email na rota DELETE
      const encodedEmail = encodeURIComponent(email).replace(/\./g, "%2E");
      await fetch(`${BASE_URL}/api/chords/${encodedEmail}/${id}`, {
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

          {/* Profile Avatar Button */}
          <button 
            onClick={() => setTab("profile")}
            style={{ 
              width: "44px", 
              height: "44px", 
              flexShrink: 0, 
              zIndex: 10,
              cursor: "pointer",
              borderRadius: "50%",
              overflow: "hidden",
              border: `2px solid ${tab === "profile" ? "#fff" : "#c8d8b0"}`,
              boxSizing: "border-box",
              transition: "all 0.2s",
              boxShadow: tab === "profile" ? "0 0 12px rgba(255,255,255,0.5)" : "none",
              padding: 0,
              background: "none",
              display: "block"
            }}
          >
            <img 
              src={user?.imageUrl} 
              alt="Profile" 
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }} 
            />
          </button>

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
              ["progressions", "Progressões"],
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
        padding: tab === "profile" ? "0" : "16px"
      }}>

      {/*inicio*/}
        {tab === "home" && (
          <HomeScreen 
            selectedKey={selectedKey}
            setSelectedKey={setSelectedKey}
            selectedStructure={selectedStructure}
            setSelectedStructure={setSelectedStructure}
            structures={structures}
            selectedModulation={selectedModulation}
            setSelectedModulation={setSelectedModulation}
            modulations={modulations}
            generateProgression={generateProgression}
            saved={saved}
            savedProgressions={savedProgressions}
            setTab={setTab}
            openInPlayer={openInPlayer}
          />
        )}

        {/*progressions*/}
        {tab === "progressions" && (
          <ProgressionsScreen 
            progression={progression}
            scrollRef={scrollRef}
            activeChordIndex={activeChordIndex}
            togglePlay={togglePlay}
            isPlaying={isPlaying}
            formatTime={formatTime}
            currentTime={currentTime}
            duration={duration}
            handleSeek={handleSeek}
            audioRef={audioRef}
            audioUrl={audioUrl}
            handleTimeUpdate={handleTimeUpdate}
            handleLoadedMetadata={handleLoadedMetadata}
            handleEnded={handleEnded}
            setIsPlaying={setIsPlaying}
            saveProgression={saveProgression}
            savedProgressions={savedProgressions}
            setTab={setTab}
            playChords={playChords}
            openInPlayer={openInPlayer}
          />
        )} 
        {/* Biblioteca */}
        {tab === "library" && (
          <LibraryScreen 
            savedProgressions={savedProgressions} 
            openInPlayer={openInPlayer} 
            deleteProgression={deleteProgression} 
          />
        )}

        {/* Perfil */}
        {tab === "profile" && (
          <ProfileScreen setTab={setTab} />
        )}

      </div>
    </div>
  );
}

export default WebserviceTestForm;