// Archivo para crear el esquema
const mongoose = require('mongoose')

// Definir esquema
const tareaSchema = new mongoose.Schema({
    id :{type: String, required: true, unique: true},
    titulo : {type: String, required: true},
    completada : {type: Boolean, default: false},
    usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
})

// Exportar eschema
module.exports = mongoose.model('Tarea', tareaSchema)