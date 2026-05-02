CREATE TABLE IF NOT EXISTS Note (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Példa kezdőadat, nem kötelező

INSERT INTO Note (title, content, createdAt, updatedAt)
SELECT
  'Első jegyzet',
  'Ez egy példa jegyzet az online napló alkalmazáshoz.',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM Note WHERE title = 'Első jegyzet'
);