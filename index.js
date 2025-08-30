const express = require('express');
const { conexionBaseDeDatos } = require('./database/config')
const cors = require('cors');
require('dotenv').config();

//ver por consola todos los procesos que tengo corriendo
console.log(process.env)

//crear el servidor de express

const app = express();

//conectar base de datos
conexionBaseDeDatos();

// CORS
app.use(cors())

//para mostrar el directorio publico, que se vea el html con estilos - Directorio Publico
app.use( express.static('./public') );    //es un middleware en express, es una funcion que se ejecuta en el momento en que alguien hace una peticion a mi servidor.

//LECTURA Y PARSEO DEL BODY
//hay que pasar todas las peticiones por otro middleware
app.use(express.json());

//rutas - tipo de peticion que voy a estar esperando
//TODO: auth = crear, login, renew
//ahora hago uso del middleware que cree en auth.js
app.use('/api/auth', require('./routes/auth'));
//TODO: CRUD: Crear, Actualizar, Borrar y Leer EVENTOS
app.use('/api/events', require('./routes/events'));

//escuchar peticiones
app.listen( process.env.PORT , () => {
    console.log(`El servidor esta corriendo en el puerto ${process.env.PORT}`)
}) 








