/*
*
RUTAS DE USUARIO - AUTH: host + /api/auth
*
*/
// Importamos el módulo 'Router' de Express para crear rutas en nuestra aplicación
const { Router } = require('express');

// Creamos una instancia del enrutador
const router = Router();

// Importamos los controladores que manejan las operaciones de autenticación
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');

// Importamos la función 'check' de 'express-validator' para validar los campos recibidos en las peticiones
const { check } = require('express-validator');

// Importamos nuestros middlewares personalizados para validar campos y tokens JWT
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// =========================
//    Rutas de Autenticación
// =========================

// Ruta para crear un nuevo usuario
router.post(
  '/new', // Endpoint de la ruta
  [
    // Validamos que el campo 'name' no esté vacío
    check('name', 'El nombre es obligatorio.').not().isEmpty(),
    // Validamos que el campo 'email' sea un correo electrónico válido
    check('email', 'El correo debe ser una dirección válida.').isEmail(),
    // Validamos que el campo 'clave' tenga al menos 6 caracteres
    check('clave', 'La clave debe tener al menos 6 caracteres.').isLength({ min: 6 }),
    // Middleware personalizado que verifica los errores de validación anteriores
    validarCampos,
  ],
  crearUsuario // Controlador que maneja la lógica para crear un usuario
);

// Ruta para el inicio de sesión de un usuario
router.post(
  '/', // Endpoint de la ruta
  [
    // Validamos que el campo 'email' sea un correo electrónico válido
    check('email', 'El correo debe ser una dirección válida.').isEmail(),
    // Validamos que el campo 'clave' tenga al menos 6 caracteres
    check('clave', 'La clave debe tener al menos 6 caracteres.').isLength({ min: 6 }),
    // Middleware personalizado que verifica los errores de validación anteriores
    validarCampos,
  ],
  loginUsuario // Controlador que maneja la lógica para el inicio de sesión
);

// Ruta para renovar el token de autenticación
router.get(
  '/renew', // Endpoint de la ruta
  validarJWT, // Middleware que valida el token JWT antes de continuar
  revalidarToken // Controlador que maneja la lógica para renovar el token
);

// Exportamos el enrutador para que pueda ser utilizado en el archivo principal de la aplicación
module.exports = router;
