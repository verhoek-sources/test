/**
 * app.js – Salary House application logic
 * Dutch Low Code Enterprise Solutions | ~120 medewerkers
 */

// ── State ────────────────────────────────────────────────────────────────────
const state = {
  step: 0,          // 0 = welcome
  selectedRole: null,
  education: null,
  certifications: null,
  platform_depth: null,
  performance: null,
  showOverview: false,
  activeSources: new Set(SALARY_DATA.benchmarkSources.map(s => s.id)),
};

const TOTAL_STEPS = 6; // welcome + 4 questions + result

// ── Platform expertise descriptions ──────────────────────────────────────────
const PLATFORM_DEPTH_DESCS = {
  general:    'Werkervaring met low-code platforms op functioneel niveau. U kunt basistaken uitvoeren maar bent geen specialist in één specifiek platform.',
  specialist: 'Diepgaande kennis van één of meerdere low-code platforms (bijv. Mendix, OutSystems of ServiceNow). U bouwt zelfstandig complexe applicaties en configuraties.',
  expert:     'Officieel gecertificeerd door de platformleverancier (bijv. Mendix Advanced of Expert Certification). U geldt als interne kennisdrager en wordt ingezet bij pre-sales en kennisoverdracht.',
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n) {
  return '€\u202F' + n.toLocaleString('nl-NL');
}

function fmtK(n) {
  return '€\u202F' + Math.round(n / 1000) + 'K';
}

function fmtMonthly(n) {
  return fmt(Math.round(n / 12));
}

function clamp(v, lo, hi) {
  return Math.min(Math.max(v, lo), hi);
}

/** Compute the exact salary given a position 0→1 within a band */
function salaryAtPosition(band, pos) {
  return Math.round(band.min + (band.max - band.min) * pos);
}

/** Derive position (0–1) from selected adjustments */
function computePosition() {
  const adj = SALARY_DATA.adjustments;
  let pos = 0.5; // start at mid-market

  const keys = ['education', 'certifications', 'platform_depth', 'performance'];
  for (const key of keys) {
    const sel = state[key];
    if (sel && adj[key][sel]) {
      pos += adj[key][sel].weight;
    }
  }
  return clamp(pos, 0, 1);
}

/**
 * Compute the salary band for a role by averaging the factors of all
 * active benchmark sources over the base band.
 */
function computeActiveBand(baseBand) {
  const sources = SALARY_DATA.benchmarkSources;
  const active = sources.filter(s => state.activeSources.has(s.id));
  if (active.length === 0) return baseBand;

  const avgFactor = key => active.reduce((sum, s) => sum + s.factors[key], 0) / active.length;

  return {
    min: Math.round(baseBand.min * avgFactor('min')),
    mid: Math.round(baseBand.mid * avgFactor('mid')),
    max: Math.round(baseBand.max * avgFactor('max')),
  };
}

// ── Rendering ─────────────────────────────────────────────────────────────────
const app = document.getElementById('app');

