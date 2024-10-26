CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  lastname VARCHAR(200),
  firstname VARCHAR(200),
  password VARCHAR(200),
  email VARCHAR(200) UNIQUE,
  photo VARCHAR(200),
  pseudo VARCHAR(200)
);

CREATE TABLE friends (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  friend_id INT REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, friend_id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id INT REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INT REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);



