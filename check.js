// Result comparison, shared by the app and the test script.
// Column names are ignored; values must match. Numbers match within 0.01
// so ROUND(x, 2) and unrounded answers are both accepted.
(function (root) {
  function norm(v) {
    if (v === null || v === undefined) return "\u0000NULL";
    if (typeof v === "number") return "n:" + (Math.round(v * 100) / 100).toFixed(2);
    if (typeof v === "string" && /^-?\d+(\.\d+)?$/.test(v)) return "n:" + (Math.round(Number(v) * 100) / 100).toFixed(2);
    return "s:" + String(v);
  }

  // Returns { ok, reason }.
  function compareResults(expected, actual, ordered) {
    if (!actual) return { ok: false, reason: "Your query didn't return any table. Make sure it's a SELECT." };
    const ec = expected.columns.length, ac = actual.columns.length;
    if (ec !== ac) {
      return { ok: false, reason: `Expected ${ec} column${ec === 1 ? "" : "s"}, but your result has ${ac}.` };
    }
    const er = expected.values.length, ar = actual.values.length;
    if (er !== ar) {
      return { ok: false, reason: `Expected ${er} row${er === 1 ? "" : "s"}, but your result has ${ar}.` };
    }
    const toKeys = (rows) => rows.map((r) => r.map(norm).join("\u0001"));
    let e = toKeys(expected.values), a = toKeys(actual.values);
    if (!ordered) {
      e = e.slice().sort();
      a = a.slice().sort();
    }
    for (let i = 0; i < e.length; i++) {
      if (e[i] !== a[i]) {
        if (ordered) {
          const se = e.slice().sort().join("|"), sa = a.slice().sort().join("|");
          if (se === sa) return { ok: false, reason: "Right rows, but in the wrong order. Check your ORDER BY." };
        }
        // Columns in a different order?
        const perm = (rows) => rows.map((r) => r.map(norm).sort().join("\u0001")).sort().join("|");
        if (perm(expected.values) === perm(actual.values)) {
          return { ok: false, reason: "Right values, but the columns are in a different order than the task asks." };
        }
        return { ok: false, reason: "Same number of rows and columns, but some values are different." };
      }
    }
    return { ok: true };
  }

  root.compareResults = compareResults;
  if (typeof module !== "undefined") module.exports = { compareResults };
})(typeof window !== "undefined" ? window : globalThis);
