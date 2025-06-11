// Archivo para crear rutas de usuarios
const express = require('express')
const router = express.Router()
const {crearUsuario, obtenerTareasPorUsuario} = require('../Controllers/UsuarioController')
const {numeroSolicitudes, validarDatos} = require('../Middleware/usuarioMiddleware')

router.use(numeroSolicitudes)

router.post('/', validarDatos, crearUsuario)
router.get('/:usuarioId', obtenerTareasPorUsuario)


module.exports = router
