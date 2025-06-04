// Archivo para crear el servidor
const express = require('express')
const mongoose = require('mongoose')
const {config} = require('dotenv')
const {validarDatos, numeroSolicitudes} = require('./Middleware/tareaMiddleware')
const Tarea = require('./tareas')

config()
const app = express()


app.use(express.json())
app.use(numeroSolicitudes)



// Conectar a base de datos
mongoose.connect(process.env.MONGO_URL, {
    dbName: process.env.MONGO_DB_NAME,
})
.then(() => {
    console.log('Conexión Exitosa')
})
.catch((err) => {
    console.log('Fallo en conexión a base de datos: ', err)
})

// Sección para definir endpoints
// POST
app.post('/api/tareas', validarDatos, async (req, res) => {
    try {
        const {id, titulo, completada} = req.body
        const postTarea = new Tarea({id, titulo, completada})
        await postTarea.save()
        res.status(201).json({mensaje:"Tarea Creada Exitosamente", postTarea})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

// GET(All)
app.get('/api/tareas', async (req, res) => {
    try {
        const tareas = await Tarea.find()
        res.json({
            mensaje:"Lista de tareas",
            tareas: tareas
        })
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

// GET(ID)
app.get('/api/tareas/:id', async (req, res) => {
    try {
        const tareaEncontrada = await Tarea.findOne({id: req.params.id})
        if(!tareaEncontrada) return res.status(400).json({error:"tarea no encontrada"})
        res.json({tareaEncontrada})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

// PUT(ID)
app.put('/api/tareas/:id', validarDatos, async(req, res) => {
    try {
        const putTarea = await Tarea.findOne({id:req.params.id})
        if(!putTarea) return res.status(400).json({error:"tarea no encontrada"})
        putTarea.titulo = req.body.titulo ?? putTarea.titulo
        putTarea.completada = req.body.completada ?? putTarea.completada

        await putTarea.save()
        res.json({mensaje:"tarea actualizada", putTarea})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

// DELETE(ID)
app.delete('/api/tareas/:id', async(req, res) => {
    try {
        const deleteTarea = await Tarea.findOne({id:req.params.id})
        if(!deleteTarea) return res.status(400).json({error:"tarea no encontrada"})
        await deleteTarea.deleteOne()
        res.json({mensaje:"tarea eliminada"})
    } catch (error) {
        res.json({error:error.message})
    }
})


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Servidor ejecutandose en http://localhost:${port}`))
