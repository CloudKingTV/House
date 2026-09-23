/* SagaDAO House dashboard. Renders window.HOUSE_DATA (built from data/*.json by scripts/build.mjs). */
(function () {
  'use strict';

  const D = window.HOUSE_DATA;
  const view = document.getElementById('view');
  if (!D) {
    view.innerHTML = '<div class="empty">No data found. Run <code>node scripts/build.mjs</code> to generate <code>dashboard/data.js</code>.</div>';
    return;
  }

  const { event, tasks, sponsors, guests, programme, experiences, content, budget } = D;
  const REPO_BLOB = 'https://github.com/CloudKingTV/House/blob/main/';

  // ─── Helpers ──────────────────────────────────────────────
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const today = (() => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); })();
  const DAY = 86400000;
  const daysUntil = (s) => Math.round((parse(s) - today) / DAY);
  const fmt = (s, opts = { weekday: 'short', day: 'numeric', month: 'short' }) => parse(s).toLocaleDateString('en-GB', opts);
  const gbp = (n) => '£' + Math.round(n).toLocaleString('en-GB');
  const usd = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const compact = (n, sym) => sym + (n >= 1000 ? (n / 1000).toFixed(n >= 100000 ? 0 : 1).replace(/\.0$/, '') + 'k' : Math.round(n));
  const sum = (arr, f) => arr.reduce((a, x) => a + (f(x) || 0), 0);
  const pct = (a, b) => (b > 0 ? Math.max(0, Math.min(100, (a / b) * 100)) : 0);
  const docHref = (p) => (location.protocol === 'file:' ? '../' + p : REPO_BLOB + p);
  const meter = (value, max, cls = '') => `<div class="meter ${cls}" role="img" aria-label="${Math.round(pct(value, max))}%"><span style="width:${pct(value, max)}%"></span></div>`;
  const dueLabel = (s) => {
    const n = daysUntil(s);
    if (n === 0) return 'today';
    if (n === 1) return 'tomorrow';
    if (n < 0) return `${-n}d overdue`;
    return `in ${n}d`;
  };
  const dueTone = (n) => (n < 0 ? 'bad' : n <= 7 ? 'warn' : '');

  // ─── Derived numbers ──────────────────────────────────────
  const fx = event.fxUsdPerGbp;
  const SECURED = ['signed', 'paid', 'delivered'];
  const securedUsd = sum(sponsors.sponsors.filter((s) => SECURED.includes(s.stage)), (s) => s.valueUsd);
  const talksUsd = sum(sponsors.sponsors.filter((s) => s.stage === 'talks'), (s) => s.valueUsd);
  const targetUsd = sum(sponsors.tiers, (t) => t.slots * t.priceUsd);
  const plannedGbp = sum(budget.lines, (l) => l.plannedGbp);
  const committedGbp = sum(budget.lines, (l) => l.committedGbp);
  const paidGbp = sum(budget.lines, (l) => l.paidGbp);
  const securedGbp = securedUsd / fx;
  const signedCount = sponsors.sponsors.filter((s) => SECURED.includes(s.stage)).length;
  const accepted = guests.guests.filter((g) => g.status === 'accepted');
  const openTasks = tasks.tasks.filter((t) => t.status !== 'done');
  const overdue = openTasks.filter((t) => daysUntil(t.due) < 0);

  const checkIn = event.house.checkIn;
  const checkOut = event.house.checkOut;
  const toDoors = daysUntil(checkIn);
  const phase = toDoors > 0 ? 'before' : daysUntil(checkOut) >= 0 ? 'live' : 'after';

  // ─── Masthead + footer ────────────────────────────────────
  document.getElementById('masthead-meta').innerHTML =
    phase === 'before'
      ? `<strong>T–${toDoors}</strong> to doors · ${esc(fmt(checkIn, { weekday: 'short', day: 'numeric', month: 'short' }))}<br>Breakpoint ${esc(fmt(event.conference.start, { day: 'numeric' }))}–${esc(fmt(event.conference.end, { day: 'numeric', month: 'short' }))} · Olympia`
      : phase === 'live'
        ? `<strong>Live · Day ${1 - toDoors}</strong><br>${esc(today.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }))}`
        : `<strong>Wrapped</strong><br>Reports due ${esc(fmt('2026-11-27'))}`;

  const built = window.HOUSE_BUILT_AT ? new Date(window.HOUSE_BUILT_AT) : null;
  document.getElementById('colophon').innerHTML = `
    <span>Data as of ${built ? esc(built.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })) : '—'}</span>
    <span>Edit <code>data/*.json</code> → run <code>node scripts/build.mjs</code></span>`;

  // ─── Views ────────────────────────────────────────────────
  const VIEWS = [
    { id: 'overview', label: 'Overview', render: renderOverview },
    { id: 'timeline', label: 'Timeline', render: renderTimeline },
    { id: 'sponsors', label: 'Partners', render: renderSponsors },
    { id: 'rooms', label: 'Rooms', render: renderRooms },
    { id: 'programme', label: 'Programme', render: renderProgramme },
    { id: 'experiences', label: 'Experiences', render: renderExperiences },
    { id: 'content', label: 'Content', render: renderContent },
    { id: 'budget', label: 'Budget', render: renderBudget },
  ];

  function renderOverview() {
    const deadlines = event.keyDates
      .filter((k) => daysUntil(k.date) >= 0)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);

    const focus = openTasks
      .filter((t) => daysUntil(t.due) <= 7)
      .sort((a, b) => a.due.localeCompare(b.due));

    const coverage = plannedGbp ? Math.round((securedGbp / plannedGbp) * 100) : 0;
    const charters = accepted.filter((g) => g.charterSigned).length;
    const done = tasks.tasks.length - openTasks.length;

    const countdown =
      phase === 'before'
        ? `<div class="countdown"><div class="countdown-num num">${toDoors}</div><div class="countdown-label">days until<br>doors open</div></div>`
        : phase === 'live'
          ? `<div class="countdown"><div class="countdown-num num">${1 - toDoors}</div><div class="countdown-label">day of the<br>house</div></div>`
          : `<div class="countdown"><div class="countdown-label">The house has wrapped.<br>Reports and retro next.</div></div>`;

    return `
      <section class="hero">
        <div>
          <div class="eyebrow">${esc(event.edition)} · ${esc(event.conference.venue.split(',')[0])}</div>
          <div style="margin-top:14px">${countdown}</div>
          <div class="hero-facts">
            <span>${esc(fmt(checkIn))} – ${esc(fmt(checkOut))}${event.house.checkOutConfirmed ? '' : '*'}</span>
            <span>${event.capacity.residents} residents</span>
            <span>${event.capacity.attendees}+ attendees</span>
            <span>${event.capacity.sponsors} partners</span>
          </div>
          ${event.house.checkOutConfirmed ? '' : '<p class="muted" style="font-size:12.5px;margin-top:8px">* Checkout 19 or 20 Nov still to confirm</p>'}
        </div>
        <div>
          <div class="section-head" style="margin-bottom:4px"><span class="eyebrow">Next hard dates</span></div>
          <ul class="deadlines">
            ${deadlines.map((k) => {
              const n = daysUntil(k.date);
              return `<li><span class="date">${esc(fmt(k.date))}</span><span>${esc(k.label)}</span><span class="pill ${k.kind === 'milestone' ? 'brass' : dueTone(n)}">${esc(dueLabel(k.date))}</span></li>`;
            }).join('')}
          </ul>
        </div>
      </section>

      <section>
        <div class="grid">
          <a class="panel stat" href="#sponsors" style="text-decoration:none">
            <span class="eyebrow">Partners signed</span>
            <span class="stat-value num">${signedCount}<small>of ${event.capacity.sponsors}</small></span>
            ${meter(signedCount, event.capacity.sponsors)}
            <span class="stat-note">${usd(securedUsd)} secured of ${usd(targetUsd)} target</span>
          </a>
          <a class="panel stat" href="#rooms" style="text-decoration:none">
            <span class="eyebrow">Residents confirmed</span>
            <span class="stat-value num">${accepted.length}<small>of ${event.capacity.residents}</small></span>
            ${meter(accepted.length, event.capacity.residents, 'green')}
            <span class="stat-note">${charters} charter${charters === 1 ? '' : 's'} signed</span>
          </a>
          <a class="panel stat" href="#budget" style="text-decoration:none">
            <span class="eyebrow">Cost covered by partners</span>
            <span class="stat-value num">${coverage}<small>%</small></span>
            ${meter(securedGbp, plannedGbp)}
            <span class="stat-note">${gbp(securedGbp)} secured vs ${gbp(plannedGbp)} planned</span>
          </a>
          <a class="panel stat" href="#timeline" style="text-decoration:none">
            <span class="eyebrow">Tasks complete</span>
            <span class="stat-value num">${done}<small>of ${tasks.tasks.length}</small></span>
            ${meter(done, tasks.tasks.length, 'good')}
            <span class="stat-note">${overdue.length ? `<span style="color:var(--bad)">${overdue.length} overdue</span>` : 'Nothing overdue'}</span>
          </a>
        </div>
      </section>

      <section class="split">
        <div>
          <div class="section-head"><h2 class="section-title">This week</h2><span class="eyebrow">Overdue + next 7 days</span></div>
          ${focus.length ? `<ul class="tasks">${focus.map(taskRow).join('')}</ul>` : '<div class="empty">Nothing due in the next seven days.</div>'}
        </div>
        <div class="stack">
          <div>
            <div class="section-head"><h2 class="section-title">Open decisions</h2></div>
            <ol class="decisions">${event.openDecisions.map((d) => `<li>${esc(d)}</li>`).join('')}</ol>
          </div>
        </div>
      </section>

      <section>
        <div class="section-head"><h2 class="section-title">Dubai → London</h2><a class="eyebrow" href="${docHref('docs/dubai-retro.md')}">Read the retro ↗</a></div>
        <div class="panel">
          <ul class="fixes">
            ${event.fixes.map((f) => `<li><span class="was">${esc(f.lesson)}</span><span>${esc(f.fix)}</span><span class="pill ${f.status === 'done' ? 'good' : f.status === 'in progress' ? 'brass' : ''}">${esc(f.status)}</span></li>`).join('')}
          </ul>
        </div>
      </section>`;
  }

  function taskRow(t) {
    const n = daysUntil(t.due);
    const cls = [t.status, t.status !== 'done' && n < 0 ? 'overdue' : ''].join(' ');
    const title = t.doc ? `<a href="${esc(docHref(t.doc))}">${esc(t.title)}</a>` : esc(t.title);
    return `<li class="task ${cls}">
      <span class="task-mark" aria-label="${esc(t.status)}"></span>
      <span class="task-title">${title}</span>
      <span class="task-due">${t.status === 'done' ? '<span class="muted">done</span>' : esc(dueLabel(t.due))}</span>
      <span class="task-meta"><span>${esc(t.area)}</span><span>${esc(fmt(t.due))}</span>${t.owner ? `<span>${esc(t.owner)}</span>` : ''}${t.status === 'blocked' ? '<span style="color:var(--bad)">blocked</span>' : ''}</span>
    </li>`;
  }

  // Timeline: tasks grouped by week, labelled relative to the live week.
  const state = { area: 'all', hideDone: false };
  const mondayOf = (d) => { const x = new Date(d); const w = (x.getDay() + 6) % 7; x.setDate(x.getDate() - w); return x; };
  const liveMonday = mondayOf(parse(event.conference.start));

  function renderTimeline() {
    const list = tasks.tasks
      .filter((t) => state.area === 'all' || t.area === state.area)
      .filter((t) => !state.hideDone || t.status !== 'done')
      .sort((a, b) => a.due.localeCompare(b.due));

    const weeks = new Map();
    for (const t of list) {
      const m = mondayOf(parse(t.due));
      const key = m.getTime();
      if (!weeks.has(key)) weeks.set(key, { monday: m, items: [] });
      weeks.get(key).items.push(t);
    }

    const label = (m) => {
      const w = Math.round((liveMonday - m) / (7 * DAY));
      if (w > 0) return `W–${w}`;
      if (w === 0) return 'Live week';
      return 'After';
    };

    return `
      <div class="section-head">
        <h2 class="section-title">Timeline</h2>
        <a class="eyebrow" href="${docHref('docs/planning/timeline.md')}">Full plan ↗</a>
      </div>
      <div class="filters" style="margin-bottom:22px" role="group" aria-label="Filter by area">
        ${['all', ...tasks.areas].map((a) => `<button class="chip" data-area="${a}" aria-pressed="${state.area === a}">${a === 'all' ? 'All areas' : esc(a)}</button>`).join('')}
        <button class="chip" data-hide-done aria-pressed="${state.hideDone}">Hide done</button>
      </div>
      ${weeks.size ? [...weeks.values()].map((w) => `
        <section class="week">
          <div class="week-head">
            <span class="eyebrow">${label(w.monday)}</span>
            <h3>w/c ${esc(w.monday.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }))}</h3>
            <span class="muted mono">${w.items.filter((t) => t.status === 'done').length}/${w.items.length} done</span>
          </div>
          <ul class="tasks">${w.items.map(taskRow).join('')}</ul>
        </section>`).join('') : '<div class="empty">No tasks match this filter.</div>'}`;
  }

  function bindTimeline() {
    view.querySelectorAll('[data-area]').forEach((b) => b.addEventListener('click', () => { state.area = b.dataset.area; render(); }));
    const hd = view.querySelector('[data-hide-done]');
    if (hd) hd.addEventListener('click', () => { state.hideDone = !state.hideDone; render(); });
  }

  function fundingChart() {
    const budgetUsd = plannedGbp * fx;
    const max = Math.max(targetUsd, budgetUsd, securedUsd + talksUsd) * 1.05;
    const at = (v) => `${(v / max) * 100}%`;
    const step = max > 150000 ? 50000 : 25000;
    const ticks = [];
    for (let v = 0; v <= max; v += step) ticks.push(v);
    const side = (v) => ((v / max) > 0.8 ? 'end' : 'mid');
    return `
      <div class="fchart" role="img" aria-label="Partner funding: ${usd(securedUsd)} secured, ${usd(talksUsd)} in talks, ${usd(targetUsd)} target, ${usd(budgetUsd)} planned cost">
        <div class="fchart-marks">
          <span class="fmark ${side(targetUsd)}" style="left:${at(targetUsd)}">Target ${compact(targetUsd, '$')}</span>
          <span class="fmark cost ${side(budgetUsd)}" style="left:${at(budgetUsd)}">Cost ${compact(budgetUsd, '$')}</span>
        </div>
        <div class="fchart-bar">
          ${ticks.map((v) => `<i class="ftick" style="left:${at(v)}"></i>`).join('')}
          <span class="fill talks" style="width:${at(securedUsd + talksUsd)}"></span>
          <span class="fill" style="width:${at(securedUsd)}"></span>
          <i class="fline" style="left:${at(targetUsd)}"></i>
          <i class="fline cost" style="left:${at(budgetUsd)}"></i>
        </div>
        <div class="fchart-axis">${ticks.map((v, i) => `<span style="left:${at(v)}" class="${i === 0 ? 'first' : ''}">${compact(v, '$')}</span>`).join('')}</div>
      </div>`;
  }

  function renderSponsors() {
    const byTier = (id) => sponsors.sponsors.filter((s) => s.tier === id && SECURED.includes(s.stage)).length;
    const stages = sponsors.stages.filter((s) => s !== 'lost');
    const lost = sponsors.sponsors.filter((s) => s.stage === 'lost');
    const gapUsd = targetUsd - plannedGbp * fx;

    return `
      <div class="section-head"><h2 class="section-title">Partners</h2><a class="eyebrow" href="${docHref('docs/sponsors/packages.md')}">Packages ↗</a></div>

      <div class="panel funding">
        <div class="section-head" style="margin-bottom:6px">
          <h3>Funding against cost</h3>
          <span class="mono muted">1 GBP = ${fx} USD</span>
        </div>
        ${fundingChart()}
        <div class="legend">
          <span><i style="background:var(--brass-fill)"></i>Secured ${usd(securedUsd)}</span>
          <span><i style="background:var(--brass-soft)"></i>In talks ${usd(talksUsd)}</span>
          <span><i style="background:var(--ink)"></i>Package target (12 slots)</span>
          <span><i style="background:var(--bad)"></i>Planned cost ${gbp(plannedGbp)}</span>
        </div>
        ${gapUsd < 0 ? `<p style="margin-top:12px;font-size:13.5px"><span class="pill warn">Gap</span>&nbsp; Selling all 12 slots at list price falls <strong>${usd(-gapUsd)}</strong> short of planned cost. Raise prices, add slots, find partner-funded lines, or trim the budget.</p>` : ''}
      </div>

      <div style="margin-top:24px" class="grid">
        ${sponsors.tiers.map((t) => `
          <div class="panel stack" style="gap:10px">
            <div><h3>${esc(t.name)}</h3><span class="mono muted">${usd(t.priceUsd)} · ${t.slots} slot${t.slots > 1 ? 's' : ''}</span></div>
            <div class="tier-slots" aria-label="${byTier(t.id)} of ${t.slots} slots filled">${Array.from({ length: t.slots }, (_, i) => `<span class="slot ${i < byTier(t.id) ? 'filled' : ''}"></span>`).join('')}</div>
            <p class="muted" style="font-size:13px">${t.owns.map(esc).join(' · ')}</p>
          </div>`).join('')}
      </div>

      <div style="margin-top:32px">
        <div class="section-head"><h2 class="section-title">Pipeline</h2><span class="eyebrow">${sponsors.sponsors.length} in pipeline${lost.length ? ` · ${lost.length} lost` : ''}</span></div>
        ${sponsors.sponsors.length ? `
          <div class="board">
            ${stages.map((st) => {
              const items = sponsors.sponsors.filter((s) => s.stage === st);
              return `<div class="col">
                <div class="col-head"><span class="eyebrow">${esc(st)}</span><span class="mono muted">${items.length}</span></div>
                ${items.map((s) => `<div class="card">
                  <strong>${esc(s.name)}</strong>
                  <span class="muted">${esc(sponsors.tiers.find((t) => t.id === s.tier)?.name || 'Tier TBC')}${s.valueUsd ? ' · ' + usd(s.valueUsd) : ''}</span>
                  ${s.owns ? `<div style="margin-top:4px">${esc(s.owns)}</div>` : ''}
                  ${s.nextStep ? `<div class="mono" style="margin-top:6px;color:${s.nextStepDue && daysUntil(s.nextStepDue) < 0 ? 'var(--bad)' : 'var(--muted)'}">→ ${esc(s.nextStep)}${s.nextStepDue ? ' · ' + esc(fmt(s.nextStepDue)) : ''}</div>` : ''}
                </div>`).join('')}
              </div>`;
            }).join('')}
          </div>` : `
          <div class="empty">
            <strong>The pipeline is empty.</strong> Add prospects to <code>data/sponsors.json</code>. Twelve signings usually take 30–40 prospects, and wave 1 outreach is due ${esc(fmt('2026-10-02'))}.
            <a href="${docHref('data/README.md')}">How to add a sponsor ↗</a>
          </div>`}
      </div>`;
  }

  function renderRooms() {
    const T = guests.commitmentTargets;
    const targetTotal = Object.values(T).reduce((a, b) => a + b, 0);
    const byRoom = new Map(guests.guests.filter((g) => g.room).map((g) => [g.room, g]));
    const unroomed = guests.guests.filter((g) => !g.room && g.status !== 'declined');
    const count = (f) => accepted.filter(f).length;
    const check = (ok, label) => `<span class="pill ${ok ? 'good' : ''}">${ok ? '✓ ' : ''}${label}</span>`;

    const keys = Array.from({ length: event.capacity.residents }, (_, i) => {
      const room = String(i + 1).padStart(2, '0');
      const g = byRoom.get(room);
      if (!g) {
        return `<div class="key vacant"><span class="key-num">${room}</span><span class="key-name">Unassigned</span><span class="key-foot">Room ${room}</span></div>`;
      }
      const doneTotal = Object.keys(T).reduce((a, k) => a + Math.min(g.commitments?.[k] || 0, T[k]), 0);
      return `<div class="key">
        <span class="key-num">${room}</span>
        <span class="key-name">${esc(g.name)}</span>
        <span class="muted" style="font-size:13px;margin-top:-6px">${esc(g.handle || '')} · ${esc(g.status)}</span>
        <div class="key-checks">
          ${check(g.charterSigned, 'Charter')}${check(g.preferencesReceived, 'Prefs')}${check(g.dossierSent, 'Dossier')}${check(g.carBooked, 'Car')}
        </div>
        ${meter(doneTotal, targetTotal, 'green')}
        <span class="key-foot">Commitments ${doneTotal}/${targetTotal}${g.arrival?.date ? ` · lands ${esc(fmt(g.arrival.date, { weekday: 'short', day: 'numeric' }))} ${esc(g.arrival.time || '')} ${esc(g.arrival.airport || '')}` : ''}</span>
      </div>`;
    }).join('');

    return `
      <div class="section-head"><h2 class="section-title">Rooms</h2><a class="eyebrow" href="${docHref('docs/guests/house-charter.md')}">House Charter ↗</a></div>
      <div class="filters" style="margin-bottom:22px">
        <span class="pill">${accepted.length}/${event.capacity.residents} accepted</span>
        <span class="pill">${count((g) => g.charterSigned)} charters</span>
        <span class="pill">${count((g) => g.preferencesReceived)} preference forms</span>
        <span class="pill">${count((g) => g.dossierSent)} dossiers</span>
        <span class="pill">${count((g) => g.carBooked)} cars</span>
      </div>
      ${guests.guests.length === 0 ? `<div class="empty" style="margin-bottom:20px">No residents yet. Shortlist 16–18 candidates for 12 rooms and add them to <code>data/guests.json</code>; invitations with the charter go out by ${esc(fmt('2026-10-09'))}.</div>` : ''}
      <div class="keys">${keys}</div>
      ${unroomed.length ? `
        <div style="margin-top:32px">
          <div class="section-head"><h2 class="section-title">Shortlist and invited</h2></div>
          <div class="panel panel-flush table-wrap"><table>
            <thead><tr><th>Name</th><th>Handle</th><th>Status</th><th>Charter</th><th>Notes</th></tr></thead>
            <tbody>${unroomed.map((g) => `<tr><td>${esc(g.name)}</td><td class="mono">${esc(g.handle || '')}</td><td><span class="pill">${esc(g.status)}</span></td><td>${g.charterSigned ? '✓' : '—'}</td><td class="muted">${esc(g.notes || '')}</td></tr>`).join('')}</tbody>
          </table></div>
        </div>` : ''}`;
  }

  function renderProgramme() {
    const confStart = event.conference.start, confEnd = event.conference.end;
    const all = programme.days.flatMap((d) => d.items);
    const confirmed = all.filter((i) => i.status === 'confirmed').length;
    const fmtTone = { flagship: 'brass', session: 'green', breakfast: 'green', demo: 'green', 'closed-door': 'green', studio: 'green', 'office-hours': 'green' };
    return `
      <div class="section-head"><h2 class="section-title">Programme</h2><span class="eyebrow">${confirmed}/${all.length} confirmed · <a href="${docHref('docs/programme/strategy.md')}">Strategy ↗</a></span></div>
      <div class="panel">
        ${programme.days.map((d) => {
          const bp = d.date >= confStart && d.date <= confEnd;
          return `<div class="day">
            <div class="day-date">${esc(fmt(d.date, { weekday: 'short', day: 'numeric' }))} Nov<small>${esc(d.label)}${bp ? ' · at Olympia' : ''}</small></div>
            <ul class="slots">
              ${d.items.map((it) => `<li>
                <span class="time">${esc(it.time)}</span>
                <span>${esc(it.title)}${it.partner ? ` <span class="muted">· ${esc(it.partner)}</span>` : ''}</span>
                <span class="fmt"><span class="pill ${it.status === 'confirmed' ? 'good' : fmtTone[it.format] || ''}">${esc(it.format)}</span></span>
                <span class="aud">${esc(it.audience || '')}${it.status === 'confirmed' ? ' · confirmed' : ''}</span>
              </li>`).join('')}
            </ul>
          </div>`;
        }).join('')}
      </div>`;
  }

  function renderExperiences() {
    const tone = { idea: '', enquired: 'warn', held: 'brass', booked: 'good', cancelled: 'bad' };
    const counts = experiences.statuses.map((s) => [s, experiences.experiences.filter((x) => x.status === s).length]).filter(([, n]) => n);
    const kinds = [['signature', 'Signature'], ['relaxed', 'Relaxed']];
    return `
      <div class="section-head"><h2 class="section-title">Experiences</h2><a class="eyebrow" href="${docHref('docs/experiences/london-shortlist.md')}">Shortlist ↗</a></div>
      <div class="filters" style="margin-bottom:22px">${counts.map(([s, n]) => `<span class="pill ${tone[s]}">${n} ${esc(s)}</span>`).join('')}<span class="pill">Sunset ≈ 16:10 · shoot by 15:45</span></div>
      ${kinds.map(([k, label]) => {
        const rows = experiences.experiences.filter((x) => x.kind === k);
        if (!rows.length) return '';
        return `<div style="margin-bottom:28px">
          <div class="section-head"><h3>${label}</h3></div>
          <div class="panel panel-flush table-wrap"><table>
            <thead><tr><th>Experience</th><th>Status</th><th>Lead time</th><th class="r">Est. cost</th><th>Content</th><th>Partner</th></tr></thead>
            <tbody>${rows.map((x) => `<tr>
              <td><strong style="font-weight:600">${esc(x.title)}</strong>${x.notes ? `<div class="muted" style="font-size:13px">${esc(x.notes)}</div>` : ''}</td>
              <td><span class="pill ${tone[x.status]}">${esc(x.status)}</span></td>
              <td class="mono">${esc(x.leadTime)}</td>
              <td class="r mono">${x.estCostGbp ? gbp(x.estCostGbp) : 'Free'}</td>
              <td>${esc(x.content)}</td>
              <td>${x.partner ? esc(x.partner) : x.sponsorable ? '<span class="muted">Available</span>' : '<span class="muted">—</span>'}</td>
            </tr>`).join('')}</tbody>
          </table></div>
        </div>`;
      }).join('')}`;
  }

  function renderContent() {
    const fmtMetric = (m, v) => (v === null || v === undefined ? '—' : m.key === 'impressions' ? Number(v).toLocaleString('en-GB') : m.key === 'medianMinutes' ? `${v} min` : v);
    return `
      <div class="section-head"><h2 class="section-title">Content</h2><a class="eyebrow" href="${docHref('docs/content/strategy.md')}">Same-day strategy ↗</a></div>
      <div class="split">
        <div class="panel panel-flush table-wrap"><table>
          <thead><tr><th>Metric</th><th class="r">Target</th><th class="r">Actual</th><th class="bar-cell">Progress</th></tr></thead>
          <tbody>${content.metrics.map((m) => {
            const has = m.target && m.actual !== null && m.actual !== undefined;
            const good = has && (m.lowerIsBetter ? m.actual <= m.target : m.actual >= m.target);
            return `<tr>
              <td>${esc(m.label)}</td>
              <td class="r mono">${m.target ? fmtMetric(m, m.target) : '<span class="muted">set</span>'}</td>
              <td class="r mono">${fmtMetric(m, m.actual)}</td>
              <td class="bar-cell">${m.target && !m.lowerIsBetter ? meter(m.actual || 0, m.target, good ? 'good' : '') : m.lowerIsBetter && has ? `<span class="pill ${good ? 'good' : 'warn'}">${good ? 'on target' : 'too slow'}</span>` : ''}</td>
            </tr>`;
          }).join('')}</tbody>
        </table></div>
        <div class="panel">
          <div class="section-head"><h3>Service levels</h3></div>
          <ul class="deadlines">${content.slas.map((s) => `<li style="grid-template-columns:minmax(0,1fr) auto"><span>${esc(s.layer)}</span><span class="pill brass">${esc(s.target)}</span></li>`).join('')}</ul>
          <p class="muted" style="font-size:13px;margin-top:10px">${esc(content.baseline.note)}${content.baseline.followers ? ` · baseline ${Number(content.baseline.followers).toLocaleString('en-GB')}` : ''}</p>
        </div>
      </div>
      <div style="margin-top:32px">
        <div class="section-head"><h2 class="section-title">Notable posts</h2></div>
        ${content.log.length ? `<div class="panel panel-flush table-wrap"><table>
          <thead><tr><th>Date</th><th>Post</th><th>Partner</th><th class="r">Impressions</th><th class="r">Min to post</th></tr></thead>
          <tbody>${content.log.map((p) => `<tr><td class="mono">${esc(fmt(p.date))}</td><td>${p.url ? `<a href="${esc(p.url)}">${esc(p.title)}</a>` : esc(p.title)}</td><td>${esc(p.sponsor || '')}</td><td class="r mono">${p.impressions ? Number(p.impressions).toLocaleString('en-GB') : '—'}</td><td class="r mono">${p.minutesToPost ?? '—'}</td></tr>`).join('')}</tbody>
        </table></div>` : '<div class="empty">Posts will be logged here from arrival day. Every partner deliverable should end up with a link here, which makes the sponsor report easy to write.</div>'}
      </div>`;
  }

  function renderBudget() {
    const cats = [...new Set(budget.lines.map((l) => l.category))];
    const net = securedGbp - plannedGbp;
    return `
      <div class="section-head"><h2 class="section-title">Budget</h2><a class="eyebrow" href="${docHref('docs/planning/budget.md')}">Assumptions ↗</a></div>
      <div class="grid" style="margin-bottom:24px">
        <div class="panel stat"><span class="eyebrow">Planned</span><span class="stat-value num">${compact(plannedGbp, '£')}</span><span class="stat-note">${budget.lines.some((l) => l.estimate) ? 'Includes estimates' : 'All quoted'}</span></div>
        <div class="panel stat"><span class="eyebrow">Committed</span><span class="stat-value num">${compact(committedGbp, '£')}</span>${meter(committedGbp, plannedGbp)}</div>
        <div class="panel stat"><span class="eyebrow">Paid</span><span class="stat-value num">${compact(paidGbp, '£')}</span>${meter(paidGbp, plannedGbp)}</div>
        <div class="panel stat"><span class="eyebrow">Partner-funded</span><span class="stat-value num">${compact(securedGbp, '£')}</span><span class="stat-note" style="color:${net < 0 ? 'var(--bad)' : 'var(--good)'}">${net < 0 ? `${gbp(-net)} to find` : `${gbp(net)} surplus`}</span></div>
      </div>
      <div class="panel panel-flush table-wrap"><table>
        <thead><tr><th>Line</th><th class="r">Planned</th><th class="r">Committed</th><th class="r">Paid</th><th class="bar-cell">Committed</th></tr></thead>
        <tbody>
          ${cats.map((c) => `<tr class="group"><td colspan="5">${esc(c)}</td></tr>` + budget.lines.filter((l) => l.category === c).map((l) => `<tr>
            <td>${esc(l.item)} ${l.estimate ? '<span class="pill" style="margin-left:4px">est.</span>' : ''}</td>
            <td class="r mono">${gbp(l.plannedGbp)}</td>
            <td class="r mono">${l.committedGbp ? gbp(l.committedGbp) : '—'}</td>
            <td class="r mono">${l.paidGbp ? gbp(l.paidGbp) : '—'}</td>
            <td class="bar-cell">${meter(l.committedGbp, l.plannedGbp)}</td>
          </tr>`).join('')).join('')}
        </tbody>
        <tfoot><tr><td>Total</td><td class="r mono">${gbp(plannedGbp)}</td><td class="r mono">${gbp(committedGbp)}</td><td class="r mono">${gbp(paidGbp)}</td><td></td></tr></tfoot>
      </table></div>`;
  }

  // ─── Router ───────────────────────────────────────────────
  const tabs = document.getElementById('tabs');
  const store = {
    get() { try { return localStorage.getItem('house-tab'); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem('house-tab', v); } catch (e) { /* storage unavailable */ } },
  };
  const valid = (id) => VIEWS.some((v) => v.id === id);
  let current = valid(location.hash.slice(1)) ? location.hash.slice(1) : valid(store.get()) ? store.get() : 'overview';

  tabs.innerHTML = VIEWS.map((v) => `<a class="tab" href="#${v.id}" data-view="${v.id}">${v.label}</a>`).join('');

  function render() {
    const v = VIEWS.find((x) => x.id === current);
    view.innerHTML = `<div class="stack-lg">${v.render()}</div>`;
    tabs.querySelectorAll('.tab').forEach((t) => {
      if (t.dataset.view === current) t.setAttribute('aria-current', 'page');
      else t.removeAttribute('aria-current');
    });
    if (current === 'timeline') bindTimeline();
  }

  function go(id, focus) {
    if (!valid(id)) return;
    current = id;
    store.set(id);
    render();
    if (focus) { view.focus({ preventScroll: true }); window.scrollTo({ top: 0 }); }
  }

  window.addEventListener('hashchange', () => go(location.hash.slice(1), true));
  render();
})();
