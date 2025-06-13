// Archivo para generar los controladores de los usuarios
const { default: mongoose } = require("mongoose");
const Usuario = require("../Models/usuario");
const Tarea = require("../Models/tareas");

const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, clave, tareas } = req.body;
    // validar que los ID de tareas sean ObjectId válidos
    if (tareas && tareas.length > 0) {
      for (const tarea of tareas) {
        if (!mongoose.isValidObjectId(tarea.id)) {
          return res.status(400).json({ error: "ID de tarea inválido" });
        }
        const tareaExiste = await Tarea.findById(tarea.id);
        if (!tareaExiste) {
          return res
            .status(400)
            .json({ error: `Tarea con ID ${tarea.id} no existe` });
        }
      }
    }
    const postUsuario = new Usuario({ nombre, email, clave, tareas });
    await postUsuario.save();
    res
      .status(201)
      .json({ mensaje: "Usuario creado exitosamente", postUsuario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const obtenerTareasPorUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.id; // ID del usuario desde la URL

    // Validar que el ID sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
      return res.status(400).json({ mensaje: "ID de usuario inválido" });
    }

    const usuario = await Usuario.findById(usuarioId).populate("tareas");
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({ Tarea: usuario.tareas });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Error del servidor", error: error.message });
  }
};

module.exports = {
  crearUsuario,
  obtenerTareasPorUsuario,
};
