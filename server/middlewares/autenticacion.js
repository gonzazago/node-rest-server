/**Verificar token */

const jwt = require('jsonwebtoken')
const handlerError = require('../errors/handleError');

let verficarToken = (req, res, next) => {

        let token = req.get('Authorization');
        jwt.verify(token, process.env.SEED, (err, decode) => {
            if (err) {
                return handlerError.handlerError(401, err, res);
            }
            req.usuario = decode.usuario;
            next();
        })
    }
    /**Verificar Admin Rol */

let verificarAdmin = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role != 'ADMIN_ROLE') {
        return handlerError.handlerError(401, 'No posee los permisos para la funcion ingresada', res);
    }
    next();
};

module.exports = {
    verficarToken,
    verificarAdmin
}