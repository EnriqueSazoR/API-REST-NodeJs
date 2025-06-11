// Archivo para crear el servidor
const express = require('express')
const mongoose = require('mongoose')
const {config} = require('dotenv')
const tareaRoutes = require('./Routes/tareaRoutes')
const usuarioRoutes = require('./Routes/usuarioRoutes')

config()
const app = express()

app.use(express.json())


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

// Rutas
app.use('/api/tareas', tareaRoutes)
app.use('/tareas/usuario', usuarioRoutes)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Servidor ejecutandose en http://localhost:${port}`))
