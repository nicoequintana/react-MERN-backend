/*
*
RUTAS DE USUARIO - EVENTS: host + /api/events
*
*/


const { Router } = require('express');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');

const router = Router();

// Todas tienen que pasar por la validacion del JWT
router.use(validarJWT); //todas las peticiones deberan validar jwt, se pone de manera global para no ponerlo en cada ruta.

// Obtener eventos
router.get(
    '/getEventos',
    getEventos
);


// Crear eventos
router.post(
    '/crearEvento',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
        validarCampos,
    ],  
    crearEvento
);


// Actualizar eventos
router.put(
    '/actualizarEvento/:id',
    actualizarEvento
);


// Eliminar eventos
router.delete(
    '/eliminarEvento/:id',
    eliminarEvento
);


module.exports = router;