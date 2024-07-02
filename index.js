const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser'); 
const { PORT, HOST, USER, PASSWORD, DBNAME } = require('./config');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DBNAME
});

db.connect(err => {
    if(err) throw err;
    console.log('MySQL connected');
})

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.get('/users', (req, res) => {

    const query = "SELECT * FROM `users`";
    db.query(query, (err, results) => {
        if(err) throw err;
        res.json(results);
    });
});

app.post('/users/create', (req, res) => {

    const query = "INSERT INTO `users` (`name`, `email`, `password`) VALUES (?, ?, ?)";
    const { name, email, password } = req.body;

    db.query(query, [name, email, password], (err, results) => {
        if(err) throw err;
        res.status(200).json({message: "User created"});
    });

});

app.put('/users/update/:userid', (req, res) => {
    
    const query = "UPDATE `users` SET `name` = ?, email = ?, password = ? WHERE `users`.`id` = ?"
    const { name, email, password } = req.body;
    const { userid } = req.params;

    db.query(query, [name, email, password, userid], (err, result) => {
        
        if(err) throw err;

        res.status(200).json({message: "User updated"});

    });

});

app.delete('/users/delete/:userid', (req, res) => {

    const query = "DELETE FROM `users` WHERE `users`.`id` = ?";
    const { userid } = req.params;

    db.query(query, [userid], (err, result) => {
        
        if(err) throw err;

        res.status(200).json({message: "User deleted"});

    });

})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})