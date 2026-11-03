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
    return li === 0 || state.unlockAll || levelDone(li - 1);
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
    ["lessonView", "sandboxView", "cheatView"].forEach((v) => ($(v).hidden = v !== name));
    window.scrollTo(0, 0);
  }

  function openLesson(lesson) {
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
    if (force || !current || current.id !== lesson.id || $("lessonView").hidden) openLesson(lesson);
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
