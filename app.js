const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const schedule = require('node-schedule');
const jTask = require('./jobs/tasks');
const path = require('path');
require('dotenv').config({ path: './.env' });

const app = express();

const port = process.env.PORT || 8000;

// Logger
app.use(morgan('short'));

// Cross-Origin Resource Sharing
app.use(cors());

// Conexión con la base de datos
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log(`Conectado a la base de datos`))
    .catch(err => console.log(err));

mongoose.Promise = global.Promise;

// BodyParser para las requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cargamos las rutas de la API.
app.use('/', require('./routes'));


const j = schedule.scheduleJob('* 23 * * *', () => {
    jTask.unsolved();
});

// Servimos la build del cliente
app.use(express.static(path.join(__dirname, './client/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname = 'client/build/index.html'), (err) => {
        if (err) res.status(500).send(err);
    });
});


app.listen(port, () => {
    console.log(`Server funcionando en el puerto ${port}`)
});