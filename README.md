# SQL Coach

A browser-only SQL practice app for product / program manager interviews.
SQLite runs in the page via [sql.js](https://github.com/sql-js/sql.js), so there's no backend and nothing to install.

- 7 levels, 36 lessons: SELECT & WHERE → sorting → aggregates & GROUP BY → JOINs → subqueries, CASE & dates → interview patterns (conversion, ranking, top-N per group, running totals) → mock interview
- PM-flavoured data: `users`, `orders`, `feature_usage`, `employees`
- Every answer is auto-checked against the expected result (column names don't matter, values do)
- Hints, "expected output", a free-form sandbox, and a cheat sheet
- Progress is saved in the browser (localStorage). Levels unlock as you finish the previous one

## Run locally

Any static file server works:

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

Pushing to `main` deploys to GitHub Pages via `.github/workflows/pages.yml`.

## Editing lessons

Lessons live in `lessons.js`. Each has an explanation, a task, a starter query, a reference `solution` (used to compute the expected result) and hints. Set `ordered: true` when the task asks for a specific sort order.

The data in `data.js` was generated once with a fixed seed; changing it changes the expected answers.
