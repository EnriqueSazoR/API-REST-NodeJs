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
        const token = jwt.sign({id: user._id, rol: user.rol}, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })
        // Devolver el token
        res.json({mensaje: "Inicio de sesión exitoso", token })

    } catch (error) {
        res.status(500).json({mensaje:"Error el la solicitud"})
    }
    
}

// Middleware para usar solo si el rol es Admin
const restrictToAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.rol !== 'Admin')
    {
      return res.status(403).json({ error: "Acceso denegado, requiere rol Admin" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

module.exports = {login, restrictToAdmin}