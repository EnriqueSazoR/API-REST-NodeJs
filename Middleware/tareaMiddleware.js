// Archivo para crear los middleware necesarios

// Middleware para validar datos del body
const validarDatos =  (req, res, next) => {
    const {id, titulo, completada} = req.body
    if((!titulo || titulo.trim() === "") || (typeof completada !== "boolean"))
    {
        return res.status(401).json({
            error:"Datos Invalidos"
        })
    }
    next()
}

// Middleware para llevar un conteo de los endpoints
let contador = 0
const numeroSolicitudes = (req, res, next) => {
    contador++
    console.log(`Nueva Solicitud: [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)

    next()
}

module.exports = {
    validarDatos,
    numeroSolicitudes,
}