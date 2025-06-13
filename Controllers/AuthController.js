// Controlador para autenticar a los usuarios
const Usuario = require('../Models/usuario')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const login = async (req, res) => {
    try {
        const {email, clave} = req.body
        // consultar si existen en la bd
        if(!email || !clave)
        {
            return res.status(400).json({mensaje:"Ambos campos son obligatorios"})
        }

        const user = await Usuario.findOne({email})
        if(!user)
        {
            return res.status(401).json({error: "Credenciales Inválidas"})
        }

        // Comparar Clave
        if(user.clave !== clave)
        {
            return res.status(401).json({error: "Credenciales Inválidas"})
        }
        // Generar Token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })
        // Devolver el token
        res.json({mensaje: "Inicio de sesión exitoso", token })

    } catch (error) {
        res.status(500).json({mensaje:"Error el la solicitud"})
    }
    
}

module.exports = {login}