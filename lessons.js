// Curriculum. Each lesson is checked by running `solution` and comparing
// its result with the learner's result (column names don't matter, values do).
// ordered: true means row order matters (the task asks for a specific sort).
window.LEVELS = [
  {
    id: "basics",
    title: "SELECT & WHERE",
    blurb: "Read data out of a table and filter it.",
    lessons: [
      {
        id: "select-all",
        title: "Your first query",
        tables: ["users"],
        explain: `
<p>A database is a set of <b>tables</b>. Each table has <b>columns</b> (fields) and <b>rows</b> (records). The <code>users</code> table has one row per person who signed up for our product.</p>
<p>To read data you write a <code>SELECT</code> statement. <code>*</code> means "every column".</p>
<pre>SELECT * FROM users;</pre>
<p>SQL keywords aren't case sensitive, but writing them in CAPITALS makes queries easier to read. The semicolon at the end is optional here.</p>`,
        task: "Show every column and every row of the <code>users</code> table.",
        starter: "SELECT ",
        solution: "SELECT * FROM users;",
        hints: ["Use <code>*</code> to mean all columns.", "<code>SELECT * FROM users;</code>"],
      },
      {
        id: "select-cols",
        title: "Picking columns",
        tables: ["users"],
        explain: `
<p>Usually you only want a few columns. List them after <code>SELECT</code>, separated by commas, in the order you want them shown.</p>
<pre>SELECT name, plan FROM users;</pre>`,
        task: "Show each user's <code>name</code> and <code>country</code>.",
        starter: "SELECT ",
        solution: "SELECT name, country FROM users;",
        hints: ["List the two column names separated by a comma.", "<code>SELECT name, country FROM users;</code>"],
      },
      {
        id: "where",
        title: "Filtering with WHERE",
        tables: ["users"],
        explain: `
<p><code>WHERE</code> keeps only the rows that match a condition. Text values go in <b>single quotes</b>.</p>
<pre>SELECT name FROM users WHERE country = 'India';</pre>
<p>Comparison operators: <code>=</code>, <code>!=</code> (or <code>&lt;&gt;</code>), <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code>. Dates stored as <code>'YYYY-MM-DD'</code> text compare correctly with these too.</p>`,
        task: "Show the <code>name</code> and <code>signup_date</code> of every user on the <code>'pro'</code> plan.",
        starter: "SELECT name, signup_date\nFROM users\nWHERE ",
        solution: "SELECT name, signup_date FROM users WHERE plan = 'pro';",
        hints: ["The condition goes after <code>WHERE</code>, and it compares the <code>plan</code> column.", "<code>WHERE plan = 'pro'</code>"],
      },
      {
        id: "and-or",
        title: "AND, OR",
        tables: ["users"],
        explain: `
<p>Combine conditions with <code>AND</code> (both must be true) and <code>OR</code> (either is true). Use parentheses when you mix them, so it's clear what goes together.</p>
<pre>SELECT name FROM users
WHERE plan = 'free' AND (country = 'UK' OR country = 'Germany');</pre>`,
        task: "Show the <code>name</code> of users who are on the <code>'pro'</code> or <code>'enterprise'</code> plan <b>and</b> are from the <code>'US'</code>.",
        starter: "SELECT name\nFROM users\nWHERE ",
        solution: "SELECT name FROM users WHERE country = 'US' AND (plan = 'pro' OR plan = 'enterprise');",
        hints: ["You need one <code>AND</code> and one <code>OR</code>. Where do the parentheses go?", "<code>WHERE country = 'US' AND (plan = 'pro' OR plan = 'enterprise')</code>"],
      },
      {
        id: "in-between-like",
        title: "IN, BETWEEN, LIKE",
        tables: ["users"],
        explain: `
<p>Three shortcuts that come up all the time:</p>
<ul>
<li><code>country IN ('UK', 'Germany')</code> is the same as two ORs.</li>
<li><code>signup_date BETWEEN '2024-02-01' AND '2024-02-29'</code> includes both ends.</li>
<li><code>name LIKE 'A%'</code> matches text patterns. <code>%</code> means "any characters", <code>_</code> means "exactly one character".</li>
</ul>`,
        task: "Show the <code>name</code> and <code>signup_date</code> of users who signed up in <b>March 2024</b> (from <code>'2024-03-01'</code> to <code>'2024-03-31'</code>).",
        starter: "SELECT name, signup_date\nFROM users\nWHERE ",
        solution: "SELECT name, signup_date FROM users WHERE signup_date BETWEEN '2024-03-01' AND '2024-03-31';",
        hints: ["<code>BETWEEN ... AND ...</code> is perfect for a date range.", "<code>WHERE signup_date BETWEEN '2024-03-01' AND '2024-03-31'</code>"],
      },
      {
        id: "null",
        title: "Missing values (NULL)",
        tables: ["users"],
        explain: `
<p><code>NULL</code> means "no value / unknown". It's not equal to anything, not even another NULL, so <code>country = NULL</code> never matches.</p>
<p>Use <code>IS NULL</code> and <code>IS NOT NULL</code> instead:</p>
<pre>SELECT name FROM users WHERE country IS NOT NULL;</pre>
<p>Interviewers love asking about this, because forgetting it silently gives wrong answers.</p>`,
        task: "Find the <code>user_id</code> and <code>name</code> of users whose <code>country</code> is missing.",
        starter: "SELECT user_id, name\nFROM users\nWHERE ",
        solution: "SELECT user_id, name FROM users WHERE country IS NULL;",
        hints: ["<code>= NULL</code> won't work. There's a special operator.", "<code>WHERE country IS NULL</code>"],
      },
    ],
  },
  {
    id: "sorting",
    title: "Sorting & shaping results",
    blurb: "ORDER BY, LIMIT, DISTINCT and calculated columns.",
    lessons: [
      {
        id: "order-by",
        title: "ORDER BY",
        tables: ["users"],
        ordered: true,
        explain: `
<p>Rows come back in no guaranteed order unless you ask. <code>ORDER BY</code> sorts them. <code>ASC</code> (smallest first) is the default, <code>DESC</code> is largest first.</p>
<pre>SELECT name, signup_date FROM users ORDER BY signup_date DESC;</pre>
<p>You can sort by several columns: <code>ORDER BY country, name</code> sorts by country, then by name within each country.</p>`,
        task: "Show <code>name</code> and <code>signup_date</code> for all users, <b>earliest signup first</b>. If two users signed up the same day, sort them by <code>name</code>.",
        starter: "SELECT name, signup_date\nFROM users\n",
        solution: "SELECT name, signup_date FROM users ORDER BY signup_date, name;",
        hints: ["<code>ORDER BY</code> goes at the end. You need two sort columns.", "<code>ORDER BY signup_date, name</code>"],
      },
      {
        id: "limit",
        title: "Top N with LIMIT",
        tables: ["orders"],
        ordered: true,
        explain: `
<p><code>LIMIT n</code> keeps only the first <i>n</i> rows. Combined with <code>ORDER BY ... DESC</code> it answers "top N" questions:</p>
<pre>SELECT * FROM orders ORDER BY order_date DESC LIMIT 3;  -- 3 most recent orders</pre>
<p>Order matters: SQL sorts first, then applies the limit.</p>`,
        task: "Show the <code>order_id</code>, <code>order_date</code> and <code>amount</code> of the <b>5 most recent</b> orders. Break ties by <code>order_id</code> (highest first).",
        starter: "SELECT order_id, order_date, amount\nFROM orders\n",
        solution: "SELECT order_id, order_date, amount FROM orders ORDER BY order_date DESC, order_id DESC LIMIT 5;",
        hints: ["Sort newest first, then cut the list.", "<code>ORDER BY order_date DESC, order_id DESC LIMIT 5</code>"],
      },
      {
        id: "distinct",
        title: "DISTINCT",
        tables: ["feature_usage"],
        explain: `
<p><code>SELECT DISTINCT</code> removes duplicate rows from the result.</p>
<pre>SELECT DISTINCT country FROM users;</pre>
<p>With several columns, it removes rows where <i>all</i> the listed columns are the same.</p>`,
        task: "List each <b>different</b> <code>feature</code> that appears in <code>feature_usage</code>, once each.",
        starter: "SELECT ",
        solution: "SELECT DISTINCT feature FROM feature_usage;",
        hints: ["Put <code>DISTINCT</code> right after <code>SELECT</code>.", "<code>SELECT DISTINCT feature FROM feature_usage;</code>"],
      },
      {
        id: "alias-calc",
        title: "Calculations and aliases",
        tables: ["orders"],
        explain: `
<p>You can compute new columns with <code>+ - * /</code>, and name them with <code>AS</code>:</p>
<pre>SELECT order_id, amount, amount * 0.2 AS platform_fee FROM orders;</pre>
<p><code>ROUND(x, 2)</code> rounds to 2 decimals. Watch out: in SQLite, dividing two whole numbers gives a whole number (<code>7 / 2 = 3</code>). Multiply by <code>1.0</code> to get decimals (<code>7 * 1.0 / 2 = 3.5</code>).</p>`,
        task: "For every <code>'refunded'</code> order, show <code>order_id</code>, <code>amount</code>, and a column <code>amount_cents</code> with the amount in cents (amount × 100).",
        starter: "SELECT order_id, amount, \nFROM orders\nWHERE ",
        solution: "SELECT order_id, amount, amount * 100 AS amount_cents FROM orders WHERE status = 'refunded';",
        hints: ["Multiply the <code>amount</code> column and give it a name with <code>AS</code>.", "<code>SELECT order_id, amount, amount * 100 AS amount_cents FROM orders WHERE status = 'refunded';</code>"],
      },
    ],
  },
  {
    id: "aggregates",
    title: "Aggregates & GROUP BY",
    blurb: "Counting, summing and grouping: the heart of PM metrics.",
    lessons: [
      {
        id: "count",
        title: "COUNT",
        tables: ["users"],
        explain: `
<p>Aggregate functions squash many rows into one value.</p>
<ul>
<li><code>COUNT(*)</code> counts rows.</li>
<li><code>COUNT(column)</code> counts rows where that column is <b>not NULL</b>.</li>
<li><code>COUNT(DISTINCT column)</code> counts unique non-NULL values.</li>
</ul>
<pre>SELECT COUNT(*) AS total_users FROM users;</pre>`,
        task: "How many users are on the <code>'free'</code> plan? Return a single number.",
        starter: "SELECT COUNT(*)\nFROM users\n",
        solution: "SELECT COUNT(*) FROM users WHERE plan = 'free';",
        hints: ["Filter with <code>WHERE</code> first, then count.", "<code>SELECT COUNT(*) FROM users WHERE plan = 'free';</code>"],
      },
      {
        id: "sum-avg",
        title: "SUM, AVG, MIN, MAX",
        tables: ["orders"],
        explain: `
<p><code>SUM</code>, <code>AVG</code>, <code>MIN</code> and <code>MAX</code> work on numeric columns (MIN/MAX also work on dates and text). You can use several in one query:</p>
<pre>SELECT MIN(amount), MAX(amount), AVG(amount) FROM orders;</pre>
<p>Revenue questions almost always need a filter, because refunded or pending orders usually shouldn't count.</p>`,
        task: "Return two numbers for <code>'completed'</code> orders only: total revenue (<code>SUM</code> of amount) and the average order value (<code>AVG</code> of amount).",
        starter: "SELECT \nFROM orders\nWHERE status = 'completed';",
        solution: "SELECT SUM(amount), AVG(amount) FROM orders WHERE status = 'completed';",
        hints: ["Two aggregate functions separated by a comma.", "<code>SELECT SUM(amount), AVG(amount) FROM orders WHERE status = 'completed';</code>"],
      },
      {
        id: "group-by",
        title: "GROUP BY",
        tables: ["users"],
        explain: `
<p><code>GROUP BY</code> splits rows into groups and runs the aggregate once per group. "How many users per plan?" becomes:</p>
<pre>SELECT plan, COUNT(*) AS users
FROM users
GROUP BY plan;</pre>
<p>Rule of thumb: every column in <code>SELECT</code> should either be in <code>GROUP BY</code> or be inside an aggregate function.</p>`,
        task: "Show each <code>acquisition_source</code> and how many users came from it.",
        starter: "SELECT acquisition_source, COUNT(*)\nFROM users\n",
        solution: "SELECT acquisition_source, COUNT(*) FROM users GROUP BY acquisition_source;",
        hints: ["Group by the column you're counting per.", "<code>GROUP BY acquisition_source</code>"],
      },
      {
        id: "group-multi",
        title: "Several metrics per group",
        tables: ["orders"],
        ordered: true,
        explain: `
<p>You can compute several aggregates per group and sort by one of them. You can refer to an alias in <code>ORDER BY</code>:</p>
<pre>SELECT status, COUNT(*) AS n, SUM(amount) AS total
FROM orders
GROUP BY status
ORDER BY total DESC;</pre>`,
        task: "For each order <code>status</code>, show the status, the number of orders, and the total amount. Sort by number of orders, <b>most first</b>.",
        starter: "SELECT status, \nFROM orders\n",
        solution: "SELECT status, COUNT(*) AS n, SUM(amount) AS total FROM orders GROUP BY status ORDER BY n DESC;",
        hints: ["Use <code>COUNT(*)</code> and <code>SUM(amount)</code>, then <code>GROUP BY status</code>.", "<code>SELECT status, COUNT(*) AS n, SUM(amount) FROM orders GROUP BY status ORDER BY n DESC;</code>"],
      },
      {
        id: "having",
        title: "HAVING",
        tables: ["users"],
        explain: `
<p><code>WHERE</code> filters <b>rows before</b> grouping. <code>HAVING</code> filters <b>groups after</b> aggregating. So conditions on <code>COUNT</code>, <code>SUM</code> etc. go in <code>HAVING</code>.</p>
<pre>SELECT country, COUNT(*) AS n
FROM users
WHERE plan != 'free'
GROUP BY country
HAVING COUNT(*) &gt;= 2;</pre>
<p>The order of clauses is always: <code>SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT</code>.</p>`,
        task: "Which countries have <b>more than 3</b> users? Show the <code>country</code> and its user count. (Ignore users with no country.)",
        starter: "SELECT country, COUNT(*)\nFROM users\n",
        solution: "SELECT country, COUNT(*) FROM users WHERE country IS NOT NULL GROUP BY country HAVING COUNT(*) > 3;",
        hints: ["Group by country, then filter groups with <code>HAVING</code>. Remove NULL countries with <code>WHERE</code>.", "<code>WHERE country IS NOT NULL GROUP BY country HAVING COUNT(*) &gt; 3</code>"],
      },
    ],
  },
  {
    id: "joins",
    title: "JOINs",
    blurb: "Combine tables, the most common interview topic.",
    lessons: [
      {
        id: "inner-join",
        title: "INNER JOIN",
        tables: ["users", "orders"],
        explain: `
<p>Data is split across tables. <code>orders</code> only stores a <code>user_id</code>; the user's name lives in <code>users</code>. A <b>JOIN</b> matches rows from two tables using a shared column.</p>
<pre>SELECT o.order_id, u.name
FROM orders o
JOIN users u ON o.user_id = u.user_id;</pre>
<p><code>o</code> and <code>u</code> are short <b>table aliases</b>. <code>JOIN</code> (same as <code>INNER JOIN</code>) keeps only rows that have a match in both tables.</p>`,
        task: "Show every order's <code>order_id</code>, the user's <code>name</code>, and the order <code>amount</code>.",
        starter: "SELECT o.order_id, u.name, o.amount\nFROM orders o\n",
        solution: "SELECT o.order_id, u.name, o.amount FROM orders o JOIN users u ON o.user_id = u.user_id;",
        hints: ["Join <code>users u</code> on the shared <code>user_id</code> column.", "<code>JOIN users u ON o.user_id = u.user_id</code>"],
      },
      {
        id: "join-group",
        title: "JOIN + GROUP BY",
        tables: ["users", "orders"],
        ordered: true,
        explain: `
<p>Joins and aggregates combine naturally. "Revenue per country" means: join orders to users, then group by country.</p>
<pre>SELECT u.country, SUM(o.amount) AS revenue
FROM orders o
JOIN users u ON o.user_id = u.user_id
WHERE o.status = 'completed'
GROUP BY u.country;</pre>`,
        task: "Show each <code>plan</code> and the total <code>amount</code> of <b>completed</b> orders from users on that plan, highest revenue first.",
        starter: "SELECT u.plan, SUM(o.amount) AS revenue\nFROM orders o\n",
        solution: "SELECT u.plan, SUM(o.amount) AS revenue FROM orders o JOIN users u ON o.user_id = u.user_id WHERE o.status = 'completed' GROUP BY u.plan ORDER BY revenue DESC;",
        hints: ["Join, filter on status, group by plan, then sort.", "<code>... JOIN users u ON o.user_id = u.user_id WHERE o.status = 'completed' GROUP BY u.plan ORDER BY revenue DESC</code>"],
      },
      {
        id: "left-join",
        title: "LEFT JOIN",
        tables: ["users", "orders"],
        explain: `
<p>A <code>LEFT JOIN</code> keeps <b>every</b> row from the left table, even if there's no match on the right. Missing right-side columns become <code>NULL</code>.</p>
<pre>SELECT u.name, o.order_id
FROM users u
LEFT JOIN orders o ON o.user_id = u.user_id;</pre>
<p>Classic trick: to find rows with <i>no</i> match, LEFT JOIN and keep only rows where the right side <code>IS NULL</code>.</p>`,
        task: "Find users who have <b>never placed an order</b>. Show their <code>user_id</code> and <code>name</code>.",
        starter: "SELECT u.user_id, u.name\nFROM users u\n",
        solution: "SELECT u.user_id, u.name FROM users u LEFT JOIN orders o ON o.user_id = u.user_id WHERE o.order_id IS NULL;",
        hints: ["LEFT JOIN orders, then keep rows where the order side is NULL.", "<code>LEFT JOIN orders o ON o.user_id = u.user_id WHERE o.order_id IS NULL</code>"],
      },
      {
        id: "left-join-count",
        title: "Counting with LEFT JOIN",
        tables: ["users", "orders"],
        explain: `
<p>If you want to include zeros ("users with 0 orders"), use a LEFT JOIN and count a column from the right table. <code>COUNT(o.order_id)</code> skips NULLs, so unmatched users get 0. <code>COUNT(*)</code> would wrongly give them 1.</p>`,
        task: "Show every user's <code>name</code> and how many orders they've placed, <b>including users with 0 orders</b>.",
        starter: "SELECT u.name, COUNT(o.order_id) AS orders\nFROM users u\n",
        solution: "SELECT u.name, COUNT(o.order_id) AS orders FROM users u LEFT JOIN orders o ON o.user_id = u.user_id GROUP BY u.user_id, u.name;",
        hints: ["LEFT JOIN orders, then GROUP BY the user.", "<code>LEFT JOIN orders o ON o.user_id = u.user_id GROUP BY u.user_id, u.name</code>"],
      },
      {
        id: "self-join",
        title: "Self join",
        tables: ["employees"],
        explain: `
<p>A table can be joined to <b>itself</b>. In <code>employees</code>, <code>manager_id</code> points to another row in the same table. Give the table two aliases:</p>
<pre>SELECT e.name AS employee, m.name AS manager
FROM employees e
JOIN employees m ON e.manager_id = m.emp_id;</pre>`,
        task: "Show each employee's <code>name</code> and their manager's name, for employees whose manager earns more than <b>200000</b>.",
        starter: "SELECT e.name, m.name\nFROM employees e\n",
        solution: "SELECT e.name, m.name FROM employees e JOIN employees m ON e.manager_id = m.emp_id WHERE m.salary > 200000;",
        hints: ["Join <code>employees m</code> on <code>e.manager_id = m.emp_id</code>, then filter on the manager's salary.", "<code>JOIN employees m ON e.manager_id = m.emp_id WHERE m.salary &gt; 200000</code>"],
      },
    ],
  },
  {
    id: "subqueries",
    title: "Subqueries, CASE & dates",
    blurb: "Queries inside queries, if/else logic, and working with dates.",
    lessons: [
      {
        id: "subquery-where",
        title: "Subquery in WHERE",
        tables: ["orders"],
        explain: `
<p>A <b>subquery</b> is a query in parentheses used inside another query. Here the inner query computes one number, which the outer query compares against:</p>
<pre>SELECT * FROM employees
WHERE salary &gt; (SELECT AVG(salary) FROM employees);</pre>`,
        task: "Show the <code>order_id</code> and <code>amount</code> of orders whose amount is <b>above the average</b> order amount (all orders).",
        starter: "SELECT order_id, amount\nFROM orders\nWHERE ",
        solution: "SELECT order_id, amount FROM orders WHERE amount > (SELECT AVG(amount) FROM orders);",
        hints: ["Compare <code>amount</code> to <code>(SELECT AVG(amount) FROM orders)</code>.", "<code>WHERE amount &gt; (SELECT AVG(amount) FROM orders)</code>"],
      },
      {
        id: "subquery-in",
        title: "IN (subquery)",
        tables: ["users", "feature_usage"],
        explain: `
<p>A subquery can return a list for <code>IN</code> or <code>NOT IN</code>:</p>
<pre>SELECT name FROM users
WHERE user_id IN (SELECT user_id FROM orders WHERE amount &gt; 100);</pre>
<p>This is often easier to read than a join when you only need to check "does a match exist?".</p>`,
        task: "Show the <code>name</code> of every user who has used the <code>'ai_assistant'</code> feature at least once.",
        starter: "SELECT name\nFROM users\nWHERE user_id IN (\n  \n);",
        solution: "SELECT name FROM users WHERE user_id IN (SELECT user_id FROM feature_usage WHERE feature = 'ai_assistant');",
        hints: ["The subquery should return user_ids from <code>feature_usage</code> filtered to that feature.", "<code>WHERE user_id IN (SELECT user_id FROM feature_usage WHERE feature = 'ai_assistant')</code>"],
      },
      {
        id: "case",
        title: "CASE WHEN",
        tables: ["orders"],
        explain: `
<p><code>CASE</code> is SQL's if/else. It's checked top to bottom and the first true branch wins:</p>
<pre>SELECT name,
  CASE WHEN salary &gt;= 150000 THEN 'high'
       WHEN salary &gt;= 120000 THEN 'mid'
       ELSE 'low' END AS band
FROM employees;</pre>
<p>A very common interview pattern is putting CASE inside an aggregate to count subsets: <code>SUM(CASE WHEN status = 'refunded' THEN 1 ELSE 0 END)</code>.</p>`,
        task: "Label every order by size: <code>'small'</code> if amount &lt; 50, <code>'medium'</code> if amount &lt; 150, otherwise <code>'large'</code>. Show each size label and how many orders fall into it.",
        starter: "SELECT\n  CASE WHEN amount < 50 THEN 'small'\n       \n  END AS size,\n  COUNT(*)\nFROM orders\n",
        solution: "SELECT CASE WHEN amount < 50 THEN 'small' WHEN amount < 150 THEN 'medium' ELSE 'large' END AS size, COUNT(*) FROM orders GROUP BY size;",
        hints: ["Finish the CASE with another WHEN and an ELSE, then <code>GROUP BY size</code>.", "<code>CASE WHEN amount &lt; 50 THEN 'small' WHEN amount &lt; 150 THEN 'medium' ELSE 'large' END AS size ... GROUP BY size</code>"],
      },
      {
        id: "cte",
        title: "WITH (CTEs)",
        tables: ["users", "orders"],
        explain: `
<p>A <b>CTE</b> (<code>WITH</code> clause) names a subquery so you can use it like a table. It makes multi-step logic readable, and interviewers appreciate it.</p>
<pre>WITH spend AS (
  SELECT user_id, SUM(amount) AS total
  FROM orders
  GROUP BY user_id
)
SELECT * FROM spend WHERE total &gt; 100;</pre>`,
        task: "Using a CTE, find users whose total <b>completed</b> spend is more than <b>200</b>. Show their <code>name</code> and total spend.",
        starter: "WITH spend AS (\n  SELECT user_id, SUM(amount) AS total\n  FROM orders\n  WHERE status = 'completed'\n  GROUP BY user_id\n)\nSELECT ",
        solution: "WITH spend AS (SELECT user_id, SUM(amount) AS total FROM orders WHERE status = 'completed' GROUP BY user_id) SELECT u.name, s.total FROM spend s JOIN users u ON u.user_id = s.user_id WHERE s.total > 200;",
        hints: ["Join the <code>spend</code> CTE to <code>users</code> to get names, then filter on total.", "<code>SELECT u.name, s.total FROM spend s JOIN users u ON u.user_id = s.user_id WHERE s.total &gt; 200;</code>"],
      },
      {
        id: "dates",
        title: "Working with dates",
        tables: ["users"],
        ordered: true,
        explain: `
<p>In SQLite, dates are text like <code>'2024-03-15'</code>. <code>strftime</code> pulls parts out of them:</p>
<ul>
<li><code>strftime('%Y-%m', signup_date)</code> gives <code>'2024-03'</code> (year-month)</li>
<li><code>strftime('%Y', ...)</code> year, <code>strftime('%m', ...)</code> month</li>
<li><code>date('2024-03-15', '+7 days')</code> does date arithmetic</li>
</ul>
<p>Other databases use <code>DATE_TRUNC</code> or <code>EXTRACT</code> for the same idea. In an interview, just say which one you'd use.</p>`,
        task: "Count signups <b>per month</b>. Show the month as <code>'YYYY-MM'</code> and the number of signups, in month order.",
        starter: "SELECT strftime('%Y-%m', signup_date) AS month, COUNT(*)\nFROM users\n",
        solution: "SELECT strftime('%Y-%m', signup_date) AS month, COUNT(*) FROM users GROUP BY month ORDER BY month;",
        hints: ["Group by the month expression, then sort.", "<code>GROUP BY month ORDER BY month</code>"],
      },
    ],
  },
  {
    id: "patterns",
    title: "Interview patterns",
    blurb: "The questions PM interviewers actually ask.",
    lessons: [
      {
        id: "conversion",
        title: "Conversion rate",
        tables: ["users", "orders"],
        explain: `
<p>"What percent of signups converted to paying?" is a PM classic. Break it into: count users who did the thing, divide by all users.</p>
<pre>SELECT 100.0 * COUNT(DISTINCT o.user_id) / COUNT(DISTINCT u.user_id) AS pct
FROM users u
LEFT JOIN orders o ON o.user_id = u.user_id;</pre>
<p>Note the <code>100.0</code>: it avoids integer division. Use <code>DISTINCT</code> because a user can have many orders.</p>`,
        task: "What percentage of users have at least one <b>completed</b> order? Return one number (e.g. 66.67), rounded to 2 decimals.",
        starter: "SELECT ROUND(100.0 * COUNT(DISTINCT o.user_id) / COUNT(DISTINCT u.user_id), 2)\nFROM users u\nLEFT JOIN orders o\n  ON ",
        solution: "SELECT ROUND(100.0 * COUNT(DISTINCT o.user_id) / COUNT(DISTINCT u.user_id), 2) FROM users u LEFT JOIN orders o ON o.user_id = u.user_id AND o.status = 'completed';",
        hints: ["Careful: if you filter <code>status</code> in WHERE, users without orders disappear. Put the status condition in the <code>ON</code> clause instead.", "<code>ON o.user_id = u.user_id AND o.status = 'completed'</code>"],
      },
      {
        id: "window-rank",
        title: "Ranking (window functions)",
        tables: ["employees"],
        ordered: true,
        explain: `
<p><b>Window functions</b> calculate across related rows without collapsing them like GROUP BY does.</p>
<pre>SELECT name, department, salary,
  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk
FROM employees;</pre>
<ul>
<li><code>PARTITION BY</code> restarts the ranking for each department.</li>
<li><code>ROW_NUMBER()</code> gives 1,2,3 with no ties; <code>RANK()</code> gives ties the same number and skips (1,1,3); <code>DENSE_RANK()</code> doesn't skip (1,1,2).</li>
</ul>`,
        task: "Rank all employees by salary, <b>highest first</b>, across the whole company. Show <code>name</code>, <code>salary</code>, and the rank from <code>RANK()</code>, sorted by rank.",
        starter: "SELECT name, salary,\n  RANK() OVER () AS rnk\nFROM employees\n",
        solution: "SELECT name, salary, RANK() OVER (ORDER BY salary DESC) AS rnk FROM employees ORDER BY rnk;",
        hints: ["Inside <code>OVER ( )</code> put <code>ORDER BY salary DESC</code>. No PARTITION needed since it's company-wide.", "<code>RANK() OVER (ORDER BY salary DESC) AS rnk ... ORDER BY rnk</code>"],
      },
      {
        id: "top-per-group",
        title: "Top 1 per group",
        tables: ["employees"],
        explain: `
<p>"Highest paid person in each department" is a very common question. Rank inside each group with a window function in a CTE, then keep rank 1:</p>
<pre>WITH ranked AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn
  FROM employees
)
SELECT * FROM ranked WHERE rn = 1;</pre>`,
        task: "Show the <code>department</code>, <code>name</code> and <code>salary</code> of the <b>highest paid employee in each department</b>.",
        starter: "WITH ranked AS (\n  SELECT department, name, salary,\n    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn\n  FROM employees\n)\nSELECT ",
        solution: "WITH ranked AS (SELECT department, name, salary, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn FROM employees) SELECT department, name, salary FROM ranked WHERE rn = 1;",
        hints: ["Select from <code>ranked</code> and keep only <code>rn = 1</code>.", "<code>SELECT department, name, salary FROM ranked WHERE rn = 1;</code>"],
      },
      {
        id: "running-total",
        title: "Running totals",
        tables: ["orders"],
        ordered: true,
        explain: `
<p>A window <code>SUM</code> with <code>ORDER BY</code> gives a running (cumulative) total, useful for growth charts:</p>
<pre>SELECT month, revenue,
  SUM(revenue) OVER (ORDER BY month) AS cumulative
FROM monthly;</pre>
<p>You can combine it with a CTE that first aggregates by month.</p>`,
        task: "Show each month (<code>'YYYY-MM'</code> from <code>order_date</code>), the revenue from <b>completed</b> orders that month, and the <b>cumulative</b> revenue so far. Month order.",
        starter: "WITH monthly AS (\n  SELECT strftime('%Y-%m', order_date) AS month, SUM(amount) AS revenue\n  FROM orders\n  WHERE status = 'completed'\n  GROUP BY month\n)\nSELECT ",
        solution: "WITH monthly AS (SELECT strftime('%Y-%m', order_date) AS month, SUM(amount) AS revenue FROM orders WHERE status = 'completed' GROUP BY month) SELECT month, revenue, SUM(revenue) OVER (ORDER BY month) AS cumulative FROM monthly ORDER BY month;",
        hints: ["Use <code>SUM(revenue) OVER (ORDER BY month)</code> in the outer query.", "<code>SELECT month, revenue, SUM(revenue) OVER (ORDER BY month) FROM monthly ORDER BY month;</code>"],
      },
      {
        id: "engagement",
        title: "Engagement metrics",
        tables: ["feature_usage"],
        ordered: true,
        explain: `
<p>PMs care about how many <b>unique users</b> use each feature, not just event counts. <code>COUNT(DISTINCT user_id)</code> is your friend. A common follow-up is "average usage per active user" = total / unique users.</p>`,
        task: "For each <code>feature</code>, show the number of <b>unique users</b> and the <b>total minutes</b> used. Sort by unique users (most first), then feature name.",
        starter: "SELECT feature, \nFROM feature_usage\n",
        solution: "SELECT feature, COUNT(DISTINCT user_id) AS users, SUM(minutes_used) AS minutes FROM feature_usage GROUP BY feature ORDER BY users DESC, feature;",
        hints: ["<code>COUNT(DISTINCT user_id)</code> and <code>SUM(minutes_used)</code>, grouped by feature.", "<code>... GROUP BY feature ORDER BY users DESC, feature</code>"],
      },
    ],
  },
  {
    id: "mock",
    title: "Mock interview",
    blurb: "No explanations, hints unlock after a wrong try. Talk through your thinking out loud!",
    mock: true,
    lessons: [
      {
        id: "mock-second-salary",
        title: "Q1. Second highest salary",
        tables: ["employees"],
        task: "Return the <b>second highest</b> distinct salary in the company, as a single number.",
        starter: "",
        solution: "SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);",
        hints: ["Find the max salary that is less than the overall max. Or use ORDER BY with LIMIT/OFFSET on DISTINCT salaries.", "<code>SELECT MAX(salary) FROM employees WHERE salary &lt; (SELECT MAX(salary) FROM employees);</code>"],
      },
      {
        id: "mock-inactive",
        title: "Q2. Signed up, never engaged",
        tables: ["users", "feature_usage"],
        task: "Which users have <b>never used any feature</b>? Return their <code>user_id</code> and <code>name</code>.",
        starter: "",
        solution: "SELECT u.user_id, u.name FROM users u LEFT JOIN feature_usage f ON f.user_id = u.user_id WHERE f.event_id IS NULL;",
        hints: ["Anti-join: LEFT JOIN and look for NULLs, or use <code>NOT IN</code>.", "<code>SELECT u.user_id, u.name FROM users u LEFT JOIN feature_usage f ON f.user_id = u.user_id WHERE f.event_id IS NULL;</code>"],
      },
      {
        id: "mock-aov-source",
        title: "Q3. AOV by channel",
        tables: ["users", "orders"],
        ordered: true,
        task: "Marketing wants to know which acquisition channel brings the best customers. For each <code>acquisition_source</code>, return the <b>average completed order value</b>, rounded to 2 decimals. Highest first.",
        starter: "",
        solution: "SELECT u.acquisition_source, ROUND(AVG(o.amount), 2) AS aov FROM orders o JOIN users u ON u.user_id = o.user_id WHERE o.status = 'completed' GROUP BY u.acquisition_source ORDER BY aov DESC;",
        hints: ["Join orders to users, filter completed, group by source, AVG the amount.", "<code>SELECT u.acquisition_source, ROUND(AVG(o.amount), 2) AS aov FROM orders o JOIN users u ON u.user_id = o.user_id WHERE o.status = 'completed' GROUP BY 1 ORDER BY aov DESC;</code>"],
      },
      {
        id: "mock-power-users",
        title: "Q4. Power users",
        tables: ["users", "orders"],
        ordered: true,
        task: "Find users with <b>3 or more orders</b> (any status). Return <code>name</code> and their order count, most orders first, then by name.",
        starter: "",
        solution: "SELECT u.name, COUNT(*) AS n FROM orders o JOIN users u ON u.user_id = o.user_id GROUP BY u.user_id, u.name HAVING COUNT(*) >= 3 ORDER BY n DESC, u.name;",
        hints: ["GROUP BY user and filter with HAVING.", "<code>... GROUP BY u.user_id, u.name HAVING COUNT(*) &gt;= 3 ORDER BY n DESC, u.name</code>"],
      },
      {
        id: "mock-refund-rate",
        title: "Q5. Refund rate by plan",
        tables: ["users", "orders"],
        ordered: true,
        task: "For each <code>plan</code>, what percentage of its orders were <code>'refunded'</code>? Return the plan and the refund rate as a percentage rounded to 1 decimal, sorted by plan name.",
        starter: "",
        solution: "SELECT u.plan, ROUND(100.0 * SUM(CASE WHEN o.status = 'refunded' THEN 1 ELSE 0 END) / COUNT(*), 1) AS refund_pct FROM orders o JOIN users u ON u.user_id = o.user_id GROUP BY u.plan ORDER BY u.plan;",
        hints: ["Count refunded orders with <code>SUM(CASE WHEN ... THEN 1 ELSE 0 END)</code> and divide by <code>COUNT(*)</code>.", "<code>ROUND(100.0 * SUM(CASE WHEN o.status = 'refunded' THEN 1 ELSE 0 END) / COUNT(*), 1)</code>"],
      },
      {
        id: "mock-top-feature-pro",
        title: "Q6. Favourite feature of paying users",
        tables: ["users", "feature_usage"],
        ordered: true,
        task: "Among users on a <b>paid plan</b> (<code>'pro'</code> or <code>'enterprise'</code>), which feature has the most total <code>minutes_used</code>? Return the feature and its total minutes (just the top one).",
        starter: "",
        solution: "SELECT f.feature, SUM(f.minutes_used) AS minutes FROM feature_usage f JOIN users u ON u.user_id = f.user_id WHERE u.plan IN ('pro', 'enterprise') GROUP BY f.feature ORDER BY minutes DESC LIMIT 1;",
        hints: ["Join, filter plan with IN, group by feature, sort and LIMIT 1.", "<code>... WHERE u.plan IN ('pro','enterprise') GROUP BY f.feature ORDER BY minutes DESC LIMIT 1</code>"],
      },
    ],
  },
];
