/**
 * app.js – Salary House application logic
 * Dutch Low Code Enterprise Solutions | ~120 employees
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
  showBenchmarkSources: false,
  activeSources: new Set(SALARY_DATA.benchmarkSources.map(s => s.id)),
};

const TOTAL_STEPS = 6; // welcome + 4 questions + result

// ── Performance profile descriptions ─────────────────────────────────────────
const PERFORMANCE_DESCS = {
  developing: 'You are still developing towards the full role expectations. This is common for starters or employees who have recently changed roles. Your salary will typically be in the lower part of the band.',
  meets:      'You consistently meet all stated role expectations. This is the standard reference point for a well-functioning employee in this role and corresponds to the middle of the salary band.',
  exceeds:    'You structurally exceed the role expectations: you take initiative, deliver extra impact and are recognised as a strong contributor. This justifies a position in the higher part of the salary band.',
};

// ── Platform expertise descriptions ──────────────────────────────────────────
const PLATFORM_DEPTH_DESCS = {
  general:    'Work experience with low-code platforms at a functional level. You can perform basic tasks but are not a specialist in one specific platform.',
  specialist: 'In-depth knowledge of one or more low-code platforms (e.g. Mendix, OutSystems or ServiceNow). You independently build complex applications and configurations.',
  expert:     'Officially certified by the platform vendor (e.g. Mendix Advanced or Expert Certification). You are regarded as an internal knowledge owner and are deployed in pre-sales and knowledge transfer.',
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
  if (state.showBenchmarkSources) {
    renderBenchmarkSources();
  } else if (state.showOverview) {
    renderOverview();
  } else if (state.step === 0) {
    renderWelcome();
  } else if (state.step === 1) {
    renderRoleSelect();
  } else if (state.step === 2) {
    renderQuestion('education', '🎓 Education Level', 'What is your highest completed level of education?',
      Object.entries(SALARY_DATA.adjustments.education).map(([k, v]) => ({
        id: k, label: v.label, desc: null, icon: { mbo: '📘', hbo: '📗', university: '🎓' }[k],
      }))
    );
  } else if (state.step === 3) {
    renderQuestion('certifications', '🏅 Certifications', 'How many relevant low-code / platform certifications do you hold?',
      Object.entries(SALARY_DATA.adjustments.certifications).map(([k, v]) => ({
        id: k, label: v.label, desc: null, icon: { none: '⬜', one: '🟦', two: '🟩', three: '🟨', four_plus: '🟧' }[k],
      })),
      'A certification is an official proof of professional competence, issued by a platform vendor or recognised training provider (e.g. Mendix Rapid Developer, Advanced or Expert; OutSystems Associate or Professional; ServiceNow CSA). It demonstrates that you have successfully completed a standardised test or practical assessment.'
    );
  } else if (state.step === 4) {
    renderQuestion('platform_depth', '🔧 Platform Expertise', 'How would you describe your depth of knowledge on the low-code platform you use?',
      Object.entries(SALARY_DATA.adjustments.platform_depth).map(([k, v]) => ({
        id: k, label: v.label, desc: PLATFORM_DEPTH_DESCS[k], icon: { general: '🌐', specialist: '⚙️', expert: '🏆' }[k],
      }))
    );
  } else if (state.step === 5) {
    renderQuestion('performance', '📊 Performance Profile', 'How do you perform relative to the role expectations?',
      Object.entries(SALARY_DATA.adjustments.performance).map(([k, v]) => ({
        id: k, label: v.label, desc: PERFORMANCE_DESCS[k],
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
            <div class="logo-name">Salary House</div>
            <div class="logo-sub">Low Code Enterprise Solutions · Netherlands</div>
          </div>
        </div>

        <div class="welcome-hero">
          <div class="welcome-badge">🇳🇱 Market Salary 2023 – 2026</div>
          <h1>What do you earn in the<br/>low-code market?</h1>
          <p>
            This tool guides you through a number of questions and calculates, based on
            your profile, a market-conform salary indication for your role within a
            Dutch service organisation (~120 FTE) focused on
            low-code enterprise solutions.
          </p>

          <div class="feature-list">
            <div class="feature-item">
              <div class="fi-icon">💰</div>
              <div>
                <strong>Market Salary 2023–2026</strong><br/>
                Based on CBS data, salary surveys and industry benchmarks.
              </div>
            </div>
            <div class="feature-item">
              <div class="fi-icon">🎯</div>
              <div>
                <strong>8 roles</strong><br/>
                From Support Consultant to Solution Architect and Team Lead with corresponding bands.
              </div>
            </div>
            <div class="feature-item">
              <div class="fi-icon">🔧</div>
              <div>
                <strong>Personal profile</strong><br/>
                Education, certifications and performance determine your position in the band.
              </div>
            </div>
            <div class="feature-item" onclick="showAllRoles()" style="cursor:pointer;">
              <div class="fi-icon">📋</div>
              <div>
                <strong>Full overview</strong><br/>
                Also view the salary bands of all other roles at a glance.
              </div>
            </div>
          </div>

          <div class="btn-row" style="justify-content:center; gap:12px; flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="goStart()">
              Start the calculation →
            </button>
            <button class="btn btn-outline" onclick="showAllRoles()">
              📋 View all roles
            </button>
          </div>
        </div>
      </div>
      <div class="app-footer">
        Indicative · Based on public sources and market data 2023–2026 ·
        Amounts are gross annual salary excl. 8% holiday allowance
      </div>
    </div>
  `;
}

// ── Role selection ─────────────────────────────────────────────────────────────
function renderRoleSelect() {
  const roles = SALARY_DATA.roles;

  const trackOrder = ['support', 'consulting', 'architect', 'management'];
  const trackLabel = { support: 'Support track', consulting: 'Consulting track', architect: 'Architecture track', management: 'Management track' };

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
        <div class="question-title">👤 Your Role</div>
        <div class="question-subtitle">
          Select the position that best matches your current or desired role.
        </div>
        ${cardHTML}
        <div class="btn-row">
          <button class="btn btn-outline" onclick="goBack()">← Back</button>
          <button class="btn btn-primary" onclick="nextStep()" ${!state.selectedRole ? 'disabled' : ''}>
            Next →
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
          <button class="btn btn-outline" onclick="goBack()">← Back</button>
          <button class="btn btn-primary" onclick="nextStep()" ${!state[key] ? 'disabled' : ''}>
            ${stepNum === 5 ? 'Calculate Salary 💰' : 'Next →'}
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

  const trackLabel = { support: 'Support track', consulting: 'Consulting track', architect: 'Architecture track', management: 'Management track' };

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
          <h2>Your Salary Band</h2>
          <p>
            Based on your profile, your market-conform salary falls within the following
            band for a Dutch low-code service organisation.
          </p>
        </div>

        <!-- Main salary block -->
        <div class="salary-main">
          <div class="sm-label">Your indicative market salary</div>
          <div class="sm-range">${fmt(mySalary)} / year</div>
          <div class="sm-sub">Gross annual salary excl. 8% holiday allowance · ${role.track === 'support' ? 'Support' : role.track === 'architect' ? 'Architecture' : role.track === 'management' ? 'Management' : 'Consulting'} track</div>
        </div>

        <!-- Band values -->
        <div class="band-values">
          <div class="band-value-card">
            <div class="bvc-label">Minimum (P25)</div>
            <div class="bvc-amount">${fmt(min)}</div>
            <div class="bvc-monthly">${fmtMonthly(min)} / month</div>
          </div>
          <div class="band-value-card">
            <div class="bvc-label">Median (P50)</div>
            <div class="bvc-amount mid">${fmt(mid)}</div>
            <div class="bvc-monthly">${fmtMonthly(mid)} / month</div>
          </div>
          <div class="band-value-card">
            <div class="bvc-label">Maximum (P75)</div>
            <div class="bvc-amount">${fmt(max)}</div>
            <div class="bvc-monthly">${fmtMonthly(max)} / month</div>
          </div>
        </div>

        <!-- Band visual -->
        <div class="band-visual">
          <div class="band-visual-label">
            <span>${fmtK(min)}</span>
            <span style="color:var(--accent);font-weight:600;">Your position: ${fmtK(mySalary)}</span>
            <span>${fmtK(max)}</span>
          </div>
          <div class="band-track">
            <div class="band-fill" id="bandFill" style="left:0;width:0;"></div>
            <div class="band-marker" id="bandMarker" style="left:0;"></div>
          </div>
          <div class="band-visual-label" style="margin-top:4px;">
            <span style="font-size:.7rem;color:var(--muted);">Bottom of band</span>
            <span style="font-size:.7rem;color:var(--muted);">Top of band</span>
          </div>
        </div>

        <!-- Benchmark sources -->
        <div class="context-section">
          <h3>📊 Benchmark Sources
            <span style="margin-left:auto;font-size:.75rem;font-weight:400;color:var(--muted);">
              ${activeCount} of ${totalCount} active
            </span>
          </h3>
          <p style="font-size:.82rem;color:var(--muted);margin-bottom:14px;line-height:1.5;">
            Click a source to toggle it on or off. The salary is immediately recalculated
            based on the selected sources. Per source you can see the band range (min – max)
            that source suggests for this role.
          </p>
          <div class="source-toggle-grid">
            ${sourceCardsHTML}
          </div>
        </div>

        <!-- Adjustment factors -->
        <div class="info-box">
          <strong>Profile factors</strong> that determine your position in the band:<br/>
          <div class="factor-pills" style="margin-top:8px;">${pills.join('') || '<span class="factor-pill">No factors selected</span>'}</div>
        </div>

        <!-- Context -->
        <div class="context-section">
          <h3>📋 Role Context</h3>
          <div class="context-grid">
            <div class="context-item">
              <div class="ci-label">Role</div>
              <div class="ci-value">${role.label}</div>
            </div>
            <div class="context-item">
              <div class="ci-label">Track</div>
              <div class="ci-value">${trackLabel[role.track]}</div>
            </div>
            <div class="context-item">
              <div class="ci-label">Experience indication</div>
              <div class="ci-value">${role.yearsExp}</div>
            </div>
            <div class="context-item">
              <div class="ci-label">Position in band</div>
              <div class="ci-value">${myPct < 33 ? 'Lower end' : myPct < 66 ? 'Middle' : 'Upper end'} (${myPct}%)</div>
            </div>
          </div>
        </div>

        <!-- Secondary benefits -->
        <div class="context-section">
          <h3>🎁 Secondary Benefits (indicative)</h3>
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
          <button class="btn btn-outline" onclick="restart()">↩ Start over</button>
          <button class="btn btn-outline" onclick="showAllRoles()">📋 All roles</button>
          <button class="btn btn-accent" onclick="window.print()">🖨️ Print</button>
        </div>

      </div>
      <div class="app-footer">
        Indicative · Market data 2023–2026 · Gross annual salary excl. holiday allowance ·
        No rights can be derived from this indication
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
    architect:  { label: '🏗️ Architecture track', roles: [] },
    management: { label: '👥 Management track',   roles: [] },
  };

  for (const role of SALARY_DATA.roles) {
    if (tracks[role.track]) tracks[role.track].roles.push(role);
  }

  let tableHTML = `
    <table class="overview-table">
      <thead>
        <tr>
          <th>Role</th>
          <th>Track</th>
          <th>Experience</th>
          <th>Min (P25)</th>
          <th>Mid (P50)</th>
          <th>Max (P75)</th>
          <th>Month min</th>
          <th>Month mid</th>
          <th>Month max</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (const role of SALARY_DATA.roles) {
    const trackClass = { support: 'support', consulting: 'consulting', architect: 'architect', management: 'management' }[role.track];
    const trackNames = { support: 'Support', consulting: 'Consulting', architect: 'Architecture', management: 'Management' };
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
            <div class="logo-name">Salary House – All Roles Overview</div>
            <div class="logo-sub">Low Code Enterprise Solutions · Netherlands · 2023–2026</div>
          </div>
        </div>

        <div class="info-box">
          Gross annual salary in euros (excl. 8% holiday allowance) · P25 = entry, P50 = market reference, P75 = top of band ·
          Based on market data for a Dutch service organisation (~120 employees).
        </div>

        ${tableHTML}

        <div style="margin-top:28px;padding-top:20px;border-top:1px solid var(--border);">
          <div class="question-title" style="font-size:1rem;margin-bottom:10px;">🎁 Secondary Benefits</div>
          <div class="context-grid">
            ${Object.values(SALARY_DATA.benefits).map(b => `
              <div class="context-item">
                <div class="ci-value" style="font-size:.82rem;font-weight:400;">${b}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="result-actions" style="margin-top:24px;">
          <button class="btn btn-outline" onclick="goHome()">← Back to start</button>
          <button class="btn btn-primary" onclick="goStart()">Calculate my salary →</button>
          <button class="btn btn-accent" onclick="window.print()">🖨️ Print</button>
        </div>
      </div>
      <div class="app-footer">
        Indicative · Market data 2023–2026 · Gross annual salary excl. holiday allowance
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
        <span>Step ${stepNum} of ${TOTAL_STEPS}</span>
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
  state.showBenchmarkSources = false;
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
  state.showBenchmarkSources = false;
  state.activeSources = new Set(SALARY_DATA.benchmarkSources.map(s => s.id));
  render();
}

function showAllRoles() {
  state.showOverview = true;
  render();
}

function showBenchmarkSourcesPage() {
  state.showBenchmarkSources = true;
  render();
}

function goHomeBenchmark() {
  state.showBenchmarkSources = false;
  render();
}

function goStartBenchmark() {
  state.showBenchmarkSources = false;
  state.step = 1;
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
