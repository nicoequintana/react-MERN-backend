const jwt = require('jsonwebtoken');


//creo una funcion que genere el jwt
//le paso como parametro a la funcion lo que debo colocar como payload de mi jwt, en este caso, uid, name
const generarJWT = ( uid, name ) => {

    //creo una promesa para generar el jwt
    return new Promise( (resolve, reject) => {
        const payload = { uid, name };
        //con el metodo sign de jwt firmo el documento y le pase como parametro el payload (que tiene uid y name) y ademas la secret word que la tengo como variable de entorno en .env
        //como tercer parametro le pueso pasar, por ejemplo, la propiedad expiresIn y la cant de horas antes de expirar
        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
                expiresIn: '4h',
            }, (error, token) => { //aca le paso como 4to parametro una casllback function que se va a llamar cuando ya se firma el token para manejar posibles errores
            
                if(error){
                    console.log(error);
                    reject('No se pudo generar el token')
                }
                resolve(token);
            }
        );
    } );
}


module.exports = {
    generarJWT,
}