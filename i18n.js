// Translations. All wording lives in locales/<lang>.json; English (en.json) is the
// fallback for anything a translation hasn't covered yet.
//
//   t("lesson.check")                      -> "Check answer"
//   t("lesson.hint", {shown: 1, total: 2}) -> "Hint (1/2)"
//   tn("results.rows", 3)                  -> uses results.rows_one / results.rows_other
(function () {
  const LANG_KEY = "sqlcoach.lang";
  let base = {}, loc = {};

  function lookup(obj, path) {
    return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
  }
  function fill(str, params) {
    return params ? str.replace(/\{(\w+)\}/g, (m, k) => (params[k] !== undefined ? params[k] : m)) : str;
  }
  function t(key, params) {
    const v = (loc.ui || {})[key] ?? (base.ui || {})[key];
    return v === undefined ? key : fill(v, params);
  }
  function tn(key, n, params) {
    let form = "other";
    try { form = new Intl.PluralRules(I18N.lang).select(n); } catch (e) {}
    const p = Object.assign({ n }, params);
    const k = t(`${key}_${form}`) !== `${key}_${form}` ? `${key}_${form}` : `${key}_other`;
    return t(k, p);
  }

  async function getJson(url) {
    const r = await fetch(url, { cache: "no-cache" });
    if (!r.ok) throw new Error(`${url}: ${r.status}`);
    return r.json();
  }

  function pickLang(available) {
    const codes = available.map((l) => l.code);
    const fromUrl = new URLSearchParams(location.search).get("lang");
    if (fromUrl && codes.includes(fromUrl)) {
      try { localStorage.setItem(LANG_KEY, fromUrl); } catch (e) {} // a shared ?lang= link sticks
    }
    let saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) {}
    const browser = (navigator.languages || [navigator.language || "en"]).map((l) => l.toLowerCase());
    for (const c of [fromUrl, saved, ...browser, ...browser.map((b) => b.split("-")[0])]) {
      if (c && codes.includes(c)) return c;
    }
    return "en";
  }

  // Copy lesson text from the language file onto the lesson structure.
  function applyContent(levels, tables) {
    const pick = (path) => lookup(loc, path) ?? lookup(base, path);
    levels.forEach((lv) => {
      lv.title = pick(`levels.${lv.id}.title`) || lv.id;
      lv.blurb = pick(`levels.${lv.id}.blurb`) || "";
      lv.lessons.forEach((l) => {
        const p = `lessons.${l.id}`;
        l.title = pick(`${p}.title`) || l.id;
        l.explain = pick(`${p}.explain`) || "";
        l.task = pick(`${p}.task`) || "";
        l.hints = pick(`${p}.hints`) || [];
        (l.steps || []).forEach((s, i) => {
          const sp = `${p}.steps.${i}`;
          ["html", "prompt", "options", "right", "wrong", "label"].forEach((k) => {
            const v = pick(`${sp}.${k}`);
            if (v !== undefined) s[k] = v;
          });
        });
      });
    });
    Object.entries(tables || {}).forEach(([name, tbl]) => { tbl.blurb = pick(`tables.${name}`) || ""; });
  }

  // Fill static page text: data-i18n (text), data-i18n-html, data-i18n-title, data-i18n-aria, data-i18n-placeholder.
  function applyDom(root) {
    (root || document).querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    (root || document).querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    (root || document).querySelectorAll("[data-i18n-title]").forEach((el) => { el.title = t(el.dataset.i18nTitle); });
    (root || document).querySelectorAll("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
    document.title = t("app.title");
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = t("app.description");
    document.documentElement.lang = I18N.lang;
    document.documentElement.dir = (loc.meta && loc.meta.dir) || "ltr";
  }

  function setLang(code) {
    try { localStorage.setItem(LANG_KEY, code); } catch (e) {}
    // Reload so every string is rebuilt in the new language.
    const url = new URL(location.href);
    if (url.searchParams.has("lang")) {
      url.searchParams.delete("lang");
      location.replace(url.toString());
    } else {
      location.reload();
    }
  }

  async function init() {
    let languages = [{ code: "en", name: "English" }];
    try { languages = await getJson("locales/languages.json"); } catch (e) {}
    I18N.languages = languages;
    I18N.lang = pickLang(languages);
    base = await getJson("locales/en.json");
    loc = base;
    if (I18N.lang !== "en") {
      try { loc = await getJson(`locales/${I18N.lang}.json`); }
      catch (e) { console.warn("Missing translation file, using English", e); I18N.lang = "en"; }
    }
    I18N.cheat = loc.cheat || base.cheat || [];
  }

  const I18N = { lang: "en", languages: [], t, tn, applyContent, applyDom, setLang, init };
  window.I18N = I18N;
  window.t = t;
  window.tn = tn;
})();
