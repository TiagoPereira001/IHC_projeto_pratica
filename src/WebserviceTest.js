import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

const BASE_URL = "https://genjazz-api.fly.dev";

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
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Chord Generator</h2>

      {/* TEXT LISTS */}
      <div>
        <h4>Available Keys</h4>
        <p>{keys.join(", ")}</p>

        <h4>Top 10 Structures</h4>
        <p>{structures.join(", ")}</p>

        <h4>Modulations</h4>
        <p>{modulations.join(", ")}</p>
      </div>

      {/* INPUTS */}
      <div>
        <input
          type="text"
          placeholder="Enter key (e.g. Cmaj)"
          value={selectedKey}
          onChange={e => setSelectedKey(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter structure"
          value={selectedStructure}
          onChange={e => setSelectedStructure(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter modulation"
          value={selectedModulation}
          onChange={e => setSelectedModulation(e.target.value)}
        />
      </div>

      {/* Generate */}
      <button onClick={generateProgression}>
        Generate
      </button>

      {/* Result */}
      {progression && (
        <div>
          <h4>Progression ({progression.key})</h4>
          <p>{progression.chords}</p>

          <button onClick={convertToMp3}>
            Convert to MP3
          </button>

          <button onClick={saveProgression}>
            Save
          </button>
        </div>
      )}

      {/* Audio */}
      {audioUrl && (
        <div>
          <h4>Playback</h4>
          <audio controls src={audioUrl} />
        </div>
      )}

      {/* Saved progressions */}
      <div style={{ marginTop: 20 }}>
        <h3>Saved Progressions</h3>

        <button onClick={loadSavedProgressions}>
          Refresh
        </button>

        {savedProgressions.map(p => (
          <div key={p.id} style={{ marginTop: 10 }}>
            <div>
              <b>{p.key}</b> — {p.chords}
            </div>

            <button onClick={() => deleteProgression(p.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WebserviceTestForm;