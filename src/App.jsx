import React, { useMemo, useState } from "react";
import "./App.css";

const GOAL = 3000;

function clampInt(v) {
  if (v === "" || v === null || v === undefined) return 0;
  const n = parseInt(String(v).replace(/[^\d-]/g, ""), 10);
  return Number.isNaN(n) ? 0 : n;
}

function format(n) {
  return new Intl.NumberFormat("es-AR").format(n);
}

export default function App() {
  const [teamAName, setTeamAName] = useState("JUGADORES 1");
  const [teamBName, setTeamBName] = useState("JUGADORES 2");

  // Inputs de la ronda actual
  const [aCanastas, setACanastas] = useState("");
  const [aFichas, setAFichas] = useState("");
  const [bCanastas, setBCanastas] = useState("");
  const [bFichas, setBFichas] = useState("");

  // Historial de partidas
  const [rounds, setRounds] = useState([]);

  const totals = useMemo(() => {
    const a = rounds.reduce((acc, r) => acc + r.aTotal, 0);
    const b = rounds.reduce((acc, r) => acc + r.bTotal, 0);
    return { a, b };
  }, [rounds]);

  const current = useMemo(() => {
    const aT = clampInt(aCanastas) + clampInt(aFichas);
    const bT = clampInt(bCanastas) + clampInt(bFichas);
    return { aT, bT };
  }, [aCanastas, aFichas, bCanastas, bFichas]);

  const winner =
    totals.a >= GOAL && totals.a > totals.b
      ? "A"
      : totals.b >= GOAL && totals.b > totals.a
      ? "B"
      : null;

  function addRound() {
    const aC = clampInt(aCanastas);
    const aF = clampInt(aFichas);
    const bC = clampInt(bCanastas);
    const bF = clampInt(bFichas);

    const aTotal = aC + aF;
    const bTotal = bC + bF;

    // Evitar guardar rondas vacías
    if (aC === 0 && aF === 0 && bC === 0 && bF === 0) return;

    setRounds((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        aCanastas: aC,
        aFichas: aF,
        bCanastas: bC,
        bFichas: bF,
        aTotal,
        bTotal,
      },
    ]);

    // limpiar inputs
    setACanastas("");
    setAFichas("");
    setBCanastas("");
    setBFichas("");
  }

  function undoLast() {
    setRounds((prev) => prev.slice(0, -1));
  }

  function resetAll() {
    if (!confirm("¿Reiniciar todo el anotador?")) return;
    setRounds([]);
    setACanastas("");
    setAFichas("");
    setBCanastas("");
    setBFichas("");
  }

  return (
    <div className="page">
      <div className="app">
        <header className="header">
          <div>
            <h1>🃏 Anotador Burako</h1>
            <p className="sub">
              2vs2 clásico · Ganador a <b>{GOAL}</b>
            </p>
          </div>
          <button className="btn ghost" onClick={resetAll}>
            Reiniciar
          </button>
        </header>

        <section className="scoreboard">
          <div className={`teamCard ${winner === "A" ? "win" : ""}`}>
            <input
              className="teamName"
              value={teamAName}
              onChange={(e) => setTeamAName(e.target.value)}
            />
            <div className="label">PUNTOS</div>
            <div className="points">{format(totals.a)}</div>
            <div className="progress">
              <div
                className="bar"
                style={{ width: `${Math.min(100, (totals.a / GOAL) * 100)}%` }}
              />
            </div>
          </div>

          <div className={`teamCard ${winner === "B" ? "win" : ""}`}>
            <input
              className="teamName"
              value={teamBName}
              onChange={(e) => setTeamBName(e.target.value)}
            />
            <div className="label">PUNTOS</div>
            <div className="points">{format(totals.b)}</div>
            <div className="progress">
              <div
                className="bar"
                style={{ width: `${Math.min(100, (totals.b / GOAL) * 100)}%` }}
              />
            </div>
          </div>
        </section>

        <section className="round">
          <div className="roundTitle">
            <h2>PARTIDAS</h2>
            <div className="roundActions">
              <button className="btn ghost" onClick={undoLast} disabled={rounds.length === 0}>
                Deshacer última
              </button>
            </div>
          </div>
