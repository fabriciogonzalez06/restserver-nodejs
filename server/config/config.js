//Puerto 

process.env.PORT = process.env.PORT || 3000;


//Entorno 
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    //variable de entorno creada en heroku con la conexion a la base de datos mongo heroku config:set nombre=""
    urlDB = process.env.MONGODB_URI;
}

process.env.URLDB = urlDB;