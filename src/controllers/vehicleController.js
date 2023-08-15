const db = require("../database/db");

const getVehicles = async (req, res) => {
  try {
    const query = "SELECT v.placa, v.marca, v.modelo, v.anio, v.kilometraje, v.motor, v.transmision, v.cliente_id, c.nombre AS nombre_cliente FROM vehiculos v JOIN clientes c ON v.cliente_id = c.id ORDER BY v.placa";
    const result = await db.query(query);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "no hay vehiculos registrados" });
    }
    const vehicles = result.rows;
    res.status(201).json({
      vehicles,
    });
  } catch (error) {
    console.error("Error al obtener clientes", error);
    res.status(500).json({ message: "Error al obtener clientes" });
  }
};

const createVehicle = async (req, res) => {
  try {
    const {
      placa,
      marca,
      modelo,
      anio,
      kilometraje,
      motor,
      transmision,
      cliente_id,
    } = req.body;
    // Verificar si el vehiculo ya existe en la base de datos
    const query = "SELECT * FROM vehiculos WHERE placa = $1";
    const values = [placa];
    const result = await db.query(query, values);

    if (result.rows.length > 0) {
      return res.status(400).json({
        message: "El vehiculo ya fue registrado",
        succes: false,
      });
    }
    //Inngresar vehiculo a la base de datos
    const insertQuery =
      "INSERT INTO vehiculos (placa, marca, modelo, anio, kilometraje, motor, transmision, cliente_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
    const insertValues = [
      placa,
      marca,
      modelo,
      anio,
      kilometraje,
      motor,
      transmision,
      cliente_id,
    ];
    await db.query(insertQuery, insertValues);
    res.status(201).json({
      succes: true,
      message: "Vehiculo registrado con exito",
    });
  } catch (error) {
    console.error("Eror al ingresar vehiculo", error);
    res.status(500).json({
      message: "Error al registrar vehiculo",
      succes: false,
    });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const { placa } = req.params;
    const { marca, modelo, anio, kilometraje, motor, transmision, cliente_id } =
      req.body;

    const query =
      "UPDATE vehiculos SET marca = $2, modelo = $3, anio = $4, kilometraje = $5, motor = $6, transmision = $7, cliente_id = $8 WHERE placa = $1";
    const values = [
      placa,
      marca,
      modelo,
      anio,
      kilometraje,
      motor,
      transmision,
      cliente_id,
    ];

    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      // La consulta no modificó ninguna fila en la base de datos
      return res.status(404).json({
        message: "Vehiculo no encontrado",
        succes: false,
      });
    }
    // Devolver la respuesta con los datos actualizados
    return res.status(200).json({
      message: "Datos del vehiculo actualizados",
      succes: true,
    });
  } catch (error) {
    console.error("Eror al actualizar info del vehiculo", error);
    res.status(500).json({
      message: "Eror al actualizar datos del vehiculo",
      succes: false,
    });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const { placa } = req.params;
    const query = "Delete FROM vehiculos WHERE placa = $1";
    const result = await db.query(query, [placa]);
    if (result.rowCount === 0) {
      return res.status(400).json({
        message: "No se ha eliminado vehiculo",
        succes: false,
      });
    }
    return res.status(201).json({
      message: "Vehiculo eliminado con exito",
      succes: true,
    });
  } catch (error) {
    console.error("Error al eliminar Vehiculo", error);
    res.status(500).json({
      message: "Eror al eliminar Vehiculo",
      succes: false,
    });
  }
};

module.exports = {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
