// Archivo para manejar controladores de las tareas
const Tarea = require("../Models/tareas");
const Usuario = require("../Models/usuario");

const crearTarea = async (req, res) => {
  try {
    const { id, titulo, completada, usuario } = req.body;
    const postTarea = new Tarea({
      id,
      titulo,
      completada: completada || false,
      usuario
    });
    await postTarea.save();

    // Asignar tarea creada al usuario autenticado
    const usuarioAutenticado = await Usuario.findByIdAndUpdate(
      req.userId,
      { $push: { tareas: postTarea._id } },
      { new: true, runValidators: true }
    );
    if (!usuarioAutenticado) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.status(201).json({ mensaje: "Tarea Creada Exitosamente", postTarea });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const obtenerTareas = async (req, res) => {
  try {
    const { page = 1, limit = 10, completada } = req.query;
    const query =
      completada !== undefined ? { completada: completada === "true" } : {};

    const tareas = await Tarea.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("usuario", "nombre");

    const total = await Tarea.countDocuments(query);

    res.json({
      mensaje: "Lista de tareas",
      tareas,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerTareaPorId = async (req, res) => {
  try {
    const tareaEncontrada = await Tarea.findOne({ id: req.params.id });
    if (!tareaEncontrada)
      return res.status(400).json({ error: "tarea no encontrada" });
    res.json({ tareaEncontrada });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarTarea = async (req, res) => {
  try {
    const putTarea = await Tarea.findOne({ id: req.params.id });
    if (!putTarea)
      return res.status(400).json({ error: "tarea no encontrada" });
    putTarea.titulo = req.body.titulo ?? putTarea.titulo;
    putTarea.completada = req.body.completada ?? putTarea.completada;

    await putTarea.save();
    res.json({ mensaje: "tarea actualizada", putTarea });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarTarea = async (req, res) => {
  try {
    const deleteTarea = await Tarea.findOne({ id: req.params.id });
    if (!deleteTarea)
      return res.status(400).json({ error: "tarea no encontrada" });
    await deleteTarea.deleteOne();
    res.json({ mensaje: "tarea eliminada" });
  } catch (error) {
    res.json({ error: error.message });
  }
};

const reporteTareas = async (req, res) => {
  try {
    const reporte = await Tarea.aggregate([
      {
        $group: {
          _id: "$usuario",
          completadas: { $sum: { $cond: ["$completada", 1, 0] } },
          noCompletadas: { $sum: { $cond: ["$completada", 0, 1] } },
        },
      },
      {
        $lookup: {
          from: "usuarios",
          localField: "_id",
          foreignField: "_id",
          as: "usuarioInfo",
        },
      },
      { $unwind: "$usuarioInfo" },
      {
        $project: {
          nombreUsuario: "$usuarioInfo.nombre",
          completadas: 1,
          noCompletadas: 1,
          _id: 0,
        },
      },
    ]);
    res.json(reporte);
  } catch (error) {
    res.status(500).json({ error: "Error al generar el reporte" });
  }
};

module.exports = {
  crearTarea,
  obtenerTareas,
  obtenerTareaPorId,
  actualizarTarea,
  eliminarTarea,
  reporteTareas,
};
