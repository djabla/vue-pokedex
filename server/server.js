import express from 'express';
import data from './data.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import dbConnect from './localListServer.js';
import mysql from 'mysql';

const app = express();

// dbConnect();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'dev_vue'
})

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('connection success');
    }
})

app.use("/", express.Router());
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

const port= process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`serve at http://localhost:${port}`);
});

app.get('/api/myPokemons/:id', (req, res)=>{
    console.log(dbConnect());
    console.log(req, res);
    const pokemon = data.myPokemons.find((x)=> x._id === req.params.id);
    if (pokemon) {
        res.send(pokemon);
    } else {
        res.status(404).send({message: 'pokemon is not found'});
    }
})

app.get('/api/myPokemons', (req, res) => {
  connection.query('SELECT * FROM dev_vue.poke_table', (err, rows) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    console.log('Rows:', rows);

    res.json(rows);
  });
});


app.get('/', (req, res)=>{
    res.send(data.myPokemons);
});

app.post('/api/myPokemons', (req, res)=>{
    const { name } = req.body; // 👈 grab name from request body

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    connection.query('INSERT INTO dev_vue.poke_table (name) VALUES (?)', [name], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        console.log('Rows inserted:', result.affectedRows);
        res.status(201).json({ id: result.insertId, name });
    })
})

app.delete('/api/myPokemons/:id', (req, res)=>{
    const pokemon = data.myPokemons.find((x)=> x._id === req.params.id);
    if (pokemon) {
        data.myPokemons = data.myPokemons.filter((x)=> x._id !== req.params.id);
        res.status(200).send({message: 'pokemon is deleted'});
    } else {
        res.status(404).send({message: 'pokemon is not found'});
    }
})

app.put('/api/myPokemons/:id', (req, res)=>{
    const pokemon = data.myPokemons.find((x)=> x._id === req.params.id);
    if (pokemon) {
        pokemon.name = req.body.name;
        pokemon.img = req.body.img;
        pokemon.pokeId = req.body.pokeId;
        res.status(200).send(pokemon);
    } else {
        res.status(404).send({message: 'pokemon is not found'});
    }
})
