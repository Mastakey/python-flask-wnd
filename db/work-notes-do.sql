DROP TABLE table_content;
CREATE TABLE table_content
(
    id INTEGER PRIMARY KEY ASC AUTOINCREMENT,
    content_blob NOT NULL
);

DROP TABLE table_work;
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

DROP TABLE table_notes;
CREATE TABLE table_notes
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

DROP TABLE table_do;
CREATE TABLE table_do
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

DROP TABLE rel_work_work;
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

DROP TABLE history;
CREATE TABLE history
(
    id INTEGER PRIMARY KEY ASC AUTOINCREMENT,
    table_name TEXT NOT NULL,
    ref_id INTEGER NOT NULL,
    change_type TEXT NOT NULL,
    old_content_id INTEGER,
    new_content_id INTEGER,
    old_value TEXT,
    new_value TEXT,
    FOREIGN KEY(old_content_id) REFERENCES table_content(id),
    FOREIGN KEY(new_content_id) REFERENCES table_content(id)    
);