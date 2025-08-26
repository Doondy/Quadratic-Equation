const style = document.createElement('style');
style.textContent = `
  :root {
    --bg: #0f172a;        /* slate-900 */
    --muted: #1e293b;     /* slate-800 */
    --panel: #111827;     /* gray-900 */
    --text: #e5e7eb;      /* gray-200 */
    --accent: #38bdf8;    /* sky-400 */
    --accent-2: #a78bfa;  /* violet-400 */
    --ok: #34d399;        /* emerald-400 */
    --warn: #f59e0b;      /* amber-500 */
    --err: #f87171;       /* red-400 */
    --border: #334155;    /* slate-700 */
  }
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
    background: radial-gradient(1200px 800px at 20% 0%, #111827 10%, #0f172a 60%, #0b1220 100%);
    color: var(--text);
    display: grid; place-items: center; padding: 24px;
  }
  .card {
    width: min(720px, 92vw);
    background: linear-gradient(180deg, rgba(167,139,250,0.08), rgba(56,189,248,0.08));
    border: 1px solid var(--border);
    border-radius: 18px; padding: 22px;
    backdrop-filter: blur(6px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.35);
  }
  h1 {
    margin: 0 0 14px; font-size: 1.5rem; letter-spacing: .3px;
    display: flex; align-items: center; gap: 10px;
  }
  .beta {
    font-size: .72rem; padding: 2px 8px; border: 1px solid var(--border);
    border-radius: 999px; color: #c7d2fe; opacity: .85;
  }
  p.sub {
    margin: 0 0 18px; color: #cbd5e1; opacity: .85; font-size: .95rem;
  }
  .grid {
    display: grid; gap: 12px; grid-template-columns: repeat(3, 1fr);
  }
  .field {
    display: grid; gap: 8px; background: rgba(2,6,23,.35);
    padding: 12px; border-radius: 14px; border: 1px solid var(--border);
  }
  label { font-size: .88rem; color: #cbd5e1; }
  input[type="number"] {
    padding: 10px 12px; border-radius: 12px; border: 1px solid var(--border); background: var(--panel);
    color: var(--text); outline: none;
  }
  input[type="number"]::placeholder { color: #94a3b8; opacity: .8; }
  .actions {
    margin-top: 14px; display: flex; gap: 10px; flex-wrap: wrap;
  }
  button {
    border: 1px solid var(--border); background: #0b1220; color: var(--text);
    border-radius: 12px; padding: 10px 14px; cursor: pointer; font-weight: 600;
    transition: transform .06s ease, background .2s ease;
  }
  button:hover { transform: translateY(-1px); }
  button.primary { background: linear-gradient(90deg, var(--accent), var(--accent-2)); color: #0b1220; border: none; }
  button.ghost { background: transparent; }
  .result {
    margin-top: 18px; padding: 16px; border: 1px solid var(--border); border-radius: 14px;
    background: rgba(2,6,23,.45);
  }
  .bad { color: var(--err); font-weight: 700; }
  .warn { color: var(--warn); font-weight: 700; }
  .good { color: var(--ok); font-weight: 700; }
  code, .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
  .steps { margin-top: 10px; line-height: 1.6; }
  .row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
  .pill {
    border: 1px solid var(--border); background: rgba(2,6,23,.55);
    padding: 6px 10px; border-radius: 999px; font-size: .85rem;
  }
  .footer {
    margin-top: 16px; opacity: .75; font-size: .85rem; text-align: right;
  }
`;
document.head.appendChild(style);

// ---- Utilities ----
const $ = (sel, el = document) => el.querySelector(sel);

