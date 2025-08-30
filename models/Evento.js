//seguir los pasos de la documentacion de mongoose. 
//aca creamos el modelo o la CLASE para luego instanciar un objeto usuario y guardarlo con .save() en mi base de datos

const { Schema, model } = require('mongoose');

//el schema es como lo voy a guardar en la base de datos

const EventoSchema = Schema({
    
    title: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }

});


EventoSchema.method('toJSON', function() {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object
})

module.exports = model( 'Evento', EventoSchema );