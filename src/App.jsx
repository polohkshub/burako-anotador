import React, { useMemo, useState } from "react";
import "./App.css";

const GOAL = 3000;

const emptyRound = () => ({
  j1: { canastas: 0, puntosFichas: 0 },
  j2: { canastas: 0, puntosFichas: 0 },
});

function clampNumber(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return 0;
  return n;
}

function calcRoundTotal(player) {
  // total por ronda = canastas + puntos fichas
  return clampNumber(player.canastas) + clampNumber(player.puntosFichas);
}

export default function App() {
  const [player1Name, setPlayer1Name] = useState("JUGADOR 1");
  const [player2Name, setPlayer2Name] = useState("JUGADOR 2");

  const [round, setRound] = useState(emptyRound());
  const [rounds, setRounds] = useState([]); // historial

  const totals = useMemo(() => {
    let j1 = 0;
    let j2 = 0;

    for (const r of rounds) {
      j1 += r.j1.total;
      j2 += r.j2.total;
    }

    return { j1, j2 };
  }, [rounds]);

  const winner = useMemo(() => {
    const w1 = totals.j1 >= GOAL;
    const w2 = totals.j2 >= GOAL;

    if (w1 && w2) {
      if (totals.j1 === totals.j2) return { tie: true };
      return totals.j1 > totals.j2
        ? { name: player1Name, score: totals.j1 }
        : { name: player2Name, score: totals.j2 };
    }

    if (w1) return { name: player1Name, score: totals.j1 };
    if (w2) return { name: player2Name, score: totals.j2 };
    return null;
  }, [totals, player1Name, player2Name]);

  const currentRoundTotals = useMemo(() => {
    const j1Total = calcRoundTotal(round.j1);
    const j2Total = calcRoundTotal(round.j2);
    return { j1Total, j2Total };
  }, [round]);

  function updateRound(side, field, value) {
    setRound((prev) => ({
      ...prev,
      [side]: {
        ...prev[side],
        [field]: value,
      },
    }));
  }

  function addRound() {
    const j1 = {
      canastas: clampNumber(round.j1.canastas),
      puntosFichas: clampNumber(round.j1.puntosFichas),
    };
    const j2 = {
      canastas: clampNumber(round.j2.canastas),
      puntosFichas: clampNumber(round.j2.puntosFichas),
    };

    const newRound = {
      id: crypto?.randomUUID?.() ?? String(Date.now()),
      date: new Date().toISOString(),
      j1: { ...j1, total: calcRoundTotal(j1) },
      j2: { ...j2, total: calcRoundTotal(j2) },
    };

    setRounds((prev) => [newRound, ...prev]);
    setRound(emptyRound());
  }

  function removeRound(id) {
    setRounds((prev) => prev.filter((r) => r.id !== id));
  }

  function resetAll() {
    if (!confirm("¿Seguro que querés reiniciar todo?")) return;
    setRounds([]);
    setRound(emptyRound());
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="logo">♠</div>
          <div>
            <h1>Burako Anotador</h1>
            <p>Dos columnas, rondas y ganador automático</p>
          </div>
        </div>

        <div className="goal">
          <span className="pill">🏁 Ganador a</span>
          <span className="goalNumber">{GOAL}</span>
        </div>
      </header>

      {winner && (
        <div className="winnerCard">
          {winner.tie ? (
            <>
              <div className="winnerTitle">🤝 ¡Empate!</div>
              <div className="winnerText">
                Los dos llegaron a {GOAL}. Esto se pone picante 😏
              </div>
            </>
          ) : (
            <>
              <div className="winnerTitle">🏆 ¡GANADOR!</div>
              <div className="winnerName">{winner.name}</div>
              <div className="winnerText">Llegó a {winner.score} puntos</div>
            </>
          )}
        </div>
      )}

      <section className="names">
        <div className="nameBox">
          <label>Nombre Jugador 1</label>
          <input
            value={player1Name}
            onChange={(e) => setPlayer1Name(e.target.value)}
            placeholder="Jugador 1"
          />
        </div>
        <div className="nameBox">
          <label>Nombre Jugador 2</label>
          <input
            value={player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
            placeholder="Jugador 2"
          />
        </div>
      </section>

      <section className="board">
        <div className="colHead">
          <div className="colTitle">{player1Name}</div>
          <div className="colTitle">{player2Name}</div>
        </div>

        <div className="scoreRow">
          <div className="scoreBox">
            <div className="scoreLabel">PUNTOS</div>
            <div className="scoreValue">{totals.j1}</div>
            <div className="scoreSub">
              faltan <b>{Math.max(0, GOAL - totals.j1)}</b>
            </div>
          </div>

          <div className="scoreBox">
            <div className="scoreLabel">PUNTOS</div>
            <div className="scoreValue">{totals.j2}</div>
            <div className="scoreSub">
              faltan <b>{Math.max(0, GOAL - totals.j2)}</b>
            </div>
          </div>
        </div>

        <div className="roundCard">
          <div className="roundHeader">
            <div>
              <div className="roundTitle">➕ Cargar ronda</div>
              <div className="roundHint">
                El total de la ronda se suma al acumulado.
              </div>
            </div>

            <div className="roundButtons">
              <button className="btn ghost" onClick={resetAll}>
                Reiniciar
              </button>
              <button className="btn primary" onClick={addRound}>
                Guardar ronda
              </button>
            </div>
          </div>

          <div className="grid2">
            <div className="playerCard">
              <div className="playerCardTitle">{player1Name}</div>

              <div className="field">
                <label>CANASTAS (puntos)</label>
                <input
                  type="number"
                  value={round.j1.canastas}
                  onChange={(e) => updateRound("j1", "canastas", e.target.value)}
                />
              </div>

              <div className="field">
                <label>PUNTOS FICHAS</label>
                <input
                  type="number"
                  value={round.j1.puntosFichas}
                  onChange={(e) =>
                    updateRound("j1", "puntosFichas", e.target.value)
                  }
                />
              </div>

              <div className="totalLine">
                TOTAL RONDA: <b>{currentRoundTotals.j1Total}</b>
              </div>
            </div>

            <div className="playerCard">
              <div className="playerCardTitle">{player2Name}</div>

              <div className="field">
                <label>CANASTAS (puntos)</label>
                <input
                  type="number"
                  value={round.j2.canastas}
                  onChange={(e) => updateRound("j2", "canastas", e.target.value)}
                />
              </div>

              <div className="field">
                <label>PUNTOS FICHAS</label>
                <input
                  type="number"
                  value={round.j2.puntosFichas}
                  onChange={(e) =>
                    updateRound("j2", "puntosFichas", e.target.value)
                  }
                />
              </div>

              <div className="totalLine">
                TOTAL RONDA: <b>{currentRoundTotals.j2Total}</b>
              </div>
            </div>
          </div>
        </div>

        <section className="history">
          <div className="historyHeader">
            <h2>📜 Rondas</h2>
            <div className="small">
              {rounds.length} {rounds.length === 1 ? "ronda" : "rondas"}
            </div>
          </div>

          {rounds.length === 0 ? (
            <div className="empty">Todavía no hay rondas guardadas.</div>
          ) : (
            <div className="roundList">
              {rounds.map((r, idx) => (
                <div className="roundItem" key={r.id}>
                  <div className="roundIndex">#{rounds.length - idx}</div>

                  <div className="roundCols">
                    <div className="roundCol">
                      <div className="roundColName">{player1Name}</div>
                      <div className="roundStat">
                        Canastas: <b>{r.j1.canastas}</b>
                      </div>
                      <div className="roundStat">
                        Fichas: <b>{r.j1.puntosFichas}</b>
                      </div>
                      <div className="roundTotal">
                        Total: <b>{r.j1.total}</b>
                      </div>
                    </div>

                    <div className="roundCol">
                      <div className="roundColName">{player2Name}</div>
                      <div className="roundStat">
                        Canastas: <b>{r.j2.canastas}</b>
                      </div>
                      <div className="roundStat">
                        Fichas: <b>{r.j2.puntosFichas}</b>
                      </div>
                      <div className="roundTotal">
                        Total: <b>{r.j2.total}</b>
                      </div>
                    </div>
                  </div>

                  <button className="btn danger" onClick={() => removeRound(r.id)}>
                    Borrar
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>

      <footer className="footer">
        Hecho con ❤️ para anotar Burako sin quilombos.
      </footer>
    </div>
  );
}