function toNumber(value) {
  if (value === "" || value === null || value === undefined) return NaN;
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

function roundSmart(x, places = 6) {
  if (!Number.isFinite(x)) return x;
  // Keep it readable for integers/small rationals
  const fixed = Number(x.toFixed(places));
  return Math.abs(fixed - Math.round(fixed)) < 1e-12 ? Math.round(fixed) : fixed;
}

// ---- Math core: solve ax^2 + bx + c = 0 ----
export function solveQuadratic(a, b, c) {
  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) {
    return { type: 'invalid', message: 'Coefficients must be real numbers.' };
  }

  // Degenerate cases
  if (a === 0) {
    if (b === 0) {
      if (c === 0) return { type: 'identity', message: '0 = 0 (infinitely many solutions).' };
      return { type: 'contradiction', message: 'No solution: constant non-zero equals 0.' };
    }
    // Linear bx + c = 0
    const x = -c / b;
    return {
      type: 'linear',
      root: x,
      steps: [
        `Given linear equation: ${b}x + ${c} = 0`,
        `x = -c / b = ${-c} / ${b} = ${roundSmart(x)}`
      ]
    };
  }

  const D = b*b - 4*a*c; // discriminant
  const steps = [
    `Equation: ${a}x² + ${b}x + ${c} = 0`,
    `Discriminant: Δ = b² - 4ac = ${b}² - 4(${a})(${c}) = ${roundSmart(D)}`
  ];

  if (D > 0) {
    const sqrtD = Math.sqrt(D);
    const x1 = (-b - sqrtD) / (2*a); // more stable ordering depends on sign(b)
    const x2 = (-b + sqrtD) / (2*a);
    steps.push(`Two distinct real roots since Δ > 0.`);
    steps.push(`x₁ = (-b - √Δ) / (2a) = (${ -b } - ${ roundSmart(sqrtD) }) / (${ 2*a }) = ${ roundSmart(x1) }`);
    steps.push(`x₂ = (-b + √Δ) / (2a) = (${ -b } + ${ roundSmart(sqrtD) }) / (${ 2*a }) = ${ roundSmart(x2) }`);
    return {
      type: 'real-two',
      discriminant: D,
      roots: [x1, x2],
      steps
    };
  } else if (D === 0) {
    const x = -b / (2*a);
    steps.push(`One real repeated root since Δ = 0.`);
    steps.push(`x = -b / (2a) = ${-b} / ${2*a} = ${roundSmart(x)}`);
    return { type: 'real-one', discriminant: D, root: x, steps };
  } else {
    const sqrtAbs = Math.sqrt(-D);
    const real = -b / (2*a);
    const imag = sqrtAbs / (2*a);
    steps.push(`Complex conjugate roots since Δ < 0.`);
    steps.push(`x = (-b ± i√|Δ|) / (2a) = (${ -b } ± i${ roundSmart(sqrtAbs) }) / (${ 2*a })`);
    steps.push(`x₁ = ${roundSmart(real)} - ${roundSmart(imag)}i`);
    steps.push(`x₂ = ${roundSmart(real)} + ${roundSmart(imag)}i`);
    return {
      type: 'complex',
      discriminant: D,
      roots: [{ re: real, im: -imag }, { re: real, im: imag }],
      steps
    };
  }
}

// ---- UI ----
const root = document.getElementById('app');

root.innerHTML = `
  <div class="card">
    <h1>Quadratic Equation Solver <span class="beta mono pill">Vite + JS</span></h1>
    <p class="sub">Solve <span class="mono">ax² + bx + c = 0</span> with step-by-step working, discriminant, and root nature.</p>

    <div class="grid">
      <div class="field">
        <label for="a">a (x² coefficient)</label>
        <input id="a" type="number" placeholder="e.g. 1" />
      </div>
      <div class="field">
        <label for="b">b (x coefficient)</label>
        <input id="b" type="number" placeholder="e.g. -3" />
      </div>
      <div class="field">
        <label for="c">c (constant)</label>
        <input id="c" type="number" placeholder="e.g. 2" />
      </div>
    </div>

    <div class="actions">
      <button id="solve" class="primary">Solve</button>
      <button id="sample" class="ghost">Try Sample (3x² + 5x + 6)</button>
      <button id="clear" class="ghost">Clear</button>
    </div>

    <div id="summary" class="row" style="margin-top:12px;"></div>
    <div id="result" class="result" style="display:none;"></div>
    <div class="footer">Built with Vite · Vanilla JS only</div>
  </div>
`;

