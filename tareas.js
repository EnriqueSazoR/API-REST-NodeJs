// Archivo para crear el esquema
const mongoose = require('mongoose')

// Definir esquema
const tareaSchema = new mongoose.Schema({
    id :{type: String, required: true, unique: true},
    titulo : {type: String, required: true},
    completada : {type: Boolean, required: true}
})

// Exportar eschema
module.exports = mongoose.model('Tarea', tareaSchema)