const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 8000;

app.use(morgan('short'));

// Conexión con la base de datos
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log(`Conectado a la base de datos`))
    .catch(err => console.log(err));

mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cargamos las rutas de la API.
app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server funcionando en el puerto ${port}`)
});