import { useMemo, useState } from "react";
import "./App.css";

const toNum = (v) => {
  if (v === "" || v === null || v === undefined) return 0;
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

const formatPts = (n) => String(Math.trunc(n));

export default function App() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");

  const [can1, setCan1] = useState("");
  const [can2, setCan2] = useState("");

  const [fich1, setFich1] = useState("");
  const [fich2, setFich2] = useState("");

  const [acc1, setAcc1] = useState(0);
  const [acc2, setAcc2] = useState(0);

  const [part1, setPart1] = useState(0);
  const [part2, setPart2] = useState(0);

  const [history, setHistory] = useState([]);

  const roundTotal1 = useMemo(() => toNum(can1) + toNum(fich1), [can1, fich1]);
  const roundTotal2 = useMemo(() => toNum(can2) + toNum(fich2), [can2, fich2]);

  const winner = useMemo(() => {
    const n1 = name1.trim() || "JUGADOR 1";
    const n2 = name2.trim() || "JUGADOR 2";
    if (acc1 >= 3000 && acc1 > acc2) return n1;
    if (acc2 >= 3000 && acc2 > acc1) return n2;
    if (acc1 >= 3000 && acc2 >= 3000 && acc1 !== acc2)
      return acc1 > acc2 ? n1 : n2;
    return "";
  }, [acc1, acc2, name1, name2]);

  const clearRoundInputs = () => {
    setCan1("");
    setCan2("");
    setFich1("");
    setFich2("");
  };

  const onSaveRound = () => {
    const n1 = name1.trim() || "JUGADOR 1";
    const n2 = name2.trim() || "JUGADOR 2";

    const r1 = roundTotal1;
    const r2 = roundTotal2;

    const newAcc1 = acc1 + r1;
    const newAcc2 = acc2 + r2;

    setAcc1(newAcc1);
    setAcc2(newAcc2);

    if (r1 > r2) setPart1((p) => p + 1);
    else if (r2 > r1) setPart2((p) => p + 1);

    const row = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleString(),
      n1,
      n2,
      can1: toNum(can1),
      can2: toNum(can2),
      fich1: toNum(fich1),
      fich2: toNum(fich2),
      total1: r1,
      total2: r2,
      acc1: newAcc1,
      acc2: newAcc2,
    };

    setHistory((h) => [row, ...h]);
    clearRoundInputs();
  };

  const onResetAll = () => {
    if (!confirm("¿Reiniciar TODO el anotador?")) return;
    setAcc1(0);
    setAcc2(0);
    setPart1(0);
    setPart2(0);
    setHistory([]);
    clearRoundInputs();
  };

  return (
    <div className="page">
      <div className="card">
        <div className="title">🃏 BURAKO ANOTADOR</div>

        <div className="grid2">
          <div className="colTitle">JUGADOR 1</div>
          <div className="colTitle">JUGADOR 2</div>
        </div>

        <div className="grid2">
          <input
            className="inp"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            placeholder="NOMBRE"
          />
          <input
            className="inp"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            placeholder="NOMBRE"
          />
        </div>

        <div className="grid2 sectionTitle">
          <div>CANASTAS</div>
          <div>CANASTAS</div>
        </div>
        <div className="grid2">
          <input className="inp" inputMode="numeric" value={can1} onChange={(e) => setCan1(e.target.value)} placeholder="PUNTOS" />
          <input className="inp" inputMode="numeric" value={can2} onChange={(e) => setCan2(e.target.value)} placeholder="PUNTOS" />
        </div>

        <div className="grid2 sectionTitle">
          <div>PUNTOS FICHAS</div>
          <div>PUNTOS FICHAS</div>
        </div>
        <div className="grid2">
          <input className="inp" inputMode="numeric" value={fich1} onChange={(e) => setFich1(e.target.value)} placeholder="PUNTOS" />
          <input className="inp" inputMode="numeric" value={fich2} onChange={(e) => setFich2(e.target.value)} placeholder="PUNTOS" />
        </div>

        <div className="grid2 sectionTitle">
          <div>TOTAL (RONDA)</div>
          <div>TOTAL (RONDA)</div>
        </div>
        <div className="grid2">
          <div className="calcBox">{formatPts(roundTotal1)}</div>
          <div className="calcBox">{formatPts(roundTotal2)}</div>
        </div>

        <div className="grid2 sectionTitle">
          <div>TOTAL (ACUMULADO)</div>
          <div>TOTAL (ACUMULADO)</div>
        </div>
        <div className="grid2">
          <div className="calcBox big">{formatPts(acc1)}</div>
          <div className="calcBox big">{formatPts(acc2)}</div>
        </div>

        <div className="grid2 sectionTitle">
          <div>PARTIDAS</div>
          <div>PARTIDAS</div>
        </div>
        <div className="grid2">
          <div className="calcBox">{formatPts(part1)}</div>
          <div className="calcBox">{formatPts(part2)}</div>
        </div>

        <div className="grid2 buttons">
          <button className="btn danger" onClick={onResetAll}>REINICIAR</button>
          <button className="btn" onClick={onSaveRound}>GUARDAR RONDA</button>
        </div>

        <div className="winner">
          <div className="winnerTitle">GANADOR A 3000</div>
          <div className={`winnerName ${winner ? "show" : ""}`}>
            {winner ? `🏆 ${winner}` : "—"}
          </div>
        </div>

        <div className="history">
          <div className="historyTitle">HISTORIAL</div>

          {history.length === 0 ? (
            <div className="historyEmpty">Todavía no guardaste rondas.</div>
          ) : (
            <div className="historyList">
              {history.map((h, idx) => (
                <div className="historyRow" key={h.id}>
                  <div className="historyTop">
                    <div className="historyIdx">RONDA {history.length - idx}</div>
                    <div className="historyDate">{h.date}</div>
                  </div>

                  <div className="historyGrid">
                    <div className="hCell">
                      <div className="hName">{h.n1}</div>
                      <div className="hSmall">CAN {formatPts(h.can1)} | FICH {formatPts(h.fich1)}</div>
                      <div className="hBig">TOTAL {formatPts(h.total1)}</div>
                      <div className="hAcc">ACUM {formatPts(h.acc1)}</div>
                    </div>

                    <div className="hCell">
                      <div className="hName">{h.n2}</div>
                      <div className="hSmall">CAN {formatPts(h.can2)} | FICH {formatPts(h.fich2)}</div>
                      <div className="hBig">TOTAL {formatPts(h.total2)}</div>
                      <div className="hAcc">ACUM {formatPts(h.acc2)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="footerNote">Para la que gana Simpre "LORE" nto💙</div>
      </div>
    </div>
  );
}
