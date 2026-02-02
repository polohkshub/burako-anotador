import { useEffect, useMemo, useState } from "react";
import "./App.css";

const GOAL = 3000;

const num = (v) => {
  if (v === "" || v === null || v === undefined) return 0;
  const x = Number(String(v).replace(",", "."));
  return Number.isFinite(x) ? x : 0;
};

export default function App() {
  // nombres vacíos
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");

  // ronda (inputs vacíos)
  const [can1, setCan1] = useState("");
  const [can2, setCan2] = useState("");
  const [pf1, setPf1] = useState("");
  const [pf2, setPf2] = useState("");

  // acumulado
  const [total1, setTotal1] = useState(0);
  const [total2, setTotal2] = useState(0);

  // historial
  const [history, setHistory] = useState([]); // {n, add1, add2, t1, t2}

  const name1 = p1.trim() || "JUGADOR 1";
  const name2 = p2.trim() || "JUGADOR 2";

  // total ronda automático
  const ronda1 = useMemo(() => num(can1) + num(pf1), [can1, pf1]);
  const ronda2 = useMemo(() => num(can2) + num(pf2), [can2, pf2]);

  const winner =
    total1 >= GOAL && total2 >= GOAL
      ? "EMPATE"
      : total1 >= GOAL
      ? name1
      : total2 >= GOAL
      ? name2
      : null;

  useEffect(() => {
    if (!winner) return;
    setTimeout(() => {
      alert(`🏆 GANÓ ${winner}\n\n${name1}: ${total1}\n${name2}: ${total2}`);
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner]);

  const onlyNumOrEmpty = (value, setter) => {
    if (value === "") return setter("");
    const cleaned = value.replace(",", ".");
    if (/^-?\d*\.?\d*$/.test(cleaned)) setter(cleaned);
  };

  const guardarRonda = () => {
    const add1 = ronda1;
    const add2 = ronda2;

    const t1 = total1 + add1;
    const t2 = total2 + add2;

    const n = history.length + 1;

    setHistory((h) => [{ n, add1, add2, t1, t2 }, ...h]);

    setTotal1(t1);
    setTotal2(t2);

    // limpiar inputs
    setCan1("");
    setCan2("");
    setPf1("");
    setPf2("");
  };

  const reiniciar = () => {
    if (!confirm("¿Reiniciar todo?")) return;
    setP1("");
    setP2("");
    setCan1("");
    setCan2("");
    setPf1("");
    setPf2("");
    setTotal1(0);
    setTotal2(0);
    setHistory([]);
  };

  return (
    <div className="page">
      <div className="card">
        <div className="title">🃏 BURAKO ANOTADOR</div>

        <div className="names">
          <input
            className="nameInput"
            placeholder="JUGADOR 1"
            value={p1}
            onChange={(e) => setP1(e.target.value)}
          />
          <input
            className="nameInput"
            placeholder="JUGADOR 2"
            value={p2}
            onChange={(e) => setP2(e.target.value)}
          />
        </div>

        <div className="section">
          <div className="sectionTitle">CANASTAS</div>
          <div className="two">
            <input
              className="numInput"
              placeholder=""
              value={can1}
              onChange={(e) => onlyNumOrEmpty(e.target.value, setCan1)}
              inputMode="numeric"
            />
            <input
              className="numInput"
              placeholder=""
              value={can2}
              onChange={(e) => onlyNumOrEmpty(e.target.value, setCan2)}
              inputMode="numeric"
            />
          </div>
        </div>

        <div className="section">
          <div className="sectionTitle">PUNTOS FICHAS</div>
          <div className="two">
            <input
              className="numInput"
              placeholder=""
              value={pf1}
              onChange={(e) => onlyNumOrEmpty(e.target.value, setPf1)}
              inputMode="numeric"
            />
            <input
              className="numInput"
              placeholder=""
              value={pf2}
              onChange={(e) => onlyNumOrEmpty(e.target.value, setPf2)}
              inputMode="numeric"
            />
          </div>
        </div>

        <div className="section">
          <div className="sectionTitle">TOTAL (RONDA)</div>
          <div className="two">
            <div className="boxRead">{ronda1}</div>
            <div className="boxRead">{ronda2}</div>
          </div>
        </div>

        <div className="section">
          <div className="sectionTitle">TOTAL</div>
          <div className="two">
            <div className="boxTotal">{total1}</div>
            <div className="boxTotal">{total2}</div>
          </div>
        </div>

        <div className="winner">
          <div className="winnerTitle">GANADOR A {GOAL} PUNTOS</div>
          <div className="winnerName">
            {winner ? `🏆 ${winner}` : "—"}
          </div>
        </div>

        <div className="actions">
          <button className="btn primary" onClick={guardarRonda}>
            GUARDAR RONDA
          </button>
          <button className="btn ghost" onClick={reiniciar}>
            REINICIAR
          </button>
        </div>
      </div>

      <div className="history">
        <div className="historyTitle">HISTORIAL (OPCIONAL)</div>

        {history.length === 0 ? (
          <div className="historyEmpty">Todavía no guardaste rondas.</div>
        ) : (
          <div className="historyList">
            {history.map((h) => (
              <div className="historyRow" key={h.n}>
                <div className="roundN">PARTIDA {h.n}</div>
                <div className="roundLine">
                  {name1}: +{h.add1} → {h.t1}
                </div>
                <div className="roundLine">
                  {name2}: +{h.add2} → {h.t2}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
