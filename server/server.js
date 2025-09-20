import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const SECRET = "supersecretjwtkey";

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'dev_vue'
})

connection.connect((err) => {
    if (err) console.log(err);
    else console.log('DB connected');
})

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

const port= process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`serve at http://localhost:${port}`);
});


function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user; // { id, username }
    next();
  });
};

app.get("/api/check-username", async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: "Username required" });

  connection.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
      }
      res.status(200).json(rows.length > 0);
    }
  );
});

app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" });

  try {
    const password_hash = await bcrypt.hash(password, 10);

    connection.query(
      "INSERT INTO users (username, password_hash) VALUES (?, ?)",
      [username, password_hash],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "User creation failed" });
        }
        res.status(201).json({ message: "User created" });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  connection.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, rows) => {
      if (err) return res.status(500).json({ error: "DB error" });
      if (rows.length === 0)
        return res.status(400).json({ error: "Invalid credentials" });

      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch)
        return res.status(400).json({ error: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET,
        { expiresIn: "2h" }
      );

      res.json({ token });
    }
  );
});

app.get("/api/myPokemons", authenticate, (req, res) => {
  const userId = req.user.id;

  connection.query(
    "SELECT * FROM poke_table WHERE user_id = ?",
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "DB error" });
      res.json(rows);
    }
  );
});

app.post("/api/myPokemons", authenticate, (req, res) => {
  const userId = req.user.id;
  const { name } = req.body;

  if (!name) return res.status(400).json({ error: "Name required" });

  connection.query(
    "INSERT INTO poke_table (name, user_id) VALUES (?, ?)",
    [name, userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: "DB error" });
      res.status(201).json({ id: result.insertId, name });
    }
  );
});

app.delete("/api/myPokemons/:id", authenticate, (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  connection.query(
    "DELETE FROM poke_table WHERE id = ? AND user_id = ?",
    [id, userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: "DB error" });

      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Not found or not your Pokémon" });

      res.json({ message: "Deleted successfully" });
    }
  );
});

