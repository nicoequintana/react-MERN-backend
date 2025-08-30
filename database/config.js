const mongoose = require('mongoose');


const conexionBaseDeDatos = async () => {
    try {
        await mongoose.connect( process.env.DB_CNN );
        console.log('BASE DE DATOS CONECTADA')
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de inicializar la base de datos');
    };
}

module.exports = {
    conexionBaseDeDatos,
}




