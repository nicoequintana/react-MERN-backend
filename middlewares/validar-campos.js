// Importamos 'response' desde 'express' para poder utilizarlo en nuestras respuestas
const { response } = require('express');

// Importamos 'validationResult' de 'express-validator' para recoger los resultados de las validaciones
const { validationResult } = require('express-validator');

// Definimos nuestro middleware personalizado 'validarCampos'
const validarCampos = (req, res = response, next) => {

    // Obtenemos los errores de validación de la petición (si los hay)
    const errores = validationResult(req);

    // Verificamos si el objeto de errores no está vacío
    if (!errores.isEmpty()) {
        // Si hay errores, respondemos con un estado 400 (Bad Request) y los detalles de los errores
        return res.status(400).json({
            ok: false,
            errores: errores.mapped() // 'mapped' convierte los errores en un objeto fácilmente legible
        });
    }

    // Si no hay errores, llamamos a 'next()' para continuar al siguiente middleware o controlador
    next();
};

// Exportamos el middleware para poder utilizarlo en otras partes de la aplicación
module.exports = {
    validarCampos,
};