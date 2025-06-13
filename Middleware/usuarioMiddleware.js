// Archivo para crear los middleware necesarios
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// Middleware para validar datos del body utilzando express-validator
const validarDatos =  [
    check('nombre')
        .escape()
        .isLength({min: 5}).withMessage("El nombre debe tener al menos 15 caracteres"),
    check('clave')
        .escape()
        .isLength({min: 10}).withMessage("La contraseña debe tener al menos 10 caracteres"),
    check('email')
        .isEmail().withMessage("El email debe tener la estructura correcta de un correo"),
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

// Middleware para autenticcar usuarios
const autenticar = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization')
        if(!authHeader)
        {
            return res.status(401).json({ mensaje: 'Acceso denegado, token requerido' })
        }

        // Verificar que el token tenga el formato Bearer
        const token = authHeader.replace('Bearer ', '')
        if(!token)
        {
            return res.status(401).json({ mensaje: 'Formato de token inválido' })
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.id
        
        next()
    } catch (error) {
        res.status(401).json({ mensaje: 'Token inválido o expirado' })
    }
}

module.exports = {
    validarDatos,
    numeroSolicitudes,
    autenticar
}