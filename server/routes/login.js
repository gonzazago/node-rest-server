const express = require('express');
const bycript = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const {errorcode} = require('../constantes/error-contants');
const{ handlerResponse}= require('../errors/handlerResponse');

const app = express();

let generateToken = (usuario ) =>{
    return jwt.sign({
        usuario: usuario
    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD });
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
        let token =  generateToken(userDb);
        res.json({
            ok: true,
            usuario: userDb,
            token
        });
    });
});

app.post('/google', async (req, res) => {
    let token= req.body.idtoken;
     let googleUser = await verify(token).catch( e => {
            return handlerResponse(false,errorcode.FORBIDEN,e,res)
        }
    );

    Usuario.findOne({email: googleUser.email},(err,usuarioDb) =>{
        if(err){
            return handlerResponse(false,errorcode.INTERNAL_ERROR,e,res);
        }
        if(!usuarioDb){
            let usuarioNew = new Usuario({
                nombre: googleUser.name,
                email: googleUser.email,
                img: googleUser.picture,
                password: ':)'
            });
            usuarioNew.save((err,usuarioDb) =>{
                if(err){
                    //return handlerResponse(false,500,err,res);
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = generateToken(usuarioDb);

                return res.json({
                    ok: true,
                    usuario: usuarioDb,
                    token
                });
            });
        }else if(usuarioDb.google === false){
            return handlerResponse(false,400,'Debe utilizar autenticacion normal',res);
        }else{
            let token = generateToken(usuarioDb);
            return res.json({
                ok: true,
                usuario: usuarioDb,
                token
            });
        }
    })
    res.json({
        token
    })

})

/**COnfiguracion de google */

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID });
  const payload = ticket.getPayload();
  return{
      nombre: payload.name,
      mail: payload.email,
      img: payload.picture,
      google: true
  }

}


module.exports = app;