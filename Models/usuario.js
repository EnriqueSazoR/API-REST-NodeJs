// Archivo para crear schema usuario
const mongoose = require('mongoose')

// Definir Schema
const usuarioSchema = new mongoose.Schema({
    nombre : {type: String, required: "El nombre es obligatorio"},
    email : {type: String, required: "El correo es obligatorio"},
    tareas : [{
        id: {type: mongoose.Types.ObjectId, ref: 'Tarea'}
    }]
})

module.exports = mongoose.model('Usuario', usuarioSchema)