function render() {
  if (state.showOverview) {
    renderOverview();
  } else if (state.step === 0) {
    renderWelcome();
  } else if (state.step === 1) {
    renderRoleSelect();
  } else if (state.step === 2) {
    renderQuestion('education', '🎓 Opleidingsniveau', 'Wat is uw hoogst afgeronde opleiding?',
      Object.entries(SALARY_DATA.adjustments.education).map(([k, v]) => ({
        id: k, label: v.label, desc: null, icon: { mbo: '📘', hbo: '📗', university: '🎓' }[k],
      }))
    );
  } else if (state.step === 3) {
    renderQuestion('certifications', '🏅 Certificeringen', 'Hoeveel relevante low-code / platform-certificeringen heeft u?',
      Object.entries(SALARY_DATA.adjustments.certifications).map(([k, v]) => ({
        id: k, label: v.label, desc: null, icon: { none: '⬜', one: '🟦', two: '🟩', three: '🟨', four_plus: '🟧' }[k],
      })),
      'Een certificaat is een officieel bewijs van vakbekwaamheid, uitgegeven door een platformleverancier of erkende trainingsinstantie (bijv. Mendix Rapid Developer, Advanced of Expert; OutSystems Associate of Professional; ServiceNow CSA). Het toont aan dat u een gestandaardiseerde toets of praktijkbeoordeling met goed gevolg heeft afgerond.'
    );
  } else if (state.step === 4) {
    renderQuestion('platform_depth', '🔧 Platform expertise', 'Hoe omschrijft u uw diepgang op het gebruikte low-code platform?',
      Object.entries(SALARY_DATA.adjustments.platform_depth).map(([k, v]) => ({
        id: k, label: v.label, desc: PLATFORM_DEPTH_DESCS[k], icon: { general: '🌐', specialist: '⚙️', expert: '🏆' }[k],
      }))
    );
  } else if (state.step === 5) {
    renderQuestion('performance', '📊 Prestatieprofiel', 'Hoe presteert u ten opzichte van de functieverwachtingen?',
      Object.entries(SALARY_DATA.adjustments.performance).map(([k, v]) => ({
        id: k, label: v.label, desc: null,
        icon: { developing: '📈', meets: '✅', exceeds: '🌟' }[k],
      }))
    );
  } else if (state.step === 6) {
    renderResult();
  }
}

// ── Welcome ───────────────────────────────────────────────────────────────────
function renderWelcome() {
  app.innerHTML = `
    <div class="screen">
      <div class="card">
        <div class="logo-wrap">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <div class="logo-name">Salarishuis</div>
            <div class="logo-sub">Low Code Enterprise Solutions · Nederland</div>
          </div>
        </div>

        <div class="welcome-hero">
          <div class="welcome-badge">🇳🇱 Marktsalaris 2024 – 2025</div>
          <h1>Wat verdient u in de<br/>low-code markt?</h1>
          <p>
            Deze tool begeleidt u door een aantal vragen en berekent op basis van
            uw profiel een marktconform salarisindicatie voor uw rol binnen een
            Nederlandse dienstverleningsorganisatie (~120 fte) gericht op
            low-code enterprise oplossingen.
          </p>

          <div class="feature-list">
            <div class="feature-item">
              <div class="fi-icon">💰</div>
              <div>
                <strong>Marktsalaris 2024–2025</strong><br/>
                Gebaseerd op CBS-data, salary surveys en branchebenchmarks.
              </div>
            </div>
            <div class="feature-item">
              <div class="fi-icon">🎯</div>
              <div>
                <strong>8 rollen</strong><br/>
                Van Support Consultant t/m Solution Architect en Team Lead met bijbehorende banden.
              </div>
            </div>
            <div class="feature-item">
              <div class="fi-icon">🔧</div>
              <div>
                <strong>Persoonlijk profiel</strong><br/>
                Opleiding, certificeringen en prestaties bepalen uw positie in de band.
              </div>
            </div>
            <div class="feature-item">
              <div class="fi-icon">📋</div>
              <div>
                <strong>Volledig overzicht</strong><br/>
                Bekijk ook de salarisbanden van alle andere rollen in één oogopslag.
              </div>
            </div>
          </div>

          <div class="btn-row" style="justify-content:center; gap:12px; flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="goStart()">
              Start de berekening →
            </button>
            <button class="btn btn-outline" onclick="showAllRoles()">
              📋 Alle rollen bekijken
            </button>
          </div>
        </div>
      </div>
      <div class="app-footer">
        Indicatief · Gebaseerd op openbare bronnen en marktdata 2024–2025 ·
        Bedragen zijn bruto jaarsalaris excl. 8% vakantiegeld
      </div>
    </div>
  `;
}

