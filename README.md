# SQL Coach

A browser-only SQL practice app for product / program manager interviews.
SQLite runs in the page via [sql.js](https://github.com/sql-js/sql.js), so there's no backend and nothing to install.

- Starts with **Database basics**: a visual, Duolingo-style warm-up (tap the row / column / cell / table / keyword) that teaches tables, rows, columns, NULL, keys and schemas before any typing
- Then 7 SQL levels, 36 lessons: SELECT & WHERE → sorting → aggregates & GROUP BY → JOINs → subqueries, CASE & dates → interview patterns (conversion, ranking, top-N per group, running totals) → mock interview
- PM-flavoured data: `users`, `orders`, `feature_usage`, `employees`
- Every answer is auto-checked against the expected result (column names don't matter, values do)
- Hints, "expected output", a free-form sandbox, and a cheat sheet
- Progress is saved in the browser (localStorage). Levels unlock as you finish the previous one

## Run locally

Any static file server works (opening index.html directly won't, because the text files are loaded with fetch):

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

Pushing to `main` deploys to GitHub Pages via `.github/workflows/pages.yml`.

## Text and languages

All wording (lesson explanations, tasks, hints, quiz questions, buttons, messages, the cheat sheet) lives in `locales/<lang>.json`. The code files only hold structure: lesson ids, answer SQL, starter code, which tables to show, and which quiz answer is correct. SQL keywords, table names and column names stay in English in every language, because that's what you type in an interview.

To add a language (Hindi as the example):

1. Copy `locales/en.json` to `locales/hi.json`.
2. Set `"meta": { "name": "हिन्दी", "dir": "ltr" }` (use `"rtl"` for right-to-left languages like Arabic).
3. Translate the values, not the keys. Keep `{placeholders}`, HTML tags like `<b>` and `<code>`, and anything that is SQL exactly as it is. Anything you leave out falls back to English, so you can translate a bit at a time.
4. Add it to `locales/languages.json`: `{ "code": "hi", "name": "हिन्दी" }`.
5. Run `node scripts/check-locales.js hi` to see what's missing and catch broken placeholders or wrong list lengths.

A language picker appears in the top bar as soon as there are two or more languages. `?lang=hi` in the URL also selects it. The choice is remembered in the browser.

Keys that end in `_one` / `_other` are plural forms. Languages with more forms (e.g. `_few`, `_many`) can add them; the app uses the browser's plural rules.

## Editing lessons

SQL lessons are in `lessons.js` (structure) plus `locales/en.json` → `lessons.<id>` (title, explain, task, hints). Each has a starter query and a reference `solution` used to compute the expected result. Set `ordered: true` when the task asks for a specific sort order.

The visual intro quizzes are in `concepts.js` (step kinds, tap targets, correct answers) plus `locales/en.json` → `lessons.<id>.steps`, matched by position. If you add or remove a step, do it in both places.

The data in `data.js` was generated once with a fixed seed; changing it changes the expected answers.
