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
//let urlMongo = "mongodb+srv://admin-gsz:J4NnXHWqQkPFmIzU@cluster0-iol1z.mongodb.net/cafe?retryWrites=true"

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