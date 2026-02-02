import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const GOAL = 3000;

function toNumber(value) {
  if (value === "" || value === null || value === undefined) return 0;
  const n = Number(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

export default function App() {
  // Nombres (vacíos para escribir directo)
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");

  // Acumulados
  const [total1, setTotal1] = useState(0);
  const [total2, setTotal2] = useState(0);

  // Inputs ronda (vacíos para escribir directo, sin "0" molesto)
  const [can1, setCan1] = useState("");
  const [can2, setCan2] = useState("");

  const [fich1, setFich1] = useState("");
  const [fich2, setFich2] = useState("");

  // Historial rondas
  const [history, setHistory] = useState([]);

  // Cálculos ronda
  const roundTotal1 = useMemo(() => toNumber(can1) + toNumber(fich1), [can1, fich1]);
  const roundTotal2 = useMemo(() => toNumber(can2) + toNumber(fich2), [can2, fich2]);

  const winner = useMemo(() => {
    if (total1 >= GOAL && total2 >= GOAL) return "Empate";
    if (total1 >= GOAL) return name1?.trim() || "Jugador 1";
    if (total2 >= GOAL) return name2?.trim() || "Jugador 2";
    return "";
  }, [total1, total2, name1, name2]);

  // Guardar ronda
  function saveRound() {
    const n1 = roundTotal1;
    const n2 = roundTotal2;

    // si está todo vacío, no guardar
    if (n1 === 0 && n2 === 0 && String(can1) === "" && String(can2) === "" && String(fich1) === "" && String(fich2) === "") {
      return;
    }

    const nextTotal1 = total1 + n1;
    const nextTotal2 = total2 + n2;

    const item = {
      id: Date.now(),
      r: history.length + 1,
      can1: toNumber(can1),
      can2: toNumber(can2),
      fich1: toNumber(fich1),
      fich2: toNumber(fich2),
      round1: n1,
      round2: n2,
      acc1: nextTotal1,
      acc2: nextTotal2,
    };

    setHistory([item, ...history]);
    setTotal1(nextTotal1);
    setTotal2(nextTotal2);

    // limpiar inputs
    setCan1("");
    setCan2("");
    setFich1("");
    setFich2("");
  }

  // Reiniciar todo
  function resetAll() {
    setName1("");
    setName2("");
    setTotal1(0);
    setTotal2(0);
    setCan1("");
    setCan2("");
    setFich1("");
    setFich2("");
    setHistory([]);
  }

  // Enter guarda
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Enter") saveRound();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Burako Anotador</h1>

        {/* NOMBRES */}
        <div className="twoCols">
          <div className="col">
            <label className="label">JUGADOR 1</label>
            <input
              className="input"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              placeholder="Escribir nombre..."
            />
          </div>

          <div className="col">
            <label className="label">JUGADOR 2</label>
            <input
              className="input"
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              placeholder="Escribir nombre..."
            />
          </div>
        </div>

        {/* TABLA 2 COLUMNAS */}
        <div className="table">
          <div className="row head">
            <div className="cell left">{name1?.trim() || "Jugador 1"}</div>
            <div className="cell right">{name2?.trim() || "Jugador 2"}</div>
          </div>

          <div className="sectionTitle">CANASTAS</div>
          <div className="row">
            <div className="cell">
              <input
                className="num"
                value={can1}
                onChange={(e) => setCan1(e.target.value)}
                placeholder=""
                inputMode="numeric"
              />
            </div>
            <div className="cell">
              <input
                className="num"
                value={can2}
                onChange={(e) => setCan2(e.target.value)}
                placeholder=""
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="sectionTitle">PUNTOS FICHAS</div>
          <div className="row">
            <div className="cell">
              <input
                className="num"
                value={fich1}
                onChange={(e) => setFich1(e.target.value)}
                placeholder=""
                inputMode="numeric"
              />
            </div>
            <div className="cell">
              <input
                className="num"
                value={fich2}
                onChange={(e) => setFich2(e.target.value)}
                placeholder=""
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="sectionTitle">TOTAL (RONDA)</div>
          <div className="row totalRow">
            <div className="cell totalCell">{roundTotal1}</div>
            <div className="cell totalCell">{roundTotal2}</div>
          </div>

          <div className="sectionTitle">TOTAL (ACUMULADO)</div>
          <div className="row totalRow">
            <div className="cell totalCell big">{total1}</div>
            <div className="cell totalCell big">{total2}</div>
          </div>
        </div>

        {/* GANADOR */}
        <div className="winnerBox">
          <div className="winnerTitle">GANADOR A {GOAL} PUNTOS</div>
          <div className="winnerName">{winner ? winner : "—"}</div>
        </div>

        {/* BOTONES */}
        <div className="actions">
          <button className="btn ghost" onClick={resetAll}>Reiniciar</button>
          <button className="btn primary" onClick={saveRound}>Guardar ronda</button>
        </div>

        {/* HISTORIAL ABAJO DE BOTONES */}
        <div className="history">
          <div className="historyTitle">Historial de rondas</div>

          {history.length === 0 ? (
            <div className="historyEmpty">Todavía no hay rondas guardadas.</div>
          ) : (
            history.map((h) => (
              <div key={h.id} className="histItem">
                <div className="histTop">Ronda {h.r}</div>
                <div className="histGrid">
                  <div className="histCol">
                    <div className="histName">{name1?.trim() || "Jugador 1"}</div>
                    <div>Canastas: <b>{h.can1}</b></div>
                    <div>Fichas: <b>{h.fich1}</b></div>
                    <div>Total ronda: <b>{h.round1}</b></div>
                    <div>Acumulado: <b>{h.acc1}</b></div>
                  </div>

                  <div className="histCol">
                    <div className="histName">{name2?.trim() || "Jugador 2"}</div>
                    <div>Canastas: <b>{h.can2}</b></div>
                    <div>Fichas: <b>{h.fich2}</b></div>
                    <div>Total ronda: <b>{h.round2}</b></div>
                    <div>Acumulado: <b>{h.acc2}</b></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="hint">Tip: podés apretar <b>Enter</b> para guardar la ronda.</div>
      </div>
    </div>
  );
}
