// SQL lesson structure: answers, tables and starter code.
// All wording (titles, explanations, tasks, hints) lives in locales/<lang>.json under the same ids.
// Each lesson is checked by running `solution` and comparing its result with the learner's result
// (column names don't matter, values do). ordered: true means row order matters.
window.LEVELS = [
  {
    "id": "basics",
    "lessons": [
      {
        "id": "select-all",
        "tables": [
          "users"
        ],
        "starter": "SELECT ",
        "solution": "SELECT * FROM users;"
      },
      {
        "id": "select-cols",
        "tables": [
          "users"
        ],
        "starter": "SELECT ",
        "solution": "SELECT name, country FROM users;"
      },
      {
        "id": "where",
        "tables": [
          "users"
        ],
        "starter": "SELECT name, signup_date\nFROM users\nWHERE ",
        "solution": "SELECT name, signup_date FROM users WHERE plan = 'pro';"
      },
      {
        "id": "and-or",
        "tables": [
          "users"
        ],
        "starter": "SELECT name\nFROM users\nWHERE ",
        "solution": "SELECT name FROM users WHERE country = 'US' AND (plan = 'pro' OR plan = 'enterprise');"
      },
      {
        "id": "in-between-like",
        "tables": [
          "users"
        ],
        "starter": "SELECT name, signup_date\nFROM users\nWHERE ",
        "solution": "SELECT name, signup_date FROM users WHERE signup_date BETWEEN '2024-03-01' AND '2024-03-31';"
      },
      {
        "id": "null",
        "tables": [
          "users"
        ],
        "starter": "SELECT user_id, name\nFROM users\nWHERE ",
        "solution": "SELECT user_id, name FROM users WHERE country IS NULL;"
      }
    ]
  },
  {
    "id": "sorting",
    "lessons": [
      {
        "id": "order-by",
        "tables": [
          "users"
        ],
        "ordered": true,
        "starter": "SELECT name, signup_date\nFROM users\n",
        "solution": "SELECT name, signup_date FROM users ORDER BY signup_date, name;"
      },
      {
        "id": "limit",
        "tables": [
          "orders"
        ],
        "ordered": true,
        "starter": "SELECT order_id, order_date, amount\nFROM orders\n",
        "solution": "SELECT order_id, order_date, amount FROM orders ORDER BY order_date DESC, order_id DESC LIMIT 5;"
      },
      {
        "id": "distinct",
        "tables": [
          "feature_usage"
        ],
        "starter": "SELECT ",
        "solution": "SELECT DISTINCT feature FROM feature_usage;"
      },
      {
        "id": "alias-calc",
        "tables": [
          "orders"
        ],
        "starter": "SELECT order_id, amount, \nFROM orders\nWHERE ",
        "solution": "SELECT order_id, amount, amount * 100 AS amount_cents FROM orders WHERE status = 'refunded';"
      }
    ]
  },
  {
    "id": "aggregates",
    "lessons": [
      {
        "id": "count",
        "tables": [
          "users"
        ],
        "starter": "SELECT COUNT(*)\nFROM users\n",
        "solution": "SELECT COUNT(*) FROM users WHERE plan = 'free';"
      },
      {
        "id": "sum-avg",
        "tables": [
          "orders"
        ],
        "starter": "SELECT \nFROM orders\nWHERE status = 'completed';",
        "solution": "SELECT SUM(amount), AVG(amount) FROM orders WHERE status = 'completed';"
      },
      {
        "id": "group-by",
        "tables": [
          "users"
        ],
        "starter": "SELECT acquisition_source, COUNT(*)\nFROM users\n",
        "solution": "SELECT acquisition_source, COUNT(*) FROM users GROUP BY acquisition_source;"
      },
      {
        "id": "group-multi",
        "tables": [
          "orders"
        ],
        "ordered": true,
        "starter": "SELECT status, \nFROM orders\n",
        "solution": "SELECT status, COUNT(*) AS n, SUM(amount) AS total FROM orders GROUP BY status ORDER BY n DESC;"
      },
      {
        "id": "having",
        "tables": [
          "users"
        ],
        "starter": "SELECT country, COUNT(*)\nFROM users\n",
        "solution": "SELECT country, COUNT(*) FROM users WHERE country IS NOT NULL GROUP BY country HAVING COUNT(*) > 3;"
      }
    ]
  },
  {
    "id": "joins",
    "lessons": [
      {
        "id": "inner-join",
        "tables": [
          "users",
          "orders"
        ],
        "starter": "SELECT o.order_id, u.name, o.amount\nFROM orders o\n",
        "solution": "SELECT o.order_id, u.name, o.amount FROM orders o JOIN users u ON o.user_id = u.user_id;"
      },
      {
        "id": "join-group",
        "tables": [
          "users",
          "orders"
        ],
        "ordered": true,
        "starter": "SELECT u.plan, SUM(o.amount) AS revenue\nFROM orders o\n",
        "solution": "SELECT u.plan, SUM(o.amount) AS revenue FROM orders o JOIN users u ON o.user_id = u.user_id WHERE o.status = 'completed' GROUP BY u.plan ORDER BY revenue DESC;"
      },
      {
        "id": "left-join",
        "tables": [
          "users",
          "orders"
        ],
        "starter": "SELECT u.user_id, u.name\nFROM users u\n",
        "solution": "SELECT u.user_id, u.name FROM users u LEFT JOIN orders o ON o.user_id = u.user_id WHERE o.order_id IS NULL;"
      },
      {
        "id": "left-join-count",
        "tables": [
          "users",
          "orders"
        ],
        "starter": "SELECT u.name, COUNT(o.order_id) AS orders\nFROM users u\n",
        "solution": "SELECT u.name, COUNT(o.order_id) AS orders FROM users u LEFT JOIN orders o ON o.user_id = u.user_id GROUP BY u.user_id, u.name;"
      },
      {
        "id": "self-join",
        "tables": [
          "employees"
        ],
        "starter": "SELECT e.name, m.name\nFROM employees e\n",
        "solution": "SELECT e.name, m.name FROM employees e JOIN employees m ON e.manager_id = m.emp_id WHERE m.salary > 200000;"
      }
    ]
  },
  {
    "id": "subqueries",
    "lessons": [
      {
        "id": "subquery-where",
        "tables": [
          "orders"
        ],
        "starter": "SELECT order_id, amount\nFROM orders\nWHERE ",
        "solution": "SELECT order_id, amount FROM orders WHERE amount > (SELECT AVG(amount) FROM orders);"
      },
      {
        "id": "subquery-in",
        "tables": [
          "users",
          "feature_usage"
        ],
        "starter": "SELECT name\nFROM users\nWHERE user_id IN (\n  \n);",
        "solution": "SELECT name FROM users WHERE user_id IN (SELECT user_id FROM feature_usage WHERE feature = 'ai_assistant');"
      },
      {
        "id": "case",
        "tables": [
          "orders"
        ],
        "starter": "SELECT\n  CASE WHEN amount < 50 THEN 'small'\n       \n  END AS size,\n  COUNT(*)\nFROM orders\n",
        "solution": "SELECT CASE WHEN amount < 50 THEN 'small' WHEN amount < 150 THEN 'medium' ELSE 'large' END AS size, COUNT(*) FROM orders GROUP BY size;"
      },
      {
        "id": "cte",
        "tables": [
          "users",
          "orders"
        ],
        "starter": "WITH spend AS (\n  SELECT user_id, SUM(amount) AS total\n  FROM orders\n  WHERE status = 'completed'\n  GROUP BY user_id\n)\nSELECT ",
        "solution": "WITH spend AS (SELECT user_id, SUM(amount) AS total FROM orders WHERE status = 'completed' GROUP BY user_id) SELECT u.name, s.total FROM spend s JOIN users u ON u.user_id = s.user_id WHERE s.total > 200;"
      },
      {
        "id": "dates",
        "tables": [
          "users"
        ],
        "ordered": true,
        "starter": "SELECT strftime('%Y-%m', signup_date) AS month, COUNT(*)\nFROM users\n",
        "solution": "SELECT strftime('%Y-%m', signup_date) AS month, COUNT(*) FROM users GROUP BY month ORDER BY month;"
      }
    ]
  },
  {
    "id": "patterns",
    "lessons": [
      {
        "id": "conversion",
        "tables": [
          "users",
          "orders"
        ],
        "starter": "SELECT ROUND(100.0 * COUNT(DISTINCT o.user_id) / COUNT(DISTINCT u.user_id), 2)\nFROM users u\nLEFT JOIN orders o\n  ON ",
        "solution": "SELECT ROUND(100.0 * COUNT(DISTINCT o.user_id) / COUNT(DISTINCT u.user_id), 2) FROM users u LEFT JOIN orders o ON o.user_id = u.user_id AND o.status = 'completed';"
      },
      {
        "id": "window-rank",
        "tables": [
          "employees"
        ],
        "ordered": true,
        "starter": "SELECT name, salary,\n  RANK() OVER () AS rnk\nFROM employees\n",
        "solution": "SELECT name, salary, RANK() OVER (ORDER BY salary DESC) AS rnk FROM employees ORDER BY rnk;"
      },
      {
        "id": "top-per-group",
        "tables": [
          "employees"
        ],
        "starter": "WITH ranked AS (\n  SELECT department, name, salary,\n    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn\n  FROM employees\n)\nSELECT ",
        "solution": "WITH ranked AS (SELECT department, name, salary, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn FROM employees) SELECT department, name, salary FROM ranked WHERE rn = 1;"
      },
      {
        "id": "running-total",
        "tables": [
          "orders"
        ],
        "ordered": true,
        "starter": "WITH monthly AS (\n  SELECT strftime('%Y-%m', order_date) AS month, SUM(amount) AS revenue\n  FROM orders\n  WHERE status = 'completed'\n  GROUP BY month\n)\nSELECT ",
        "solution": "WITH monthly AS (SELECT strftime('%Y-%m', order_date) AS month, SUM(amount) AS revenue FROM orders WHERE status = 'completed' GROUP BY month) SELECT month, revenue, SUM(revenue) OVER (ORDER BY month) AS cumulative FROM monthly ORDER BY month;"
      },
      {
        "id": "engagement",
        "tables": [
          "feature_usage"
        ],
        "ordered": true,
        "starter": "SELECT feature, \nFROM feature_usage\n",
        "solution": "SELECT feature, COUNT(DISTINCT user_id) AS users, SUM(minutes_used) AS minutes FROM feature_usage GROUP BY feature ORDER BY users DESC, feature;"
      }
    ]
  },
  {
    "id": "mock",
    "mock": true,
    "lessons": [
      {
        "id": "mock-second-salary",
        "tables": [
          "employees"
        ],
        "starter": "",
        "solution": "SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);"
      },
      {
        "id": "mock-inactive",
        "tables": [
          "users",
          "feature_usage"
        ],
        "starter": "",
        "solution": "SELECT u.user_id, u.name FROM users u LEFT JOIN feature_usage f ON f.user_id = u.user_id WHERE f.event_id IS NULL;"
      },
      {
        "id": "mock-aov-source",
        "tables": [
          "users",
          "orders"
        ],
        "ordered": true,
        "starter": "",
        "solution": "SELECT u.acquisition_source, ROUND(AVG(o.amount), 2) AS aov FROM orders o JOIN users u ON u.user_id = o.user_id WHERE o.status = 'completed' GROUP BY u.acquisition_source ORDER BY aov DESC;"
      },
      {
        "id": "mock-power-users",
        "tables": [
          "users",
          "orders"
        ],
        "ordered": true,
        "starter": "",
        "solution": "SELECT u.name, COUNT(*) AS n FROM orders o JOIN users u ON u.user_id = o.user_id GROUP BY u.user_id, u.name HAVING COUNT(*) >= 3 ORDER BY n DESC, u.name;"
      },
      {
        "id": "mock-refund-rate",
        "tables": [
          "users",
          "orders"
        ],
        "ordered": true,
        "starter": "",
        "solution": "SELECT u.plan, ROUND(100.0 * SUM(CASE WHEN o.status = 'refunded' THEN 1 ELSE 0 END) / COUNT(*), 1) AS refund_pct FROM orders o JOIN users u ON u.user_id = o.user_id GROUP BY u.plan ORDER BY u.plan;"
      },
      {
        "id": "mock-top-feature-pro",
        "tables": [
          "users",
          "feature_usage"
        ],
        "ordered": true,
        "starter": "",
        "solution": "SELECT f.feature, SUM(f.minutes_used) AS minutes FROM feature_usage f JOIN users u ON u.user_id = f.user_id WHERE u.plan IN ('pro', 'enterprise') GROUP BY f.feature ORDER BY minutes DESC LIMIT 1;"
      }
    ]
  }
];
