const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const { verficarToken, verificarAdmin } = require('../middlewares/autenticacion');
const _ = require('underscore');

const bycript = require('bcrypt');

let handlerError = (err, res) => {
    res.status(400).json({
        ok: false,
        err
    });
}

app.get('/usuario', verficarToken, (req, res) => {

    let fields = 'nombre email role estado google'
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    let filters = {
        estado: true
    };
    Usuario.find(filters, fields)
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return handlerError(err, res);
            }
            Usuario.countDocuments(filters, (err, count) => {
                res.json({
                    ok: true,
                    sise: count,
                    usuarios
                });
            });

        });
})

app.post('/usuario', [verficarToken, verificarAdmin], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bycript.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, userDb) => {
        if (err) {
            return handlerError(err, res);
        }
        userDb.password = null;
        res.json({
            ok: true,
            usuario: userDb
        });
    })


})

app.put('/usuario/:id', [verficarToken, verificarAdmin], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    /*
    option new: devuelve el objeto despues del update
    runValidator: aplica las validaciones definidas, en false no realiza el control*/
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDb) => {

        if (err) {
            return handlerError(err, res);
        }

        res.json({
            ok: true,
            usuario: userDb
        });
    })
})

app.delete('/usuario/:id', [verficarToken, verificarAdmin], (req, res) => {
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, userDelete) => {
        if (err) {
            return handlerError(err, res);
        }

        if (!userDelete) {
            return handlerError('Usuario no encontrado', res);
        }
        res.json({
            ok: true,
            usuario: userDelete
        });
    })


});



module.exports = app;
//Metodo que busca y actualiza un registro por el id