require('./config/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/usuarios')); //importo las rutas de usuario 





mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useCreateIndex: true
    },
    (err, res) => {
        if (err) {
            throw err;
        }
        console.log("Conectado correctamente");
    });
app.listen(process.env.PORT, () => {
    console.log("Escuchando el puerto: ", 3000);
})