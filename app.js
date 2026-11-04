(function () {
  "use strict";

  const STORE_KEY = "sqlcoach.v1";
  const MAX_ROWS_SHOWN = 200;
  const $ = (id) => document.getElementById(id);

  // ---------- Flatten curriculum ----------
  const lessons = [];
  LEVELS.forEach((level, li) => {
    level.lessons.forEach((lesson, i) => {
      lessons.push(Object.assign({}, lesson, { level, levelIndex: li, indexInLevel: i }));
    });
  });
  const byId = Object.fromEntries(lessons.map((l) => [l.id, l]));

  // ---------- Progress (localStorage, best effort) ----------
  function loadState() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE_KEY));
      if (s && typeof s === "object") return Object.assign({ done: {}, drafts: {}, unlockAll: false }, s);
    } catch (e) {}
    return { done: {}, drafts: {}, unlockAll: false };
  }
  const state = loadState();
  function saveState() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function levelDone(li) {
    return LEVELS[li].lessons.every((l) => state.done[l.id]);
  }
  function levelUnlocked(li) {
    if (li === 0 || state.unlockAll || levelDone(li - 1)) return true;
    // Keep access to anything already started (e.g. progress from before a level was added).
    return LEVELS.slice(li).some((lv) => lv.lessons.some((l) => state.done[l.id]));
  }

  // ---------- Database ----------
  let SQL = null;
  let seedBytes = null;

  function freshDb() {
    return new SQL.Database(seedBytes);
  }

  // Runs sql on a fresh copy of the data. Returns { result, error }.
  // result is the last statement's table ({columns, values}) or null.
  function runQuery(sql) {
    const db = freshDb();
    try {
      // iterateStatements keeps column names even when a SELECT returns 0 rows
      // (db.exec drops empty results entirely).
      let last = null;
      for (const stmt of db.iterateStatements(sql)) {
        const columns = stmt.getColumnNames();
        const values = [];
        while (stmt.step()) values.push(stmt.get());
        if (columns.length) last = { columns, values };
      }
      return { result: last };
    } catch (e) {
      return { error: e.message || String(e) };
    } finally {
      db.close();
    }
  }

  function tableColumns(table) {
    const db = freshDb();
    try {
      const r = db.exec(`PRAGMA table_info(${table})`)[0];
      const count = db.exec(`SELECT COUNT(*) FROM ${table}`)[0].values[0][0];
      return { cols: r.values.map((v) => ({ name: v[1], type: v[2] || "" })), count };
    } finally {
      db.close();
    }
  }

  // ---------- Rendering helpers ----------
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function renderTable(result) {
    if (!result) return `<div class="result-meta">Query ran. No rows to show.</div>`;
    const rows = result.values;
    const shown = rows.slice(0, MAX_ROWS_SHOWN);
    const head = result.columns.map((c) => `<th>${esc(c)}</th>`).join("");
    const body = shown.map((r) =>
      "<tr>" + r.map((v) => v === null ? `<td class="null">NULL</td>` : `<td>${esc(typeof v === "number" && !Number.isInteger(v) ? +v.toFixed(4) : v)}</td>`).join("") + "</tr>"
    ).join("");
    const meta = `${rows.length} row${rows.length === 1 ? "" : "s"}` + (rows.length > MAX_ROWS_SHOWN ? ` (showing first ${MAX_ROWS_SHOWN})` : "");
    return `<div class="result-meta">${meta}</div><div class="table-scroll"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
  }

  function renderSchema(tables, container, resultsEl) {
    container.innerHTML = tables.map((t) => {
      const info = tableColumns(t);
      return `<div class="schema-table"><b>${t}</b> <span class="muted">(${info.count} rows)</span>
        <button class="peek" data-table="${t}">preview</button>
        <div class="schema-cols">${info.cols.map((c) => `<span>${c.name} <i>${c.type.toLowerCase()}</i></span>`).join("")}</div></div>`;
    }).join("");
    container.querySelectorAll(".peek").forEach((b) => {
      b.addEventListener("click", () => {
        const { result } = runQuery(`SELECT * FROM ${b.dataset.table} LIMIT 10`);
        resultsEl.innerHTML = `<div class="result-meta">Preview of <b>${b.dataset.table}</b> (first 10 rows)</div>` + renderTable(result);
      });
    });
  }

  // ---------- Sidebar ----------
  function renderSidebar() {
    const nav = $("sidebar");
    nav.innerHTML = LEVELS.map((level, li) => {
      const unlocked = levelUnlocked(li);
      const doneCount = level.lessons.filter((l) => state.done[l.id]).length;
      const items = level.lessons.map((l, i) => {
        const done = state.done[l.id];
        const active = current && current.id === l.id ? " active" : "";
        return `<button class="lesson-link${done ? " done" : ""}${active}" data-id="${l.id}" ${unlocked ? "" : "disabled"}>
          <span class="dot">${done ? "✓" : ""}</span><span>${esc(l.title)}</span></button>`;
      }).join("");
      return `<div class="level${unlocked ? "" : " locked"}">
        <div class="level-head">
          <div class="level-title"><span>${unlocked ? "" : "🔒 "}${li + 1}. ${esc(level.title)}</span><span class="level-count">${doneCount}/${level.lessons.length}</span></div>
          <div class="level-blurb">${esc(level.blurb)}</div>
        </div>${items}</div>`;
    }).join("") + `<div class="sidebar-foot">
        Levels unlock when you finish the one before.
        <br><button id="unlockAll">${state.unlockAll ? "Re-lock levels" : "Unlock everything"}</button>
        · <button id="resetProgress">Reset progress</button></div>`;

    nav.querySelectorAll(".lesson-link").forEach((b) => b.addEventListener("click", () => {
      location.hash = "lesson/" + b.dataset.id;
      nav.classList.remove("open");
    }));
    $("unlockAll").addEventListener("click", () => { state.unlockAll = !state.unlockAll; saveState(); renderSidebar(); updateNav(); });
    $("resetProgress").addEventListener("click", () => {
      if (!confirm("Clear all progress and saved answers?")) return;
      state.done = {}; state.drafts = {}; state.unlockAll = false; saveState();
      location.hash = "lesson/" + lessons[0].id;
      route(true);
    });

    const pct = Math.round((100 * Object.keys(state.done).filter((k) => byId[k]).length) / lessons.length);
    $("progressFill").style.width = pct + "%";
    $("progressText").textContent = pct + "%";
  }

  // ---------- Lesson view ----------
  let current = null;
  let hintsShown = 0;
  let failedChecks = 0;
  let expectedCache = null;

  function showView(name) {
    ["lessonView", "conceptView", "sandboxView", "cheatView"].forEach((v) => ($(v).hidden = v !== name));
    window.scrollTo(0, 0);
  }

  function openLesson(lesson) {
    if (lesson.type === "concept") return openConcept(lesson);
    current = lesson;
    hintsShown = 0;
    failedChecks = 0;
    expectedCache = null;
    const level = lesson.level;

    $("crumb").textContent = `Level ${lesson.levelIndex + 1} · ${level.title} · ${lesson.indexInLevel + 1} of ${level.lessons.length}`;
    $("lessonTitle").textContent = lesson.title;
    $("explain").innerHTML = lesson.explain || (level.mock ? `<p class="muted">${esc(level.blurb)}</p>` : "");
    $("taskText").innerHTML = lesson.task;
    $("editor").value = state.drafts[lesson.id] != null ? state.drafts[lesson.id] : lesson.starter;
    $("feedback").hidden = true;
    $("hints").innerHTML = "";
    $("expected").hidden = true;
    $("expected").innerHTML = "";
    $("results").innerHTML = "";
    $("schemaBox").open = !!level.mock || lesson.indexInLevel === 0;
    renderSchema(lesson.tables, $("schema"), $("results"));
    updateHintButton();
    showView("lessonView");
    renderSidebar();
    updateNav();
    if (state.done[lesson.id]) setFeedback("ok", "✓ You've already solved this one. Feel free to try it again.");
  }

  function updateHintButton() {
    const b = $("hintBtn");
    const total = current.hints.length;
    const lockedForMock = current.level.mock && failedChecks === 0;
    b.disabled = hintsShown >= total || lockedForMock;
    b.title = lockedForMock ? "In the mock interview, hints unlock after one attempt" : "";
    b.textContent = hintsShown >= total ? "No more hints" : `Hint (${hintsShown}/${total})`;
  }

  function idx(lesson) { return lessons.indexOf(lesson); }

  function updateNav() {
    if (!current) return;
    const i = idx(current);
    const prev = lessons[i - 1], next = lessons[i + 1];
    $("prevBtn").disabled = !prev;
    $("nextBtn").hidden = !next;
    $("nextBtn").disabled = !next || !levelUnlocked(next.levelIndex);
    $("nextBtn").title = next && !levelUnlocked(next.levelIndex) ? "Finish this level to unlock the next one" : "";
    $("expectedBtn").hidden = !!current.level.mock && !state.done[current.id] && failedChecks < 2;
  }

  function setFeedback(kind, html) {
    const f = $("feedback");
    f.className = "feedback " + kind;
    f.innerHTML = html;
    f.hidden = false;
  }

  function getExpected() {
    if (!expectedCache) {
      const r = runQuery(current.solution);
      if (r.error) throw new Error("Lesson solution failed: " + r.error);
      expectedCache = r.result;
    }
    return expectedCache;
  }

  function onRun() {
    const sql = $("editor").value;
    if (!sql.trim()) return;
    const { result, error } = runQuery(sql);
    $("results").innerHTML = error ? `<div class="error">⚠ ${esc(error)}</div>` : renderTable(result);
  }

  function onCheck() {
    const sql = $("editor").value;
    if (!sql.trim()) return setFeedback("info", "Write a query first.");
    const { result, error } = runQuery(sql);
    if (error) {
      $("results").innerHTML = `<div class="error">⚠ ${esc(error)}</div>`;
      failedChecks++;
      updateHintButton(); updateNav();
      return setFeedback("bad", "Your query has an error. Read the message below. Typos and missing commas are the usual suspects.");
    }
    $("results").innerHTML = renderTable(result);
    const verdict = compareResults(getExpected(), result, !!current.ordered);
    if (verdict.ok) {
      const firstTime = !state.done[current.id];
      state.done[current.id] = true;
      saveState();
      const li = current.levelIndex;
      let msg = "✓ Correct! Nice work.";
      if (firstTime && levelDone(li)) {
        msg = li + 1 < LEVELS.length
          ? `🎉 Correct, and that finishes <b>${esc(current.level.title)}</b>! Level ${li + 2} is unlocked.`
          : "🏆 Correct! You've finished the mock interview. You're ready. Good luck!";
      }
      setFeedback("ok", msg);
      renderSidebar();
      updateNav();
    } else {
      failedChecks++;
      updateHintButton();
      updateNav();
      setFeedback("bad", "Not quite. " + esc(verdict.reason) + (hintsShown < current.hints.length && !$("hintBtn").disabled ? " Try a hint if you're stuck." : ""));
    }
  }

  function onHint() {
    if (hintsShown >= current.hints.length) return;
    hintsShown++;
    const isLast = hintsShown === current.hints.length;
    const el = document.createElement("div");
    el.className = "hint";
    el.innerHTML = `<b>${isLast ? "Solution" : "Hint " + hintsShown}:</b> ${current.hints[hintsShown - 1]}`;
    $("hints").appendChild(el);
    updateHintButton();
  }

  function onExpected() {
    const box = $("expected");
    if (!box.hidden) { box.hidden = true; return; }
    box.innerHTML = `<div class="label">Expected output${current.ordered ? " (order matters)" : " (any row order is fine)"}</div>` + renderTable(getExpected());
    box.hidden = false;
  }

  // ---------- Concept (quiz) lessons ----------
  let cQueue = [], cDoneCount = 0, cState = null, cMistakes = 0;

  function openConcept(lesson) {
    current = lesson;
    cQueue = lesson.steps.map((_, i) => i);
    cDoneCount = 0;
    cMistakes = 0;
    $("cCrumb").textContent = `Level ${lesson.levelIndex + 1} · ${lesson.level.title} · ${lesson.indexInLevel + 1} of ${lesson.level.lessons.length}`;
    $("cTitle").textContent = lesson.title;
    showView("conceptView");
    renderSidebar();
    renderConceptStep();
  }

  function miniTableHtml(name, v, hitMode) {
    const t = MINI_TABLES[name];
    const hl = v.highlight || {};
    const keyIcon = (col) => !v.keys ? "" : col === t.columns[0] ? " 🔑" : (col === "user_id" && name !== "users" ? " 🔗" : "");
    const head = t.columns.map((c, ci) => {
      const cls = hl.col === c ? "hl" : "";
      return `<th class="${cls}" data-table="${name}" data-col="${c}"${hitMode ? " data-hit" : ""}>${c}${keyIcon(c)}${v.showTypes ? `<small>${t.types[ci]}</small>` : ""}</th>`;
    }).join("");
    const body = t.rows.map((r, ri) => {
      const rowCls = hl.row === ri ? "hl" : "";
      return `<tr class="${rowCls}">` + r.map((val, ci) => {
        const c = t.columns[ci];
        const isHl = hl.col === c || (hl.cell && hl.cell[0] === ri && hl.cell[1] === c);
        const isNull = val === null;
        return `<td class="${isHl ? "hl" : ""}${isNull ? " null" : ""}" data-table="${name}" data-row="${ri}" data-col="${c}"${hitMode ? " data-hit" : ""}>${isNull ? "NULL" : esc(val)}</td>`;
      }).join("") + "</tr>";
    }).join("");
    return `<div class="mini"><div class="mini-name">${t.emoji} ${name}</div>
      <div class="mini-scroll"><table class="mini-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>
      ${v.label ? `<div class="mini-label">${v.label}</div>` : ""}</div>`;
  }

  function visualHtml(step) {
    const v = step.visual;
    const tapping = step.kind === "tap" && !step.tokens;
    if (step.tokens) {
      return `<div class="tokens">${step.tokens.map((t, i) => `<button class="token" data-hit data-token="${i}">${esc(t)}</button>`).join("")}</div>`;
    }
    if (!v) return "";
    if (v.mode === "cards") {
      return `<div class="cards">${v.tables.map((n) => {
        const t = MINI_TABLES[n];
        return `<button class="tcard" data-table="${n}" ${tapping ? "data-hit" : "disabled"}>
          <span class="tcard-emoji">${t.emoji}</span><b>${n}</b><span class="muted">${t.blurb}</span>
          <span class="tcard-grid" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span></button>`;
      }).join("")}</div>`;
    }
    if (v.schema) {
      return `<div class="schema-map">${v.schema.map((n) => {
        const t = MINI_TABLES[n];
        return `<div class="sbox"><div class="sbox-head">${t.emoji} ${n}</div>${t.columns.map((c, ci) => {
          const icon = ci === 0 ? "🔑" : c === "user_id" ? "🔗" : "";
          return `<div class="scol" data-table="${n}" data-col="${c}"${tapping ? " data-hit" : ""}><span>${icon} ${c}</span><small>${t.types[ci]}</small></div>`;
        }).join("")}</div>`;
      }).join("")}</div><div class="muted small">🔑 primary key · 🔗 foreign key (points to users.user_id)</div>`;
    }
    return `<div class="minis">${v.tables.map((n) => miniTableHtml(n, v, tapping)).join("")}</div>` +
      (v.keys ? `<div class="muted small">🔑 primary key · 🔗 foreign key (points to users.user_id)</div>` : "");
  }

  function renderConceptStep() {
    const steps = current.steps;
    $("cProgressFill").style.width = Math.round((100 * cDoneCount) / steps.length) + "%";
    if (!cQueue.length) return renderConceptDone();
    const step = steps[cQueue[0]];
    cState = { step, answered: false };
    const card = $("cCard");
    let html = "";
    if (step.kind === "learn") {
      html = `<div class="c-tag">Learn</div><div class="explain">${step.html}</div>${visualHtml(step)}`;
    } else if (step.kind === "tap") {
      html = `<div class="c-tag quiz">Quick quiz · tap it</div><div class="c-prompt">${step.prompt}</div>${visualHtml(step)}`;
    } else {
      html = `<div class="c-tag quiz">Quick quiz</div><div class="c-prompt">${step.prompt}</div>${visualHtml(step)}
        <div class="options">${step.options.map((o, i) => `<button class="option${step.mono ? " mono" : ""}" data-hit data-option="${i}">${esc(o)}</button>`).join("")}</div>`;
    }
    card.innerHTML = html;
    card.classList.remove("pop");
    void card.offsetWidth;
    card.classList.add("pop");
    const bar = $("cBar");
    bar.className = "c-bar";
    $("cMsg").innerHTML = step.kind === "learn" ? "" : `<span class="muted">${step.kind === "tap" ? "Tap your answer above" : "Pick one answer"}</span>`;
    $("cContinue").hidden = step.kind !== "learn";
    $("cContinue").textContent = "Continue";
    card.querySelectorAll("[data-hit]").forEach((el) => el.addEventListener("click", () => onConceptHit(el)));
  }

  function isHitCorrect(step, el) {
    const t = step.target;
    if (step.kind === "choice") return Number(el.dataset.option) === step.answer;
    switch (t.type) {
      case "table": return el.dataset.table === t.name;
      case "token": return Number(el.dataset.token) === t.index;
      case "row": return el.dataset.table === t.table && Number(el.dataset.row) === t.row;
      case "col": return el.dataset.table === t.table && el.dataset.col === t.col;
      case "cell": return el.dataset.table === t.table && Number(el.dataset.row) === t.row && el.dataset.col === t.col;
    }
    return false;
  }

  function markEl(el, cls) {
    // Light up the whole row / column the learner was asked about, not just one cell.
    const t = cState.step.target;
    const card = $("cCard");
    let els = [el];
    if (t && t.type === "row" && el.closest("tr")) els = [el.closest("tr")];
    if (t && t.type === "col" && el.dataset.col && cls === "right") {
      els = [...card.querySelectorAll(`[data-table="${el.dataset.table}"][data-col="${el.dataset.col}"]`)];
    }
    els.forEach((e) => { e.classList.remove("right", "wrong"); void e.offsetWidth; e.classList.add(cls); });
  }

  function onConceptHit(el) {
    if (!cState || cState.answered) return;
    const step = cState.step;
    const ok = isHitCorrect(step, el);
    cState.answered = true;
    cState.correct = ok;
    markEl(el, ok ? "right" : "wrong");
    if (!ok && step.kind === "choice") {
      const good = $("cCard").querySelector(`[data-option="${step.answer}"]`);
      good && good.classList.add("right");
    }
    if (!ok) cMistakes++;
    const bar = $("cBar");
    bar.className = "c-bar " + (ok ? "ok" : "bad");
    $("cMsg").innerHTML = ok
      ? `<b>✓</b> ${step.right || "Correct!"}`
      : `<b>Not quite.</b> ${step.wrong || step.right || ""}${step.kind === "choice" ? "" : " We'll come back to this one."}`;
    $("cContinue").hidden = false;
    $("cContinue").textContent = ok ? "Continue" : "Got it";
    $("cContinue").focus({ preventScroll: true });
  }

  function onConceptContinue() {
    if (!cQueue.length) {
      const n = lessons[idx(current) + 1];
      if (n) location.hash = "lesson/" + n.id;
      return;
    }
    const step = cState.step;
    if (step.kind !== "learn" && !cState.answered) return;
    const i = cQueue.shift();
    if (step.kind === "learn" || cState.correct) cDoneCount++;
    else cQueue.push(i); // Duolingo-style: missed questions come back at the end
    renderConceptStep();
  }

  function renderConceptDone() {
    const first = !state.done[current.id];
    state.done[current.id] = true;
    saveState();
    renderSidebar();
    const next = lessons[idx(current) + 1];
    const levelFinished = first && levelDone(current.levelIndex);
    $("cCard").innerHTML = `<div class="c-done">
      <div class="c-done-emoji">${levelFinished ? "🏆" : "🎉"}</div>
      <h2>${levelFinished ? "Basics complete!" : "Lesson complete!"}</h2>
      <p>${cMistakes === 0 ? "Perfect, no mistakes!" : `You fixed ${cMistakes} mistake${cMistakes === 1 ? "" : "s"} along the way. That's how learning works.`}</p>
      ${levelFinished ? "<p>You know the vocabulary now. Next you'll write your first real SQL query.</p>" : ""}
    </div>`;
    $("cBar").className = "c-bar ok";
    $("cMsg").innerHTML = "";
    $("cContinue").hidden = !next;
    $("cContinue").textContent = next ? (next.type === "concept" ? "Next lesson" : "Start writing SQL →") : "";
  }

  // ---------- Editor niceties ----------
  function wireEditor(textarea, onEnter, onChange) {
    textarea.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        onEnter();
      } else if (e.key === "Tab" && !e.shiftKey) {
        e.preventDefault();
        const s = textarea.selectionStart, en = textarea.selectionEnd;
        textarea.setRangeText("  ", s, en, "end");
        onChange && onChange();
      }
    });
    if (onChange) textarea.addEventListener("input", onChange);
  }

  // ---------- Routing ----------
  function firstOpenLesson() {
    return lessons.find((l) => !state.done[l.id] && levelUnlocked(l.levelIndex)) || lessons[lessons.length - 1];
  }

  function route(force) {
    const h = location.hash.replace(/^#/, "");
    if (h === "sandbox") {
      current = null; renderSidebar();
      showView("sandboxView");
      return;
    }
    if (h === "cheat") {
      current = null; renderSidebar();
      showView("cheatView");
      return;
    }
    let lesson = h.startsWith("lesson/") ? byId[h.slice(7)] : null;
    if (!lesson || !levelUnlocked(lesson.levelIndex)) {
      lesson = firstOpenLesson();
      history.replaceState(null, "", "#lesson/" + lesson.id);
    }
    if (force || !current || current.id !== lesson.id || ($("lessonView").hidden && $("conceptView").hidden)) openLesson(lesson);
  }

  // ---------- Boot ----------
  async function boot() {
    try {
      SQL = await initSqlJs({ locateFile: (f) => "vendor/" + f });
      const db = new SQL.Database();
      db.exec(SEED_SQL);
      seedBytes = db.export();
      db.close();
    } catch (e) {
      $("loading").innerHTML = `<span class="error">Couldn't start the in-browser database: ${esc(e.message || e)}</span>`;
      return;
    }
    $("loading").hidden = true;

    wireEditor($("editor"), onRun, () => {
      if (current) { state.drafts[current.id] = $("editor").value; saveState(); }
    });
    wireEditor($("sandboxEditor"), () => $("sandboxRun").click());

    $("runBtn").addEventListener("click", onRun);
    $("checkBtn").addEventListener("click", onCheck);
    $("hintBtn").addEventListener("click", onHint);
    $("expectedBtn").addEventListener("click", onExpected);
    $("resetBtn").addEventListener("click", () => {
      $("editor").value = current.starter;
      delete state.drafts[current.id];
      saveState();
      $("results").innerHTML = "";
      $("feedback").hidden = true;
    });
    $("cContinue").addEventListener("click", onConceptContinue);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !$("conceptView").hidden && !$("cContinue").hidden && document.activeElement !== $("cContinue")) {
        e.preventDefault();
        onConceptContinue();
      }
    });
    $("prevBtn").addEventListener("click", () => { const p = lessons[idx(current) - 1]; if (p) location.hash = "lesson/" + p.id; });
    $("nextBtn").addEventListener("click", () => { const n = lessons[idx(current) + 1]; if (n) location.hash = "lesson/" + n.id; });

    $("sandboxBtn").addEventListener("click", () => (location.hash = "sandbox"));
    $("cheatBtn").addEventListener("click", () => (location.hash = "cheat"));
    $("menuBtn").addEventListener("click", () => $("sidebar").classList.toggle("open"));
    $("sandboxRun").addEventListener("click", () => {
      const { result, error } = runQuery($("sandboxEditor").value);
      $("sandboxResults").innerHTML = error ? `<div class="error">⚠ ${esc(error)}</div>` : renderTable(result);
    });
    renderSchema(["users", "orders", "feature_usage", "employees"], $("sandboxSchema"), $("sandboxResults"));

    window.addEventListener("hashchange", () => route(false));
    route(true);
  }

  boot();
})();
