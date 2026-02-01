import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const STORAGE_KEY = "burako_anotador_simple_v2";

const defaultState = {
  gameName: "Burako en familia",
  targetScore: 3000,
  teams: [
    { id: "A", name: "Nosotros" },
    { id: "B", name: "Ellos" },
  ],
  rounds: [],
};

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function Confetti({ run }) {
  // Confeti ultra simple (sin libs)
  const pieces = useMemo(() => {
    const count = 70;
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        dur: 1.8 + Math.random() * 1.2,
        size: 6 + Math.random() * 10,
        rot: Math.random() * 360,
        drift: -20 + Math.random() * 40,
        opacity: 0.7 + Math.random() * 0.3,
      });
    }
    return arr;
  }, [run]);

  if (!run) return null;

  return (
    <div className="confetti">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confettiPiece"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            transform: `rotate(${p.rot}deg)`,
            opacity: p.opacity,
            "--drift": `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [state, setState] = useState(defaultState);
  const [draftA, setDraftA] = useState("");
  const [draftB, setDraftB] = useState("");
  const [note, setNote] = useState("");
  const [showWin, setShowWin] = useState(false);
  const [confettiRun, setConfettiRun] = useState(0);

  const inputARef = useRef(null);

  // Load
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Save
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Auto focus on first input (mobile keyboard)
  useEffect(() => {
    // pequeño delay para que renderice
    const t = setTimeout(() => inputARef.current?.focus?.(), 200);
    return () => clearTimeout(t);
  }, []);

  const totals = useMemo(() => {
    let A = 0;
    let B = 0;
    for (const r of state.rounds) {
      A += Number(r.scores?.A ?? 0);
      B += Number(r.scores?.B ?? 0);
    }
    return { A, B };
  }, [state.rounds]);

  const winner = useMemo(() => {
    const target = Number(state.targetScore ?? 3000);
    const aWon = totals.A >= target;
    const bWon = totals.B >= target;
    if (!aWon && !bWon) return null;

    if (aWon && bWon) {
      if (totals.A === totals.B) return { label: "Empate técnico 🤝", value: totals.A, id: "TIE" };
      return totals.A > totals.B
        ? { label: `${state.teams[0].name} 🏆`, value: totals.A, id: "A" }
        : { label: `${state.teams[1].name} 🏆`, value: totals.B, id: "B" };
    }

    return aWon
      ? { label: `${state.teams[0].name} 🏆`, value: totals.A, id: "A" }
      : { label: `${state.teams[1].name} 🏆`, value: totals.B, id: "B" };
  }, [totals, state.targetScore, state.teams]);

  // Cuando aparece ganador => abrir pantalla victoria + confeti
  useEffect(() => {
    if (winner) {
      setShowWin(true);
      setConfettiRun((x) => x + 1);
    }
  }, [winner]);

  function renameTeam(teamId, name) {
    setState((s) => ({
      ...s,
      teams: s.teams.map((t) => (t.id === teamId ? { ...t, name } : t)),
    }));
  }

  function addRound() {
    const a = Number(draftA || 0);
    const b = Number(draftB || 0);

    setState((s) => ({
      ...s,
      rounds: [
        ...s.rounds,
        {
          id: uid(),
          date: new Date().toISOString(),
          scores: { A: a, B: b },
          note: note.trim(),
        },
      ],
    }));

    setDraftA("");
    setDraftB("");
    setNote("");

    // Re-focus para celular
    setTimeout(() => inputARef.current?.focus?.(), 50);
  }

  function deleteRound(roundId) {
    setState((s) => ({
      ...s,
      rounds: s.rounds.filter((r) => r.id !== roundId),
    }));
  }

  function resetAll() {
    if (!confirm("¿Seguro que querés reiniciar TODO (historial incluido)?")) return;
    localStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
    setDraftA("");
    setDraftB("");
    setNote("");
    setShowWin(false);
    setTimeout(() => inputARef.current?.focus?.(), 200);
  }

  function newRoundOnly() {
    // Solo reinicia inputs
    setDraftA("");
    setDraftB("");
    setNote("");
    setShowWin(false);
    setTimeout(() => inputARef.current?.focus?.(), 200);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") addRound();
  }

  const progressA = useMemo(() => clamp((totals.A / state.targetScore) * 100, 0, 100), [totals.A, state.targetScore]);
  const progressB = useMemo(() => clamp((totals.B / state.targetScore) * 100, 0, 100), [totals.B, state.targetScore]);

  return (
    <div className="page">
      {/* Pantalla de victoria */}
      {showWin && winner ? (
        <div className="winOverlay">
          <Confetti run={confettiRun} />

          <div className="winCard">
            <div className="winTitle">🎉 ¡Partida terminada!</div>
            <div className="winWinner">{winner.label}</div>
            <div className="winScore">{winner.value} pts</div>

            <div className="winButtons">
              <button className="btn primary" onClick={newRoundOnly}>
                Nueva partida (seguir)
              </button>
              <button className="btn" onClick={() => setShowWin(false)}>
                Ver historial
              </button>
              <button className="btn danger" onClick={resetAll}>
                Reiniciar todo
              </button>
            </div>

            <div className="mutedSmall" style={{ marginTop: 12 }}>
              Tip: “Nueva partida” deja todo listo para seguir anotando sin borrar nada.
            </div>
          </div>
        </div>
      ) : null}

      <header className="header">
        <div>
          <h1>🃏 {state.gameName}</h1>
          <p className="subtitle">2 vs 2 clásico • Ustedes calculan, acá solo se suma</p>
        </div>
        <button className="btn danger" onClick={resetAll}>
          Reiniciar todo
        </button>
      </header>

      <main className="grid">
        {/* Marcador */}
        <section className="card">
          <h2>🏁 Marcador</h2>

          <div className="winner">
            <b>{state.teams[0].name}</b>: {totals.A} pts
            <div className="progress">
              <div className="bar" style={{ width: `${progressA}%` }} />
            </div>

            <div style={{ height: 10 }} />

            <b>{state.teams[1].name}</b>: {totals.B} pts
            <div className="progress">
              <div className="bar" style={{ width: `${progressB}%` }} />
            </div>
          </div>

          <div className="muted" style={{ marginTop: 10 }}>
            Objetivo: <b>{state.targetScore}</b> puntos
          </div>

          {winner ? (
            <div className="winner" style={{ marginTop: 12 }}>
              🏆 Ganó: <b>{winner.label}</b>
            </div>
          ) : (
            <div className="muted" style={{ marginTop: 12 }}>
              Seguimos… 😏
            </div>
          )}

          {winner ? (
            <button className="btn primary" style={{ marginTop: 12 }} onClick={() => setShowWin(true)}>
              Ver pantalla de victoria
            </button>
          ) : null}
        </section>

        {/* Equipos */}
        <section className="card">
          <h2>👥 Equipos</h2>

          <div className="players">
            <div className="playerRow">
              <input className="playerName" value={state.teams[0].name} onChange={(e) => renameTeam("A", e.target.value)} />
              <div className="badge">Equipo A</div>
            </div>

            <div className="playerRow">
              <input className="playerName" value={state.teams[1].name} onChange={(e) => renameTeam("B", e.target.value)} />
              <div className="badge">Equipo B</div>
            </div>
          </div>
        </section>

        {/* Nueva partida */}
        <section className="card full">
          <h2>➕ Nueva partida</h2>

          <div className="roundTable">
            <div className="scoreRow">
              <div className="scoreName">{state.teams[0].name}</div>
              <input
                ref={inputARef}
                type="number"
                inputMode="numeric"
                placeholder="Puntos de esta partida"
                value={draftA}
                onChange={(e) => setDraftA(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="scoreRow">
              <div className="scoreName">{state.teams[1].name}</div>
              <input
                type="number"
                inputMode="numeric"
                placeholder="Puntos de esta partida"
                value={draftB}
                onChange={(e) => setDraftB(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nota opcional (corte, muerto, canastas...)" rows={2} />

          <div className="actions">
            <button className="btn primary" onClick={addRound}>
              Guardar partida
            </button>
            <button className="btn" onClick={newRoundOnly}>
              Limpiar inputs
            </button>
          </div>
        </section>

        {/* Historial */}
        <section className="card full">
          <h2>📜 Historial</h2>

          {state.rounds.length === 0 ? (
            <p className="muted">Todavía no hay partidas cargadas.</p>
          ) : (
            <div className="history">
              {state.rounds
                .slice()
                .reverse()
                .map((r, idx) => (
                  <div key={r.id} className="roundCard">
                    <div className="roundHeader">
                      <div>
                        <b>Partida #{state.rounds.length - idx}</b>{" "}
                        <span className="mutedSmall">({new Date(r.date).toLocaleString()})</span>
                        {r.note ? <div className="note">📝 {r.note}</div> : null}
                      </div>
                      <button className="iconBtn" onClick={() => deleteRound(r.id)} title="Borrar partida">
                        🗑
                      </button>
                    </div>

                    <div className="roundScores">
                      <div className="pill">
                        <span className="pillName">{state.teams[0].name}</span>
                        <span className={`pillScore ${(r.scores?.A ?? 0) >= 0 ? "pos" : "neg"}`}>{r.scores?.A ?? 0}</span>
                      </div>
                      <div className="pill">
                        <span className="pillName">{state.teams[1].name}</span>
                        <span className={`pillScore ${(r.scores?.B ?? 0) >= 0 ? "pos" : "neg"}`}>{r.scores?.B ?? 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">Burako 2 vs 2 clásico 🃏 | Hecho para celular | Vercel ready</footer>
    </div>
  );
}
