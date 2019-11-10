const jwt = require('jsonwebtoken');

//============================================================================
//Verificar token
//===========================================================================


let verificaToken = (req, res, next) => {

    //obtener header con el nombre asignado
    let token = req.get('token');
    //console.log(token);

    /* res.json(token); */




    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).send({
                ok: false,
                error: {
                    message: 'Token no válido'
                },
                err
            });
        } else {

            req.usuario = decoded.usuario;

            next();
        }



    });
};


let verificaAdmin_role = (req, res, next) => {

    let usuario = req.usuario;


    if (usuario.role === 'ADMIN_ROLE') {

        next();
    } else {
        res.send({
            ok: false,
            error: {
                message: 'El usuario no es administrador'
            }
        });
    }


}

module.exports = {
    verificaToken,
    verificaAdmin_role
}