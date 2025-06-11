// Archivo para generar los controladores de los usuarios
const { default: mongoose } = require('mongoose')
const Usuario = require('../Models/usuario')
const Tarea = require('../Models/tareas')


const crearUsuario = async (req, res) => {
    try {
        const {nombre, email, tareas} = req.body
        // validar que los ID de tareas sean ObjectId válidos
        if(tareas && tareas.length > 0)
        {
            for(const tarea of tareas)
            {
                if(!mongoose.isValidObjectId(tarea.id))
                {
                    return res.status(400).json({ error: 'ID de tarea inválido'})
                }
                const tareaExiste = await Tarea.findById(tarea.id)
                if(!tareaExiste)
                {
                    return res.status(400).json({ error: `Tarea con ID ${tarea.id} no existe`})
                }
            }
        }  
        const postUsuario = new Usuario({nombre, email, tareas})
        await postUsuario.save()
        res.status(201).json({mensaje:"Usuario creado exitosamente", postUsuario})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const obtenerTareasPorUsuario = async (req, res) => {
    try {
        const {usuarioId} = req.params

        // validar que usuarioId sea un ObjectId válido
        if(!mongoose.isValidObjectId(usuarioId))
        {
            return res.status(400).json({ error: 'ID de usuario inválido'})
        }
        // Buscar usuario por ID y popular tareas
        const usuario = await Usuario.findById(usuarioId).populate('tareas.id')
        if(!usuario)
        {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }

        res.status(200).json({Tarea: usuario.tareas})

    } catch (error) {
        res.status(500).json({ error: 'Error del servidor: ' + error.message })
    }
}

module.exports = {
    crearUsuario,
    obtenerTareasPorUsuario
}