const inputs = {
  a: $('#a'),
  b: $('#b'),
  c: $('#c'),
};
const btnSolve = $('#solve');
const btnClear = $('#clear');
const btnSample = $('#sample');
const summary = $('#summary');
const result = $('#result');

btnSample.addEventListener('click', () => {
  inputs.a.value = 3;
  inputs.b.value = 5;
  inputs.c.value = 6;
  computeAndRender();
});

btnClear.addEventListener('click', () => {
  inputs.a.value = '';
  inputs.b.value = '';
  inputs.c.value = '';
  summary.innerHTML = '';
  result.style.display = 'none';
  result.innerHTML = '';
});

btnSolve.addEventListener('click', computeAndRender);
['a','b','c'].forEach(k => inputs[k].addEventListener('keydown', e => {
  if (e.key === 'Enter') computeAndRender();
}));

function computeAndRender() {
  const a = toNumber(inputs.a.value);
  const b = toNumber(inputs.b.value);
  const c = toNumber(inputs.c.value);

  const out = solveQuadratic(a, b, c);

  // Summary pills
  const pills = [];
  if (out.type === 'real-two') pills.push(`<span class="pill good">Two real roots</span>`);
  if (out.type === 'real-one') pills.push(`<span class="pill warn">One real repeated root</span>`);
  if (out.type === 'complex') pills.push(`<span class="pill bad">Complex conjugates</span>`);
  if (out.type === 'linear') pills.push(`<span class="pill good">Linear case (a = 0)</span>`);
  if (out.type === 'identity') pills.push(`<span class="pill good">Identity: infinitely many solutions</span>`);
  if (out.type === 'contradiction') pills.push(`<span class="pill bad">No solution</span>`);
  if (out.type === 'invalid') pills.push(`<span class="pill bad">Invalid input</span>`);
  summary.innerHTML = pills.join('');

  // Detailed result
  result.style.display = 'block';
  if (out.type === 'invalid') {
    result.innerHTML = `<div class="bad">Coefficients must be real numbers.</div>`;
    return;
  }
  if (out.type === 'identity' || out.type === 'contradiction') {
    result.innerHTML = `<div class="${out.type === 'identity' ? 'good' : 'bad'}">${out.message}</div>`;
    return;
  }
  if (out.type === 'linear') {
    const x = roundSmart(out.root);
    result.innerHTML = `
      <div><strong>Solution:</strong> x = <span class="mono">${x}</span></div>
      <div class="steps">${out.steps.map(s => `• ${s}`).join('<br/>')}</div>
    `;
    return;
  }

  // Quadratic cases
  const discLine = `<div>Discriminant (Δ): <span class="mono">${roundSmart(out.discriminant)}</span></div>`;
  if (out.type === 'real-two') {
    const [x1, x2] = out.roots.map(roundSmart);
    result.innerHTML = `
      ${discLine}
      <div><strong>Roots:</strong> x₁ = <span class="mono">${x1}</span>, x₂ = <span class="mono">${x2}</span></div>
      <div class="steps">${out.steps.map(s => `• ${s}`).join('<br/>')}</div>
    `;
  } else if (out.type === 'real-one') {
    const x = roundSmart(out.root);
    result.innerHTML = `
      ${discLine}
      <div><strong>Root:</strong> x = <span class="mono">${x}</span></div>
      <div class="steps">${out.steps.map(s => `• ${s}`).join('<br/>')}</div>
    `;
  } else if (out.type === 'complex') {
    const [r1, r2] = out.roots;
    const f = (z) => `${roundSmart(z.re)} ${z.im < 0 ? '-' : '+'} ${Math.abs(roundSmart(z.im))}i`;
    result.innerHTML = `
      ${discLine}
      <div><strong>Roots:</strong> x₁ = <span class="mono">${f(r1)}</span>, x₂ = <span class="mono">${f(r2)}</span></div>
      <div class="steps">${out.steps.map(s => `• ${s}`).join('<br/>')}</div>
    `;
  }
}