-- Create the 'assistants' table
CREATE TABLE assistants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    openai_id TEXT NOT NULL UNIQUE
);

-- Create the 'users' table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE
);

-- Create the 'threads' table
CREATE TABLE threads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    openai_id TEXT NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    summary TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create the 'threads' table
CREATE TABLE exams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    openai_id TEXT NOT NULL UNIQUE,
    questions TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    completed INTEGER DEFAULT 0,
    summary TEXT,
    answers TEXT,
    feedback TEXT,
    created TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (email) values ("lachlan@lachlan-miller.me")