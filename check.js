// Result comparison, shared by the app and the test script.
// Column names are ignored; values must match. Numbers match within 0.01
// so ROUND(x, 2) and unrounded answers are both accepted.
// Returns { ok } or { ok: false, code, params }; the app turns code into a
// message with the "check.<code>" text in the language file.
(function (root) {
  function norm(v) {
    if (v === null || v === undefined) return "\u0000NULL";
    if (typeof v === "number") return "n:" + (Math.round(v * 100) / 100).toFixed(2);
    if (typeof v === "string" && /^-?\d+(\.\d+)?$/.test(v)) return "n:" + (Math.round(Number(v) * 100) / 100).toFixed(2);
    return "s:" + String(v);
  }

  function compareResults(expected, actual, ordered) {
    if (!actual) return { ok: false, code: "noTable" };
    const ec = expected.columns.length, ac = actual.columns.length;
    if (ec !== ac) return { ok: false, code: "columns", count: ec, params: { expected: ec, actual: ac } };
    const er = expected.values.length, ar = actual.values.length;
    if (er !== ar) return { ok: false, code: "rows", count: er, params: { expected: er, actual: ar } };
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
          if (se === sa) return { ok: false, code: "order" };
        }
        const perm = (rows) => rows.map((r) => r.map(norm).sort().join("\u0001")).sort().join("|");
        if (perm(expected.values) === perm(actual.values)) return { ok: false, code: "columnOrder" };
        return { ok: false, code: "values" };
      }
    }
    return { ok: true };
  }

  root.compareResults = compareResults;
  if (typeof module !== "undefined") module.exports = { compareResults };
})(typeof window !== "undefined" ? window : globalThis);
