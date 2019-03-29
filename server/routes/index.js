const express = require('express');
const app = express();

app.use(require('./usuarios')); //importo las rutas de usuario 
app.use(require('./login')); //importo las rutas de usuario 


module.exports = app;