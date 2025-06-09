// Archivo para crear los middleware necesarios
const {check, validationResult} = require('express-validator')

// Middleware para validar datos del body utilzando express-validator
const validarDatos =  [
    check('titulo')
        .escape()
        .isLength({min: 3}).withMessage("El título debe tener al menos 3 caracteres"),
    check('completada')
        .isBoolean().withMessage("El campo de completada debe ser booleano"),
    (req, res, next) => {
        const errores = validationResult(req)
        if(errores.isEmpty())
        {
            next()
        }
        else
        {
            const errorMessage = errores.array().map(error => error.msg)
            return res.status(400).json({ errores: errorMessage})
        }
    }
]

// Middleware para llevar un conteo de los endpoints
let contador = 0
const numeroSolicitudes = (req, res, next) => {
    contador++
    console.log(`Nueva Solicitud: [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)

    next()
}

module.exports = {
    validarDatos,
    numeroSolicitudes
}