CREATE TABLE table_work
(
    id INTEGER PRIMARY KEY ASC AUTOINCREMENT,
    name TEXT NOT NULL,
    content_id INTEGER NOT NULL,
    createdate TEXT,
    lastdate TEXT,
    parent_id INTEGER,
    active INTEGER NOT NULL,
    FOREIGN KEY(parent_id) REFERENCES table_work(id),
    FOREIGN KEY(content_id) REFERENCES table_content(id)
);

CREATE TABLE table_notes
(
    id INTEGER PRIMARY KEY ASC AUTOINCREMENT,
    name TEXT NOT NULL,
    createdate TEXT,
    lastdate TEXT,
    parent_id INTEGER,
    active INTEGER NOT NULL,
    FOREIGN KEY(parent_id) REFERENCES table_work(id),
    FOREIGN KEY(content_id) REFERENCES table_content(id)
);

CREATE TABLE table_content
(
    id INTEGER PRIMARY KEY ASC AUTOINCREMENT,
    content_blob NOT NULL
);

CREATE TABLE rel_work_work
(
    id INTEGER PRIMARY KEY ASC AUTOINCREMENT,
    work_id_1 INTEGER NOT NULL,
    work_id_2 INTEGER NOT NULL,
    createdate TEXT,
    lastdate TEXT,
    active INTEGER NOT NULL,
    type TEXT,
    FOREIGN KEY(work_id_1) REFERENCES table_work(id)
    FOREIGN KEY(work_id_2) REFERENCES table_work(id)
);