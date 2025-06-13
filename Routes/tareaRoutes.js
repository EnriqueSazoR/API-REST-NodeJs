// Archivo para crear todas las rutas de tareas
const express = require('express')
const router = express.Router()
const {
    crearTarea,
    obtenerTareas,
    obtenerTareaPorId,
    actualizarTarea,
    eliminarTarea
} = require('../Controllers/TareasController')

const {validarDatos, numeroSolicitudes} = require('../Middleware/tareaMiddleware')
const {autenticar} = require('../Middleware/usuarioMiddleware')

// Middleware para contar el número de solicitudes
router.use(numeroSolicitudes)

// Rutas
router.post('/', autenticar, validarDatos, crearTarea)
router.get('/', obtenerTareas)
router.get('/:id', obtenerTareaPorId)
router.put('/:id', validarDatos, actualizarTarea)
router.delete('/:id', eliminarTarea)

module.exports = router