// ── Role selection ─────────────────────────────────────────────────────────────
function renderRoleSelect() {
  const roles = SALARY_DATA.roles;

  const trackOrder = ['support', 'consulting', 'architect', 'management'];
  const trackLabel = { support: 'Support track', consulting: 'Consulting track', architect: 'Architectuur track', management: 'Management track' };

  let cardHTML = '';
  for (const track of trackOrder) {
    const trackRoles = roles.filter(r => r.track === track);
    cardHTML += `<p style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--muted);margin:16px 0 8px;">${trackLabel[track]}</p>`;
    cardHTML += `<div class="option-grid cols-1">`;
    for (const role of trackRoles) {
      const sel = state.selectedRole === role.id ? 'selected' : '';
      cardHTML += `
        <div class="option-card ${sel}" onclick="selectRole('${role.id}')">
          <div class="oc-icon">${role.icon}</div>
          <div>
            <div class="oc-label">${role.label}</div>
            <div class="oc-desc">${role.description} · ${role.yearsExp}</div>
          </div>
        </div>
      `;
    }
    cardHTML += `</div>`;
  }

  app.innerHTML = `
    ${progressBar(1)}
    <div class="screen">
      <div class="card">
        <div class="question-title">👤 Uw rol</div>
        <div class="question-subtitle">
          Selecteer de functie die het beste aansluit bij uw huidige of gewenste positie.
        </div>
        ${cardHTML}
        <div class="btn-row">
          <button class="btn btn-outline" onclick="goBack()">← Terug</button>
          <button class="btn btn-primary" onclick="nextStep()" ${!state.selectedRole ? 'disabled' : ''}>
            Volgende →
          </button>
        </div>
      </div>
    </div>
  `;
}

// ── Generic question screen ────────────────────────────────────────────────────
function renderQuestion(key, title, subtitle, options, context) {
  let optHTML = '';
  for (const opt of options) {
    const sel = state[key] === opt.id ? 'selected' : '';
    optHTML += `
      <div class="radio-option ${sel}" onclick="selectOption('${key}','${opt.id}')">
        <div class="radio-dot"></div>
        <span style="font-size:1.2rem;flex-shrink:0;">${opt.icon || ''}</span>
        <span>
          <span style="display:block;font-weight:600;">${opt.label}</span>
          ${opt.desc ? `<span style="display:block;font-size:.78rem;color:var(--muted);margin-top:2px;line-height:1.4;">${opt.desc}</span>` : ''}
        </span>
      </div>
    `;
  }

  const stepNum = { education: 2, certifications: 3, platform_depth: 4, performance: 5 }[key];

  app.innerHTML = `
    ${progressBar(stepNum)}
    <div class="screen">
      <div class="card">
        <div class="question-title">${title}</div>
        <div class="question-subtitle">${subtitle}</div>
        ${context ? `<div class="info-box">${context}</div>` : ''}
        <div class="radio-group">${optHTML}</div>
        <div class="btn-row">
          <button class="btn btn-outline" onclick="goBack()">← Terug</button>
          <button class="btn btn-primary" onclick="nextStep()" ${!state[key] ? 'disabled' : ''}>
            ${stepNum === 5 ? 'Bereken salaris 💰' : 'Volgende →'}
          </button>
        </div>
      </div>
    </div>
  `;
}

