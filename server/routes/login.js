const express = require('express');
const bycript = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const app = express();

let handlerError = (code, err, res) => {
    res.status(code).json({
        ok: false,
        err
    });
}

app.post('/login', (req, res) => {

    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, userDb) => {
        if (err) {
            return handlerError(500, err, res);
        }

        if (!userDb) {
            return handlerError(400, "Usuario o contraseña invalida", res);
        }

        if (!bycript.compareSync(body.password, userDb.password)) {
            return handlerError(400, "Usuario o contraseña invalida", res);
        }

        let token = jwt.sign({
            usuario: userDb
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD });
        res.json({
            ok: true,
            usuario: userDb,
            token
        });
    });


});










module.exports = app;