:root {
  --bg1: #dff2ff;
  --bg2: #bfe6ff;
  --card: rgba(255, 255, 255, 0.78);
  --ink: #0b2a3a;
  --inkSoft: rgba(11, 42, 58, 0.7);
  --line: rgba(11, 42, 58, 0.15);
  --btn: #0b5ed7;
  --btn2: #0a4db2;
  --danger: #d72638;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  color: var(--ink);
}

.page {
  min-height: 100vh;
  padding: 12px;
  display: grid;
  place-items: start center;
  background: radial-gradient(1200px 600px at 50% 0%, var(--bg1), var(--bg2));
}

.card {
  width: 100%;
  max-width: 520px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.12);
}

.title {
  text-align: center;
  font-weight: 1000;
  letter-spacing: 0.06em;
  font-size: 18px;
  margin-bottom: 10px;
}

/* 2 columnas SIEMPRE */
.grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  width: 100%;
}

.colTitle {
  text-align: center;
  font-weight: 1000;
  font-size: 14px;
  letter-spacing: 0.06em;
  padding: 10px 6px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid var(--line);
}

.sectionTitle {
  margin-top: 8px;
  font-weight: 1000;
  letter-spacing: 0.08em;
  font-size: 12px;
  text-align: center;
  color: var(--inkSoft);
}

.inp {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 10px 8px;
  font-size: 15px;
  font-weight: 900;
  text-transform: uppercase;
  outline: none;
  background: rgba(255, 255, 255, 0.9);
  color: var(--ink);
  text-align: center;
}

/* acá arreglamos el tamaño para 5 dígitos */
.calcBox {
  width: 100%;
  border-radius: 12px;
  padding: 10px 8px;
  text-align: center;
  font-size: 16px;     /* NO gigante */
  font-weight: 1000;
  letter-spacing: 0.04em;
  background: rgba(255, 255, 255, 0.55);
  border: 1px dashed rgba(11, 42, 58, 0.25);
}

.calcBox.big {
  font-size: 18px;   /* un poco más, pero no enorme */
}

.buttons { margin-top: 10px; }

.btn {
  border: 0;
  border-radius: 14px;
  padding: 12px 10px;
  font-size: 13px;
  font-weight: 1000;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  color: white;
  background: linear-gradient(180deg, var(--btn), var(--btn2));
}

.btn.danger {
  background: linear-gradient(180deg, #ff4b5c, var(--danger));
}

.winner {
  margin-top: 12px;
  text-align: center;
  border-radius: 16px;
  padding: 10px 8px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.65);
}

.winnerTitle {
  font-weight: 1000;
  letter-spacing: 0.08em;
  font-size: 12px;
  color: var(--inkSoft);
}

.winnerName {
  margin-top: 6px;
  font-size: 16px;
  font-weight: 1000;
}

.history {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--line);
}

.historyTitle {
  text-align: center;
  font-weight: 1000;
  letter-spacing: 0.08em;
  font-size: 12px;
  margin-bottom: 10px;
  color: var(--inkSoft);
}
