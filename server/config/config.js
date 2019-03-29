/**
 * Puerto
 */

process.env.PORT = process.env.PORT || 3000;
/**
 * CONFIGURACION - ENTORNO 
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * CONFIGURACION VD
 */
let urlMongo = process.env.MONGO_URI
let urlLocal = "mongodb://localhost:27017/cafe"
let urlConnectionDb;

if (process.env.NODE_ENV === 'dev') {
    urlConnectionDb = urlLocal;
} else {
    console.log(urlMongo);
    urlConnectionDb = urlMongo;
}

process.env.URLDB = urlConnectionDb;


/**
 * Token expiration
 * 60 seg * 60 min * 24 hs * 30 dias
 */

process.env.CADUCIDAD = 60 * 60 * 24 * 30;

/**Semilla token */
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';