import { useEffect, useMemo, useState } from "react";
import "./App.css";

const GOAL_DEFAULT = 3000;

function n(v) {
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
}

function sumRound(r) {
  // canasta + las + corte + muerto + puntos - fichasMano
  return (
    n(r.canasta) +
    n(r.las) +
    n(r.corte) +
    n(r.muerto) +
    n(r.puntos) -
    n(r.fichasMano)
  );
}

function format(num) {
  try {
    return new Intl.NumberFormat("es-AR").format(num);
  } catch {
    return String(num);
  }
}

export default function App() {
  const [goal, setGoal] = useState(GOAL_DEFAULT);

  // 2vs2 clásico
  const [leftName, setLeftName] = useState("Equipo A");
  const [rightName, setRightName] = useState("Equipo B");

  const [round, setRound] = useState(1);

  const [A, setA] = useState({
    canasta: "",
    las: "",
    corte: "",
    muerto: "",
    puntos: "",
    fichasMano: "",
  });

  const [B, setB] = useState({
    canasta: "",
    las: "",
    corte: "",
    muerto: "",
    puntos: "",
    fichasMano: "",
  });

  const [totalA, setTotalA] = useState(0);
  const [totalB, setTotalB] = useState(0);

  const [history, setHistory] = useState([]); // guarda rondas

  const roundTotalA = useMemo(() => sumRound(A), [A]);
  const roundTotalB = useMemo(() => sumRound(B), [B]);

  const winner =
    totalA >= goal && totalB >= goal
      ? "EMPATE"
      : totalA >= goal
      ? leftName
      : totalB >= goal
      ? rightName
      : null;

  useEffect(() => {
    if (!winner) return;
    // alerta simple para celu
    setTimeout(() => {
      alert(`🏆 Ganó ${winner} 🎉\n\nMarcador:\n${leftName}: ${format(totalA)}\n${rightName}: ${format(totalB)}`);
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner]);

  function setField(setter, key, value) {
    // permite vacío o números
    if (value === "") {
      setter((p) => ({ ...p, [key]: "" }));
      return;
    }
    // permitir negativos por si alguien quiere
    const cleaned = value.replace(",", ".");
    if (/^-?\d*\.?\d*$/.test(cleaned)) {
      setter((p) => ({ ...p, [key]: cleaned }));
    }
  }

  function clearInputs() {
    setA({
      canasta: "",
      las: "",
      corte: "",
      muerto: "",
      puntos: "",
      fichasMano: "",
    });
    setB({
      canasta: "",
      las: "",
      corte: "",
      muerto: "",
      puntos: "",
      fichasMano: "",
    });
  }

  function addRound() {
    const addA = roundTotalA;
    const addB = roundTotalB;

    const nextTotalA = totalA + addA;
    const nextTotalB = totalB + addB;

    setHistory((h) => [
      {
        round,
        A: addA,
        B: addB,
        totalA: nextTotalA,
        totalB: nextTotalB,
      },
      ...h,
    ]);

    setTotalA(nextTotalA);
    setTotalB(nextTotalB);

    setRound((r) => r + 1);
    clearInputs();
  }

  function undoLast() {
    if (history.length === 0) return;
    const [last, ...rest] = history;
    // volvemos al total anterior
    const prevTotalA = totalA - last.A;
    const prevTotalB = totalB - last.B;
    setTotalA(prevTotalA);
    setTotalB(prevTotalB);
    setHistory(rest);
    setRound((r) => Math.max(1, r - 1));
  }

  function resetAll() {
    if (!confirm("¿Reiniciar todo el anotador?")) return;
    setTotalA(0);
    setTotalB(0);
    setHistory([]);
    setRound(1);
    clearInputs();
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="logo">🃏</div>
          <div>
            <div className="title">Anotador Burako</div>
            <div className="subtitle">2vs2 clásico · suma por rondas</div>
          </div>
        </div>

        <div className="goal">
          <span className="goalLabel">Meta</span>
          <input
            className="goalInput"
            value={goal}
            onChange={(e) => setGoal(n(e.target.value))}
            inputMode="numeric"
          />
        </div>
      </header>

      <section className="scoreboard">
        <div className={`scoreCard ${winner === leftName ? "win" : ""}`}>
          <input
            className="teamName"
            value={leftName}
            onChange={(e) => setLeftName(e.target.value)}
          />
          <div className="bigScore">{format(totalA)}</div>
          <div className="smallInfo">Ronda +{format(roundTotalA)}</div>
        </div>

        <div className="vs">VS</div>

        <div className={`scoreCard ${winner === rightName ? "win" : ""}`}>
          <input
            className="teamName"
            value={rightName}
            onChange={(e) => setRightName(e.target.value)}
          />
          <div className="bigScore">{format(totalB)}</div>
          <div className="smallInfo">Ronda +{format(roundTotalB)}</div>
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div className="panelTitle">Ronda #{round}</div>
          <div className="panelActions">
            <button className="btn ghost" onClick={undoLast} disabled={history.length === 0}>
              ↩ Deshacer
            </button>
            <button className="btn danger" onClick={resetAll}>
              🗑 Reiniciar
            </button>
          </div>
        </div>

        <div className="grid2">
          <TeamForm
            title={leftName}
            data={A}
            onChange={(key, value) => setField(setA, key, value)}
          />
          <TeamForm
            title={rightName}
            data={B}
            onChange={(key, value) => setField(setB, key, value)}
          />
        </div>

        <div className="footerActions">
          <button className="btn primary" onClick={addRound}>
            ➕ Agregar ronda (sumar al total)
          </button>
        </div>
      </section>

      <section className="history">
        <div className="historyTitle">Partidas / Rondas</div>

        {history.length === 0 ? (
          <div className="empty">Todavía no agregaste ninguna ronda.</div>
        ) : (
          <div className="historyList">
            {history.map((h) => (
              <div className="historyRow" key={h.round}>
                <div className="historyRound">Ronda {h.round}</div>
                <div className="historyCols">
                  <div className="historyCol">
                    <div className="pill">{leftName}</div>
                    <div className="delta">+{format(h.A)}</div>
                    <div className="tot">Total: {format(h.totalA)}</div>
                  </div>
                  <div className="historyCol">
                    <div className="pill">{rightName}</div>
                    <div className="delta">+{format(h.B)}</div>
                    <div className="tot">Total: {format(h.totalB)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="footnote">
        Tip: escribí solo números. <b>Fichas en mano</b> se restan automáticamente.
      </footer>
    </div>
  );
}

function TeamForm({ title, data, onChange }) {
  return (
    <div className="teamBox">
      <div className="teamBoxTitle">{title}</div>

      <div className="fields">
        <Field label="Canasta" value={data.canasta} onChange={(v) => onChange("canasta", v)} />
        <Field label="Las" value={data.las} onChange={(v) => onChange("las", v)} />
        <Field label="Corte" value={data.corte} onChange={(v) => onChange("corte", v)} />
        <Field label="Muerto" value={data.muerto} onChange={(v) => onChange("muerto", v)} />
        <Field label="Puntos" value={data.puntos} onChange={(v) => onChange("puntos", v)} />
        <Field
          label="Fichas en mano (-)"
          value={data.fichasMano}
          onChange={(v) => onChange("fichasMano", v)}
        />
      </div>

      <div className="calc">
        Total ronda = <b>{format(sumRound(data))}</b>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="field">
      <span className="fieldLabel">{label}</span>
      <input
        className="fieldInput"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode="numeric"
        placeholder="0"
      />
    </label>
  );
}