// ── Result ─────────────────────────────────────────────────────────────────────
function renderResult() {
  const role = SALARY_DATA.roles.find(r => r.id === state.selectedRole);
  if (!role) { state.step = 1; render(); return; }

  const pos = computePosition();
  const band = computeActiveBand(role.band);
  const mySalary = salaryAtPosition(band, pos);
  const { min, mid, max } = band;

  // position in band as % for the visual bar (relative to min)
  const bandRange = max - min;
  const myPct = Math.round(((mySalary - min) / bandRange) * 100);

  // active adjustments for the pill display
  const adj = SALARY_DATA.adjustments;
  const pills = [];
  for (const [cat, key] of [
    ['education', state.education],
    ['certifications', state.certifications],
    ['platform_depth', state.platform_depth],
    ['performance', state.performance],
  ]) {
    if (key && adj[cat][key]) {
      const w = adj[cat][key].weight;
      const type = w > 0 ? 'positive' : w < 0 ? 'neutral' : '';
      const arrow = w > 0 ? '↑' : w < 0 ? '↓' : '→';
      pills.push(`<span class="factor-pill ${type}">${arrow} ${adj[cat][key].label}</span>`);
    }
  }

  const trackLabel = { support: 'Support track', consulting: 'Consulting track', architect: 'Architectuur track', management: 'Management track' };

  // benchmark source toggle cards
  const activeCount = state.activeSources.size;
  const totalCount  = SALARY_DATA.benchmarkSources.length;
  const sourceCardsHTML = SALARY_DATA.benchmarkSources.map(src => {
    const active = state.activeSources.has(src.id);
    const srcMin = Math.round(role.band.min * src.factors.min);
    const srcMax = Math.round(role.band.max * src.factors.max);
    return `
      <div class="source-card${active ? ' active' : ''}" onclick="toggleSource('${src.id}')">
        <div class="source-card-check">${active ? '✓' : ''}</div>
        <div class="source-card-icon">${src.icon}</div>
        <div class="source-card-body">
          <div class="source-card-label">${src.label}</div>
          <div class="source-card-range">${fmtK(srcMin)} – ${fmtK(srcMax)}</div>
        </div>
      </div>
    `;
  }).join('');

  app.innerHTML = `
    <div class="screen">
      <div class="card">

        <div class="result-header">
          <div class="role-badge">${role.icon} ${role.label}</div>
          <h2>Uw salarisbandbreedte</h2>
          <p>
            Op basis van uw profiel valt uw marktconform salaris binnen de onderstaande
            bandbreedte voor een Nederlandse low-code dienstverleningsorganisatie.
          </p>
        </div>

        <!-- Main salary block -->
        <div class="salary-main">
          <div class="sm-label">Uw indicatieve marktsalaris</div>
          <div class="sm-range">${fmt(mySalary)} / jaar</div>
          <div class="sm-sub">Bruto jaarsalaris excl. 8% vakantiegeld · ${role.track === 'support' ? 'Support' : role.track === 'architect' ? 'Architectuur' : role.track === 'management' ? 'Management' : 'Consulting'} track</div>
        </div>

        <!-- Band values -->
        <div class="band-values">
          <div class="band-value-card">
            <div class="bvc-label">Minimum (P25)</div>
            <div class="bvc-amount">${fmt(min)}</div>
            <div class="bvc-monthly">${fmtMonthly(min)} / maand</div>
          </div>
          <div class="band-value-card">
            <div class="bvc-label">Mediaan (P50)</div>
            <div class="bvc-amount mid">${fmt(mid)}</div>
            <div class="bvc-monthly">${fmtMonthly(mid)} / maand</div>
          </div>
          <div class="band-value-card">
            <div class="bvc-label">Maximum (P75)</div>
            <div class="bvc-amount">${fmt(max)}</div>
            <div class="bvc-monthly">${fmtMonthly(max)} / maand</div>
          </div>
        </div>

        <!-- Band visual -->
        <div class="band-visual">
          <div class="band-visual-label">
            <span>${fmtK(min)}</span>
            <span style="color:var(--accent);font-weight:600;">Uw positie: ${fmtK(mySalary)}</span>
            <span>${fmtK(max)}</span>
          </div>
          <div class="band-track">
            <div class="band-fill" id="bandFill" style="left:0;width:0;"></div>
            <div class="band-marker" id="bandMarker" style="left:0;"></div>
          </div>
          <div class="band-visual-label" style="margin-top:4px;">
            <span style="font-size:.7rem;color:var(--muted);">Laagste bandbreedte</span>
            <span style="font-size:.7rem;color:var(--muted);">Hoogste bandbreedte</span>
          </div>
        </div>

        <!-- Benchmark sources -->
        <div class="context-section">
          <h3>📊 Benchmarkbronnen
            <span style="margin-left:auto;font-size:.75rem;font-weight:400;color:var(--muted);">
              ${activeCount} van ${totalCount} actief
            </span>
          </h3>
          <p style="font-size:.82rem;color:var(--muted);margin-bottom:14px;line-height:1.5;">
            Klik op een bron om deze aan of uit te zetten. Het salaris wordt direct herberekend
            op basis van de geselecteerde bronnen. Per bron zie je het bandbreedte-bereik (min – max)
            dat die bron voor deze rol suggereert.
          </p>
          <div class="source-toggle-grid">
            ${sourceCardsHTML}
          </div>
        </div>

        <!-- Adjustment factors -->
        <div class="info-box">
          <strong>Profielfactoren</strong> die uw positie in de band bepalen:<br/>
          <div class="factor-pills" style="margin-top:8px;">${pills.join('') || '<span class="factor-pill">Geen factoren geselecteerd</span>'}</div>
        </div>

        <!-- Context -->
        <div class="context-section">
          <h3>📋 Functiecontext</h3>
          <div class="context-grid">
            <div class="context-item">
              <div class="ci-label">Functie</div>
              <div class="ci-value">${role.label}</div>
            </div>
            <div class="context-item">
              <div class="ci-label">Track</div>
              <div class="ci-value">${trackLabel[role.track]}</div>
            </div>
            <div class="context-item">
              <div class="ci-label">Ervaringsindicatie</div>
              <div class="ci-value">${role.yearsExp}</div>
            </div>
            <div class="context-item">
              <div class="ci-label">Positie in band</div>
              <div class="ci-value">${myPct < 33 ? 'Onderkant' : myPct < 66 ? 'Midden' : 'Bovenkant'} (${myPct}%)</div>
            </div>
          </div>
        </div>

        <!-- Secondary benefits -->
        <div class="context-section">
          <h3>🎁 Secundaire arbeidsvoorwaarden (indicatief)</h3>
          <div class="context-grid">
            ${Object.values(SALARY_DATA.benefits).map(b => `
              <div class="context-item">
                <div class="ci-value" style="font-size:.82rem;font-weight:400;">${b}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Actions -->
        <div class="result-actions">
          <button class="btn btn-outline" onclick="restart()">↩ Opnieuw beginnen</button>
          <button class="btn btn-outline" onclick="showAllRoles()">📋 Alle rollen</button>
          <button class="btn btn-accent" onclick="window.print()">🖨️ Afdrukken</button>
        </div>

      </div>
      <div class="app-footer">
        Indicatief · Marktdata 2024–2025 · Bruto jaarsalaris excl. vakantiegeld ·
        Geen rechten te ontlenen aan deze indicatie
      </div>
    </div>
  `;

  // Animate the band bar after render
  setTimeout(() => {
    const fill   = document.getElementById('bandFill');
    const marker = document.getElementById('bandMarker');
    if (fill && marker) {
      fill.style.width  = myPct + '%';
      marker.style.left = myPct + '%';
    }
  }, 80);
}

// ── All Roles Overview ─────────────────────────────────────────────────────────
function renderOverview() {
  const tracks = {
    support:    { label: '🎧 Support track',      roles: [] },
    consulting: { label: '💼 Consulting track',   roles: [] },
    architect:  { label: '🏗️ Architectuur track', roles: [] },
    management: { label: '👥 Management track',   roles: [] },
  };

  for (const role of SALARY_DATA.roles) {
    if (tracks[role.track]) tracks[role.track].roles.push(role);
  }

  let tableHTML = `
    <table class="overview-table">
      <thead>
        <tr>
          <th>Functie</th>
          <th>Track</th>
          <th>Ervaring</th>
          <th>Min (P25)</th>
          <th>Mid (P50)</th>
          <th>Max (P75)</th>
          <th>Maand min</th>
          <th>Maand mid</th>
          <th>Maand max</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (const role of SALARY_DATA.roles) {
    const trackClass = { support: 'support', consulting: 'consulting', architect: 'architect', management: 'management' }[role.track];
    const trackNames = { support: 'Support', consulting: 'Consulting', architect: 'Architectuur', management: 'Management' };
    tableHTML += `
      <tr>
        <td><span style="margin-right:8px;">${role.icon}</span><strong>${role.label}</strong></td>
        <td><span class="track-badge ${trackClass}">${trackNames[role.track]}</span></td>
        <td>${role.yearsExp}</td>
        <td>${fmt(role.band.min)}</td>
        <td style="color:var(--accent);font-weight:600;">${fmt(role.band.mid)}</td>
        <td>${fmt(role.band.max)}</td>
        <td>${fmtMonthly(role.band.min)}</td>
        <td style="color:var(--accent);font-weight:600;">${fmtMonthly(role.band.mid)}</td>
        <td>${fmtMonthly(role.band.max)}</td>
      </tr>
    `;
  }

  tableHTML += `</tbody></table>`;

  app.innerHTML = `
    <div class="screen">
      <div class="card">
        <div class="logo-wrap" style="margin-bottom:24px;">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <div class="logo-name">Salarishuis – Overzicht alle rollen</div>
            <div class="logo-sub">Low Code Enterprise Solutions · Nederland · 2024–2025</div>
          </div>
        </div>

        <div class="info-box">
          Bruto jaarsalaris in euro's (excl. 8% vakantiegeld) · P25 = instap, P50 = marktreferentie, P75 = bovenkant band ·
          Gebaseerd op marktdata voor een Nederlandse dienstverleningsorganisatie (~120 medewerkers).
        </div>

        ${tableHTML}

        <div style="margin-top:28px;padding-top:20px;border-top:1px solid var(--border);">
          <div class="question-title" style="font-size:1rem;margin-bottom:10px;">🎁 Secundaire arbeidsvoorwaarden</div>
          <div class="context-grid">
            ${Object.values(SALARY_DATA.benefits).map(b => `
              <div class="context-item">
                <div class="ci-value" style="font-size:.82rem;font-weight:400;">${b}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="result-actions" style="margin-top:24px;">
          <button class="btn btn-outline" onclick="goHome()">← Terug naar start</button>
          <button class="btn btn-primary" onclick="goStart()">Bereken mijn salaris →</button>
          <button class="btn btn-accent" onclick="window.print()">🖨️ Afdrukken</button>
        </div>
      </div>
      <div class="app-footer">
        Indicatief · Marktdata 2024–2025 · Bruto jaarsalaris excl. vakantiegeld
      </div>
    </div>
  `;
}

// ── Progress bar ───────────────────────────────────────────────────────────────
function progressBar(stepNum) {
  const pct = Math.round((stepNum / TOTAL_STEPS) * 100);
  return `
    <div class="progress-wrap">
      <div class="progress-label">
        <span>Stap ${stepNum} van ${TOTAL_STEPS}</span>
        <span>${pct}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-bar-fill" style="width:${pct}%"></div>
      </div>
    </div>
  `;
}

// ── Actions ────────────────────────────────────────────────────────────────────
function goStart() {
  state.showOverview = false;
  state.step = 1;
  render();
}

function goHome() {
  state.showOverview = false;
  state.step = 0;
  render();
}

function goBack() {
  if (state.step > 0) { state.step--; render(); }
}

function nextStep() {
  state.step++;
  render();
}

function restart() {
  state.step = 0;
  state.selectedRole = null;
  state.education = null;
  state.certifications = null;
  state.platform_depth = null;
  state.performance = null;
  state.showOverview = false;
  state.activeSources = new Set(SALARY_DATA.benchmarkSources.map(s => s.id));
  render();
}

function showAllRoles() {
  state.showOverview = true;
  render();
}

function selectRole(id) {
  state.selectedRole = id;
  render();
}

function selectOption(key, value) {
  state[key] = value;
  render();
}

function toggleSource(id) {
  if (state.activeSources.has(id)) {
    // Keep at least one source active
    if (state.activeSources.size > 1) {
      state.activeSources.delete(id);
    }
  } else {
    state.activeSources.add(id);
  }
  render();
}

// ── Bootstrap ──────────────────────────────────────────────────────────────────
render();
