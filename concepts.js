// Level 0: visual, quiz-style intro to databases. No SQL typing yet.
// All wording lives in locales/<lang>.json (lessons.<id>.steps[i]), matched by position.
// Step kinds: learn (explanation + picture), tap (tap the right row/column/cell/table/word), choice (pick one).
// Small sample tables used for the pictures. Not the real practice data.
window.MINI_TABLES = {
  "users": {
    "emoji": "👤",
    "columns": [
      "user_id",
      "name",
      "country",
      "plan",
      "signup_date"
    ],
    "types": [
      "number",
      "text",
      "text",
      "text",
      "date"
    ],
    "rows": [
      [
        1,
        "Aisha",
        "India",
        "pro",
        "2024-02-11"
      ],
      [
        2,
        "Ben",
        "US",
        "free",
        "2024-01-05"
      ],
      [
        3,
        "Chen",
        null,
        "free",
        "2024-03-20"
      ],
      [
        4,
        "Priya",
        "UK",
        "enterprise",
        "2024-02-28"
      ]
    ]
  },
  "orders": {
    "emoji": "🧾",
    "columns": [
      "order_id",
      "user_id",
      "amount",
      "status"
    ],
    "types": [
      "number",
      "number",
      "number",
      "text"
    ],
    "rows": [
      [
        101,
        2,
        19.99,
        "completed"
      ],
      [
        102,
        4,
        149,
        "completed"
      ],
      [
        103,
        2,
        9.99,
        "refunded"
      ]
    ]
  },
  "feature_usage": {
    "emoji": "📊",
    "columns": [
      "event_id",
      "user_id",
      "feature",
      "minutes"
    ],
    "types": [
      "number",
      "number",
      "text",
      "number"
    ],
    "rows": [
      [
        1,
        1,
        "dashboard",
        12
      ],
      [
        2,
        4,
        "search",
        5
      ],
      [
        3,
        1,
        "reports",
        30
      ]
    ]
  }
};

window.LEVELS.unshift({
  "id": "intro",
  "concept": true,
  "lessons": [
    {
      "id": "intro-tables",
      "type": "concept",
      "steps": [
        {
          "kind": "learn",
          "visual": {
            "tables": [
              "users",
              "orders",
              "feature_usage"
            ],
            "mode": "cards"
          }
        },
        {
          "kind": "tap",
          "visual": {
            "tables": [
              "users",
              "orders",
              "feature_usage"
            ],
            "mode": "cards"
          },
          "target": {
            "type": "table",
            "name": "orders"
          }
        },
        {
          "kind": "tap",
          "visual": {
            "tables": [
              "users",
              "orders",
              "feature_usage"
            ],
            "mode": "cards"
          },
          "target": {
            "type": "table",
            "name": "feature_usage"
          }
        },
        {
          "kind": "choice",
          "answer": 1
        }
      ]
    },
    {
      "id": "intro-rows-cols",
      "type": "concept",
      "steps": [
        {
          "kind": "learn",
          "visual": {
            "tables": [
              "users"
            ],
            "highlight": {
              "row": 1
            }
          }
        },
        {
          "kind": "tap",
          "visual": {
            "tables": [
              "users"
            ]
          },
          "target": {
            "type": "row",
            "table": "users",
            "row": 3
          }
        },
        {
          "kind": "learn",
          "visual": {
            "tables": [
              "users"
            ],
            "highlight": {
              "col": "country"
            }
          }
        },
        {
          "kind": "tap",
          "visual": {
            "tables": [
              "users"
            ]
          },
          "target": {
            "type": "col",
            "table": "users",
            "col": "plan"
          }
        },
        {
          "kind": "learn",
          "visual": {
            "tables": [
              "users"
            ],
            "highlight": {
              "cell": [
                0,
                "country"
              ]
            }
          }
        },
        {
          "kind": "tap",
          "visual": {
            "tables": [
              "users"
            ]
          },
          "target": {
            "type": "cell",
            "table": "users",
            "row": 1,
            "col": "signup_date"
          }
        },
        {
          "kind": "choice",
          "answer": 1
        },
        {
          "kind": "choice",
          "visual": {
            "tables": [
              "users"
            ]
          },
          "answer": 1
        }
      ]
    },
    {
      "id": "intro-types-null",
      "type": "concept",
      "steps": [
        {
          "kind": "learn",
          "visual": {
            "tables": [
              "users"
            ],
            "showTypes": true
          }
        },
        {
          "kind": "choice",
          "visual": {
            "tables": [
              "orders"
            ]
          },
          "answer": 1
        },
        {
          "kind": "learn",
          "visual": {
            "tables": [
              "users"
            ],
            "highlight": {
              "cell": [
                2,
                "country"
              ]
            }
          }
        },
        {
          "kind": "tap",
          "visual": {
            "tables": [
              "users"
            ]
          },
          "target": {
            "type": "cell",
            "table": "users",
            "row": 2,
            "col": "country"
          }
        },
        {
          "kind": "choice",
          "answer": 1
        }
      ]
    },
    {
      "id": "intro-keys",
      "type": "concept",
      "steps": [
        {
          "kind": "learn",
          "visual": {
            "tables": [
              "users"
            ],
            "highlight": {
              "col": "user_id"
            },
            "keys": true
          }
        },
        {
          "kind": "tap",
          "visual": {
            "tables": [
              "orders"
            ],
            "keys": true
          },
          "target": {
            "type": "col",
            "table": "orders",
            "col": "order_id"
          }
        },
        {
          "kind": "learn",
          "visual": {
            "tables": [
              "orders",
              "users"
            ],
            "highlight": {
              "col": "user_id"
            },
            "keys": true,
            "link": true
          }
        },
        {
          "kind": "tap",
          "visual": {
            "tables": [
              "orders",
              "users"
            ],
            "keys": true
          },
          "target": {
            "type": "row",
            "table": "users",
            "row": 3
          }
        },
        {
          "kind": "choice",
          "visual": {
            "tables": [
              "orders",
              "users"
            ],
            "keys": true
          },
          "answer": 2
        }
      ]
    },
    {
      "id": "intro-schema",
      "type": "concept",
      "steps": [
        {
          "kind": "learn",
          "visual": {
            "schema": [
              "users",
              "orders",
              "feature_usage"
            ]
          }
        },
        {
          "kind": "tap",
          "visual": {
            "schema": [
              "users",
              "orders",
              "feature_usage"
            ]
          },
          "target": {
            "type": "col",
            "table": "feature_usage",
            "col": "feature"
          }
        },
        {
          "kind": "tap",
          "visual": {
            "schema": [
              "users",
              "orders",
              "feature_usage"
            ]
          },
          "target": {
            "type": "col",
            "table": "feature_usage",
            "col": "user_id"
          }
        },
        {
          "kind": "choice",
          "answer": 1
        }
      ]
    },
    {
      "id": "intro-sql",
      "type": "concept",
      "steps": [
        {
          "kind": "learn",
          "visual": {
            "tables": [
              "users"
            ],
            "highlight": {
              "col": "name"
            }
          }
        },
        {
          "kind": "tap",
          "tokens": [
            "SELECT",
            "name,",
            "plan",
            "FROM",
            "users",
            ";"
          ],
          "target": {
            "type": "token",
            "index": 4
          }
        },
        {
          "kind": "tap",
          "tokens": [
            "SELECT",
            "amount",
            "FROM",
            "orders",
            ";"
          ],
          "target": {
            "type": "token",
            "index": 2
          }
        },
        {
          "kind": "choice",
          "answer": 1,
          "mono": true
        }
      ]
    }
  ]
});
