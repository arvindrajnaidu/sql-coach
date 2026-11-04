// Level 0: visual, quiz-style intro to databases. No SQL typing yet.
// Step kinds:
//   learn  - explanation + picture, then "Continue"
//   tap    - tap the right row / column / cell / table / word
//   choice - pick one answer
(function () {
  // Small sample tables used for the pictures. Not the real practice data.
  window.MINI_TABLES = {
    users: {
      emoji: "👤",
      blurb: "people who signed up",
      columns: ["user_id", "name", "country", "plan", "signup_date"],
      types: ["number", "text", "text", "text", "date"],
      rows: [
        [1, "Aisha", "India", "pro", "2024-02-11"],
        [2, "Ben", "US", "free", "2024-01-05"],
        [3, "Chen", null, "free", "2024-03-20"],
        [4, "Priya", "UK", "enterprise", "2024-02-28"],
      ],
    },
    orders: {
      emoji: "🧾",
      blurb: "things people bought",
      columns: ["order_id", "user_id", "amount", "status"],
      types: ["number", "number", "number", "text"],
      rows: [
        [101, 2, 19.99, "completed"],
        [102, 4, 149.0, "completed"],
        [103, 2, 9.99, "refunded"],
      ],
    },
    feature_usage: {
      emoji: "📊",
      blurb: "who used which feature",
      columns: ["event_id", "user_id", "feature", "minutes"],
      types: ["number", "number", "text", "number"],
      rows: [
        [1, 1, "dashboard", 12],
        [2, 4, "search", 5],
        [3, 1, "reports", 30],
      ],
    },
  };

  const lessons = [
    {
      id: "intro-tables",
      type: "concept",
      title: "What's a database?",
      steps: [
        {
          kind: "learn",
          html: `<p>👋 Welcome! Before writing any code, let's learn the words people use.</p>
<p>A <b>database</b> is where a company keeps its data, organised so it's easy to look things up. Think of it as a very tidy collection of spreadsheets.</p>
<p>Each "spreadsheet" is called a <b>table</b>. A product might have one table for users, one for orders, and one for feature usage.</p>`,
          visual: { tables: ["users", "orders", "feature_usage"], mode: "cards" },
        },
        {
          kind: "tap",
          prompt: "Your manager asks: <b>how much money did we make last week?</b> Tap the table you'd look in.",
          visual: { tables: ["users", "orders", "feature_usage"], mode: "cards" },
          target: { type: "table", name: "orders" },
          right: "Yes! Money comes from purchases, and purchases live in <code>orders</code>.",
          wrong: "Not that one. Which table is about things people bought?",
        },
        {
          kind: "tap",
          prompt: "Now: <b>which features are people using the most?</b> Tap the table.",
          visual: { tables: ["users", "orders", "feature_usage"], mode: "cards" },
          target: { type: "table", name: "feature_usage" },
          right: "Exactly. <code>feature_usage</code> records each time someone uses a feature.",
          wrong: "Look for the table that's about features.",
        },
        {
          kind: "choice",
          prompt: "A <b>table</b> is most like…",
          options: ["A single number", "A spreadsheet with rows and columns", "A chart", "A programming language"],
          answer: 1,
          right: "Right. Tables look and feel a lot like spreadsheet tabs.",
        },
      ],
    },
    {
      id: "intro-rows-cols",
      type: "concept",
      title: "Rows, columns & cells",
      steps: [
        {
          kind: "learn",
          html: `<p>Here's the <code>users</code> table up close.</p>
<p>A <b>row</b> (also called a <i>record</i>) is <b>one thing</b>. Here, each row is one person. The highlighted row is everything we know about Ben.</p>`,
          visual: { tables: ["users"], highlight: { row: 1 }, label: "← one row = one user" },
        },
        {
          kind: "tap",
          prompt: "Tap anywhere on <b>Priya's row</b>.",
          visual: { tables: ["users"] },
          target: { type: "row", table: "users", row: 3 },
          right: "Nice. That whole line is Priya's record.",
          wrong: "Find the line where the name is Priya.",
        },
        {
          kind: "learn",
          html: `<p>A <b>column</b> (also called a <i>field</i>) is <b>one kind of information</b>, the same for every row. The highlighted column is <code>country</code>.</p>
<p>The bold names at the top are <b>column names</b>. You'll type these in your queries.</p>`,
          visual: { tables: ["users"], highlight: { col: "country" } },
        },
        {
          kind: "tap",
          prompt: "Tap the <b>plan</b> column.",
          visual: { tables: ["users"] },
          target: { type: "col", table: "users", col: "plan" },
          right: "Yes. Every user has a plan, so it's a column.",
          wrong: "Look at the names along the top. Which one says plan?",
        },
        {
          kind: "learn",
          html: `<p>Where a row and a column cross, you get a <b>cell</b>: a single value. This cell is <i>Aisha's country</i>.</p>`,
          visual: { tables: ["users"], highlight: { cell: [0, "country"] } },
        },
        {
          kind: "tap",
          prompt: "Tap the cell that shows <b>Ben's signup date</b>.",
          visual: { tables: ["users"] },
          target: { type: "cell", table: "users", row: 1, col: "signup_date" },
          right: "Perfect: Ben's row, signup_date column.",
          wrong: "Find Ben's row first, then slide across to signup_date.",
        },
        {
          kind: "choice",
          prompt: "In the <code>users</code> table, what does <b>one row</b> represent?",
          options: ["One country", "One user", "One plan", "One column"],
          answer: 1,
          right: "Exactly. One row, one user. In <code>orders</code>, one row is one order.",
        },
        {
          kind: "choice",
          prompt: "How many <b>columns</b> does this <code>users</code> table have?",
          visual: { tables: ["users"] },
          options: ["4", "5", "6", "20"],
          answer: 1,
          right: "Yes: user_id, name, country, plan, signup_date.",
        },
      ],
    },
    {
      id: "intro-types-null",
      type: "concept",
      title: "Data types & empty values",
      steps: [
        {
          kind: "learn",
          html: `<p>Every column holds one <b>type</b> of data:</p>
<ul><li><b>number</b>: 42, 19.99</li><li><b>text</b>: 'Ben', 'pro' (in SQL, text goes in 'single quotes')</li><li><b>date</b>: '2024-02-11' (year-month-day)</li></ul>
<p>The little grey labels under each column name show its type.</p>`,
          visual: { tables: ["users"], showTypes: true },
        },
        {
          kind: "choice",
          prompt: "What type of data is in the <code>amount</code> column of <code>orders</code>?",
          visual: { tables: ["orders"] },
          options: ["text", "number", "date"],
          answer: 1,
          right: "Right, amounts are numbers, so we can add them up.",
        },
        {
          kind: "learn",
          html: `<p>Sometimes a value is <b>missing</b>. Databases call that <b>NULL</b>. It means "unknown" or "not filled in", which is different from zero or an empty word.</p>
<p>Chen never told us their country, so that cell is NULL.</p>`,
          visual: { tables: ["users"], highlight: { cell: [2, "country"] } },
        },
        {
          kind: "tap",
          prompt: "Tap the <b>NULL</b> (missing) value.",
          visual: { tables: ["users"] },
          target: { type: "cell", table: "users", row: 2, col: "country" },
          right: "Got it. Interviewers love asking how you'd handle NULLs!",
          wrong: "Look for the cell that says NULL in grey.",
        },
        {
          kind: "choice",
          prompt: "NULL means…",
          options: ["The number zero", "The value is missing / unknown", "An error in the database", "The word 'null'"],
          answer: 1,
          right: "Yes. NULL is \"we don't know\", not zero.",
        },
      ],
    },
    {
      id: "intro-keys",
      type: "concept",
      title: "Keys: how tables connect",
      steps: [
        {
          kind: "learn",
          html: `<p>Every table has a column that gives each row a <b>unique ID</b>, like a passport number. It's called the <b>primary key</b>.</p>
<p>In <code>users</code> it's <code>user_id</code>. No two users ever share one.</p>`,
          visual: { tables: ["users"], highlight: { col: "user_id" }, keys: true },
        },
        {
          kind: "tap",
          prompt: "Tap the <b>primary key</b> column of <code>orders</code>.",
          visual: { tables: ["orders"], keys: true },
          target: { type: "col", table: "orders", col: "order_id" },
          right: "Yes, <code>order_id</code> uniquely identifies each order.",
          wrong: "The primary key is the unique ID for each order. Which column is that?",
        },
        {
          kind: "learn",
          html: `<p>How do we know <b>who</b> placed an order? The <code>orders</code> table has a <code>user_id</code> column that <b>points to</b> a row in <code>users</code>.</p>
<p>A column that points to another table's primary key is a <b>foreign key</b>. It's the bridge between tables. Order 101 has user_id <b>2</b>, so it was Ben.</p>`,
          visual: { tables: ["orders", "users"], highlight: { col: "user_id" }, keys: true, link: true },
        },
        {
          kind: "tap",
          prompt: "Order <b>102</b>: who bought it? Tap that person's row in <code>users</code>.",
          visual: { tables: ["orders", "users"], keys: true },
          target: { type: "row", table: "users", row: 3 },
          right: "Correct! Order 102 has user_id 4, which is Priya. Combining tables like this is called a <b>JOIN</b>. You'll learn it later.",
          wrong: "Find order 102's user_id, then find the user with that ID.",
        },
        {
          kind: "choice",
          prompt: "Ben (user_id 2) has how many orders?",
          visual: { tables: ["orders", "users"], keys: true },
          options: ["0", "1", "2", "3"],
          answer: 2,
          right: "Yes, orders 101 and 103 both have user_id 2.",
        },
      ],
    },
    {
      id: "intro-schema",
      type: "concept",
      title: "Schemas: the map",
      steps: [
        {
          kind: "learn",
          html: `<p>A <b>schema</b> is the blueprint of a database: which tables exist, what columns they have, their types, and how they link. It shows no actual data, just the structure.</p>
<p>In an interview you'll often be shown a schema like this and asked to write a query. Reading it calmly is half the battle.</p>`,
          visual: { schema: ["users", "orders", "feature_usage"] },
        },
        {
          kind: "tap",
          prompt: "In the schema, tap the column that tells you <b>which feature</b> was used.",
          visual: { schema: ["users", "orders", "feature_usage"] },
          target: { type: "col", table: "feature_usage", col: "feature" },
          right: "Yes, <code>feature_usage.feature</code>. People often write table.column like that.",
          wrong: "Look inside the feature_usage box.",
        },
        {
          kind: "tap",
          prompt: "Tap the column in <code>feature_usage</code> that <b>links back to users</b>.",
          visual: { schema: ["users", "orders", "feature_usage"] },
          target: { type: "col", table: "feature_usage", col: "user_id" },
          right: "Exactly: <code>user_id</code> is the foreign key back to <code>users</code>.",
          wrong: "Which column has the same name as the users primary key?",
        },
        {
          kind: "choice",
          prompt: "A schema shows…",
          options: ["Every row of data", "The structure: tables, columns, types and links", "Charts of the data", "Only the primary keys"],
          answer: 1,
          right: "Right. A schema is the map, not the territory.",
        },
      ],
    },
    {
      id: "intro-sql",
      type: "concept",
      title: "Meet SQL",
      steps: [
        {
          kind: "learn",
          html: `<p><b>SQL</b> (say "sequel" or "S-Q-L") is how you ask a database questions. It reads almost like English:</p>
<p>"Show me the <b>name</b> of every user" becomes:</p>
<pre>SELECT name FROM users;</pre>
<p><code>SELECT</code> says <b>which columns</b> you want. <code>FROM</code> says <b>which table</b>. The answer comes back as a new little table.</p>`,
          visual: { tables: ["users"], highlight: { col: "name" } },
        },
        {
          kind: "tap",
          prompt: "In this query, tap the <b>table name</b>.",
          tokens: ["SELECT", "name,", "plan", "FROM", "users", ";"],
          target: { type: "token", index: 4 },
          right: "Yes! The table comes right after FROM.",
          wrong: "The table name comes after the word FROM.",
        },
        {
          kind: "tap",
          prompt: "Tap the word that says <b>which table</b> to look in. It always comes just before the table name.",
          tokens: ["SELECT", "amount", "FROM", "orders", ";"],
          target: { type: "token", index: 2 },
          right: "Right, FROM. SELECT picks columns, FROM picks the table.",
          wrong: "SELECT picks columns. Which keyword picks the table?",
        },
        {
          kind: "choice",
          prompt: "Which query shows the <b>country</b> of every user?",
          options: ["SELECT users FROM country;", "SELECT country FROM users;", "FROM users SELECT country;", "SHOW country IN users;"],
          answer: 1,
          right: "Perfect: SELECT the column, FROM the table. 🎉 You know the basics now. Next up: writing real queries!",
          mono: true,
        },
      ],
    },
  ];

  window.LEVELS.unshift({
    id: "intro",
    title: "Database basics",
    blurb: "Tables, rows, columns and keys: a visual warm-up quiz.",
    concept: true,
    lessons,
  });
})();
