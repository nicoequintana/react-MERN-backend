//seguir los pasos de la documentacion de mongoose. 
//aca creamos el modelo o la CLASE para luego instanciar un objeto usuario y guardarlo con .save() en mi base de datos

const { Schema, model } = require('mongoose');

//el schema es como lo voy a guardar en la base de datos

const UsuarioSchema = Schema({
    
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        require: true,
        uniqued: true,
    },
    clave: {
        type: String,
        required: true
    }
});


module.exports = model( 'Usuario', UsuarioSchema );