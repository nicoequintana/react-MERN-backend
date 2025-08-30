const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

//FUNCIONES QUE YO TENGO DEFINIDAS PARA LLAMARLAS DESDE EL ROUTER

//controlador para crear usuario
const crearUsuario = async(req, res = response) => {

    const { email, clave } = req.body;

    try {
        //const newUsuario = new Usuario(req.body); //le paso como parametro a la clase Usuario el body de la request (que lo mando por postman) para intentar generar un nuevo usuario
        //await newUsuario.save();
        let usuario = await Usuario.findOne({email: email}) //aca valido que el usuario que viene por el body de la request, exista ya en mi base de datos -- findOne es un metodo de mongoose que busca un solo documento que cumpla con las condiciones que le paso por parametro (en este caso el email) y me devuelve un objeto con los datos de ese documento

        //si el usuario existe, entonces devuelvo un error 400 e informo que ese mail ya se encuentra registrado
        if ( usuario ) { 
            return res.status(400).json({
                ok: false,
                msg: "El usuario ya esta registrado en la base de datos con ese email.",
            })
        }
        //si no existe, guardo la instancia de Usuario que cree arriba (let usuario...) con el metodo de mongoose .save() en la base de datos
        usuario = new Usuario(req.body);

        //ENCRIPTAR CLAVE - lo hago con la libreria bcryptjs y es una encriptacion de una sola via
        const salt = bcrypt.genSaltSync(); //salt sirve para fusionar la clave con valores aleatorios
        usuario.clave = bcrypt.hashSync(clave, salt); //aca con hashsync le paso la clave que viene del body req y ademas el salt que defini arriba


        await usuario.save();
        //GENERAR JSON WEB TOKEN "JWT"
        //creo una constante donde voy a almacenar el token que me viene de la funcion generarJWT que importe del helper
        const token = await generarJWT( usuario.id, usuario.name );
       
        //y muestro que salio todo bien
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token: token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Algo salio mal, hable con el administrador de redes.'
        });
    };

};


const loginUsuario = async(req, res = response) => {

    //aca solo extraigo email y clave porque es lo que voy a necesitar para iniciar sesion
    const {email, clave } = req.body;

    try {
        //confirmar si tengo un usuario con el mail ingresado
        let usuario = await Usuario.findOne({ email: email })
        if (!usuario) {
            return res.status(500).json({
                ok: false,
                msg: 'Usuario y/o clave incorrecta', //es el usuario lo que validamos, el mail, pero no se le dice al usuario, siempre se pone usuairo o clave para marearlo
            })
        }
        
        //confirmar los password
        const validarClave = bcrypt.compareSync(clave, usuario.clave); //con compareSync(parametro a evaluar, parametro de referencia) = devuelve true or false
        // Verificamos si la clave (contraseña) es válida
        if (!validarClave) {
            // Si la clave es incorrecta, respondemos con un error de autenticación
            return res.status(400).json({
                ok: false,
                msg: 'Clave Incorrecta', // Mensaje que indica que la contraseña no coincide
            });
        }

        // Si la clave es correcta, procedemos a generar un JSON Web Token (JWT)
        // El JWT permite mantener la sesión del usuario de forma segura

        // Generamos el token llamando a la función 'generarJWT' pasando el id y nombre del usuario
        const token = await generarJWT(usuario.id, usuario.name);

        // Enviamos una respuesta exitosa al cliente con los datos del usuario y el token generado
        res.status(200).json({
            ok: true,
            uid: usuario.id,    // Identificador único del usuario en la base de datos
            name: usuario.name, // Nombre del usuario
            token: token,       // Token de autenticación generado
        });

    } catch (error) {
        // Si ocurre un error durante el proceso, lo registramos en la consola para depurar
        console.log(error);
        // Enviamos una respuesta de error genérica al cliente
        res.status(500).json({
            ok: false,
            msg: 'Algo salió mal, hable con el administrador de redes.', // Mensaje de error estándar
        });
    }

};

// Definimos el controlador para revalidar el token de autenticación
const revalidarToken = async (req, res = response) => {
    // Podemos obtener el uid y name del usuario desde el token previamente validado (no se muestra aquí)
    const {uid, name} = req;

    //console.log(uid, name)
    
    // Generamos un nuevo token con los datos del usuario
    const token = await generarJWT(uid, name);
    // Respondemos al cliente indicando que el token ha sido renovado y sigue siendo válido
    res.status(200).json({
        ok: true,
        uid,
        name,
        token,
    });
};

// Exportamos las funciones del controlador para poder usarlas en las rutas
module.exports = {
    crearUsuario,     // Función para registrar un nuevo usuario
    loginUsuario,     // Función para iniciar sesión
    revalidarToken,   // Función para revalidar o renovar el token
};