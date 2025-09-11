import mysql from 'mysql';

export default function dbConnect() {
    let data
    const connection = mysql.createConnection({
        host: '127.0.0.1:3306',
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

    connection.query('SELECT * FROM dev_vue.poke_table', (err, rows, fields) => {
        if (err) throw err

        console.log('The first pokemon is: ', rows[0].name)
        data = rows[0];
    })

    return data
}