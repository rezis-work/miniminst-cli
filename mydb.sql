PRAGMA foreign_keys = ON;


CREATE TABLE IF NOT EXISTS something (
  id INTEGER PRIMARY KEY ASC,
  otherID INTEGER,
  data INTEGER,

  FOREIGN KEY (otherID) REFERENCES other (id)
);

CREATE TABLE IF NOT EXISTS other (
  id INTEGER PRIMARY KEY ASC,
  data VARCHAR(40) UNIQUE
);



