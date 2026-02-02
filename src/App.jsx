import { useEffect, useMemo, useState } from "react";
import "./App.css";

const GOAL = 3000;

const toNum = (v) => {
  if (v === "" || v === null || v === undefined) return 0;
  const x = Number(String(v).replace(",", "."));
  return Number.isFinite(x) ? x : 0;
};

function roundTotal(r) {
  // TOTAL RONDA = canastas + puntosFichas
  return toNum(r.canastas) + toNum(r.puntosFichas);
}

export default function App() {
  // nombres VACÍOS, con placeholder
  const [nameA, setNameA] = useState("");
  const [nameB, setNameB] = useState("");

  // acumulados
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);

  // ronda actual
  const [rA, setRA] = useState({ canastas: "", puntosFichas: "" });
  const [rB, setRB] = useState({ canastas: "", puntosFichas: "" });

  // historial
  const [rounds, setRounds] = useState([]); // {n, addA, addB, totalA, totalB}

  const totalRoundA = useMemo(() => roundTotal(rA), [rA]);
  const totalRoundB = useMemo(() => roundTotal(rB), [rB]);

  const playerA = nameA.trim() || "Jugador 1";
  const playerB = nameB.trim() || "Jugador 2";

  const winner =
    scoreA >= GOAL && scoreB >= GOAL
      ? "Empate"
      : scoreA >= GOAL
      ? playerA
      : scoreB >= GOAL
      ? playerB
      : null;

  useEffect(() => {
    if (!winner) return;
    setTimeout(() => {
      alert(`🏆 Ganó ${winner} 🎉\n\nMeta: ${GOAL}\n${playerA}: ${scoreA}\n${playerB}: ${scoreB}`);
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner]);

  const partidasA = rounds.length;
  const partidasB = rounds.length;

  const handleChange = (setter, key, value) => {
    // permitir vacío y números
    if (value === "") {
      setter((p) => ({ ...p, [key]: "" }));
      return;
    }
    const cleaned = value.replace(",", ".");
    if (/^-?\d*\.?\d*$/.test(cleaned)) {
      setter((p) => ({ ...p, [key]: cleaned }));
    }
  };

  const saveRound = () => {
    const addA = totalRoundA;
    const addB = totalRoundB;

    const nextA = scoreA + addA;
    const nextB = scoreB + addB;

    const n = rounds.length + 1;

    setRounds((prev) => [
      {
        n,
        addA,
        addB,
        totalA: nextA,
        totalB: nextB,
      },
      ...prev,
    ]);

    setScoreA(nextA);
    setScoreB(nextB);

    // limpiar inputs (vacíos)
    setRA({ canastas: "", puntosFichas: "" });
    setRB({ canastas: "", puntosFichas: "" });
  };

  const undo = () => {
    if (rounds.length === 0) return;
    const [last, ...rest] = rounds;
    setRounds(rest);
    setScoreA((x) => x - last.addA);
    setScoreB((x) => x - last.addB);
  };

  const reset = () => {
    if (!confirm("¿Reiniciar todo el anotador?")) return;
    setNameA("");
    setNameB("");
    setScoreA(0);
    setScoreB(0);
    setRounds([]);
    setRA({ canastas: "", puntosFichas: "" });
    setRB({ canastas: "", puntosFichas: "" });
  };

  return (
    <div className="page">
      <header className="header">
        <div className="hTitle">🃏 Burako Anotador</div>
        <div className="hSub">2 columnas · partidas automáticas · ganador a {GOAL}</div>
      </header>

      <section className="sheet">
        {/* Encabezado jugadores */}
        <div className="row head">
          <div className="cell label"></div>
          <div className="cell col">
            <input
              className="nameInput"
              value={nameA}
              onChange={(e) => setNameA(e.target.value)}
              placeholder="Jugador 1"
            />
          </div>
          <div className="cell col">
            <input
              className="nameInput"
              value={nameB}
              onChange={(e) => setNameB(e.target.value)}
              placeholder="Jugador 2"
            />
          </div>
        </div>

        {/* PUNTOS */}
        <div className="row">
          <div className="cell label">PUNTOS</div>
          <div className="cell col big">{scoreA}</div>
          <div className="cell col big">{scoreB}</div>
        </div>

        {/* CANASTAS */}
        <div className="row">
          <div className="cell label">CANASTAS</div>
          <div className="cell col">
            <input
              className="numInput"
              value={rA.canastas}
              onChange={(e) => handleChange(setRA, "canastas", e.target.value)}
              placeholder="0"
              inputMode="numeric"
            />
          </div>
          <div className="cell col">
            <input
              className="numInput"
              value={rB.canastas}
              onChange={(e) => handleChange(setRB, "canastas", e.target.value)}
              placeholder="0"
              inputMode="numeric"
            />
          </div>
        </div>

        {/* PUNTOS FICHAS */}
        <div className="row">
          <div className="cell label">PUNTOS FICHAS</div>
          <div className="cell col">
            <input
              className="numInput"
              value={rA.puntosFichas}
              onChange={(e) => handleChange(setRA, "puntosFichas", e.target.value)}
              placeholder="0"
              inputMode="numeric"
            />
          </div>
          <div className="cell col">
            <input
              className="numInput"
              value={rB.puntosFichas}
              onChange={(e) => handleChange(setRB, "puntosFichas", e.target.value)}
              placeholder="0"
              inputMode="numeric"
            />
          </div>
        </div>

        {/* TOTAL */}
        <div className="row">
          <div className="cell label">TOTAL (ronda)</div>
          <div className="cell col total">{totalRoundA}</div>
          <div className="cell col total">{totalRoundB}</div>
        </div>

        {/* PARTIDAS */}
        <div className="row">
          <div className="cell label">PARTIDAS</div>
          <div className="cell col">{partidasA}</div>
          <div className="cell col">{partidasB}</div>
        </div>

        {/* GANADOR */}
        <div className="row winnerRow">
          <div className="cell label">GANADOR</div>
          <div className="cell col winnerCell" style={{ gridColumn: "2 / 4" }}>
            {winner ? (
              <span className="winnerText">🏆 {winner}</span>
            ) : (
              <span className="muted">A {GOAL} puntos</span>
            )}
          </div>
        </div>
      </section>

      <section className="actions">
        <button className="btn primary" onClick={saveRound}>
          Guardar ronda
        </button>
        <button className="btn ghost" onClick={undo} disabled={rounds.length === 0}>
          Deshacer
        </button>
        <button className="btn danger" onClick={reset}>
          Reiniciar
        </button>
      </section>

      <section className="history">
        <div className="historyTitle">Historial</div>
        {rounds.length === 0 ? (
          <div className="muted small">Todavía no guardaste ninguna ronda.</div>
        ) : (
          <div className="historyList">
            {rounds.map((r) => (
              <div className="histItem" key={r.n}>
                <div className="histTop">
                  <span className="pill">Partida {r.n}</span>
                  <span className="muted small">
                    {playerA}: +{r.addA} (={r.totalA}) · {playerB}: +{r.addB} (={r.totalB})
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="footer">Hecho para celular 📱 · simple como debe ser.</footer>
    </div>
  );
}
