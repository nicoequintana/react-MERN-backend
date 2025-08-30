
const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req = request, res = response , next) => {

    // x-token = headers
    const token = req.header('x-token');
    //console.log(token)

    if ( !token ) {
        return res.status(401).json({
            ok: false,
            errors: 'No hay token en la peticion'
        })
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );
        req.uid = payload.uid;
        req.name = payload.name;

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: ' token no valido'
        })
    }

    next();
}




module.exports={
    validarJWT,
}