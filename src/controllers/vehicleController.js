//vehicleController.js
const db = require("../database/db");
const { validateId, validatePlate, validateName, validateYear, validateMileage } = require("../utils/validators");

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
    console.error("Error al obtener Vehiculos", error);
    res.status(500).json({ message: "Error al obtener Vehiculos" });
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
    
    // Validar campos requeridos
    if (!placa || !marca || !modelo || !anio || !cliente_id) {
      return res.status(400).json({
        message: "Los campos placa, marca, modelo, anio y cliente_id son obligatorios",
        success: false,
      });
    }
    
    // Validar formatos
    validatePlate(placa);
    validateName(marca);
    validateName(modelo);
    validateYear(anio);
    validateId(cliente_id);
    if (kilometraje !== undefined) validateMileage(kilometraje);
    
    // Verificar si el cliente existe
    const clienteQuery = "SELECT id FROM clientes WHERE id = $1";
    const clienteResult = await db.query(clienteQuery, [cliente_id]);
    
    if (clienteResult.rows.length === 0) {
      return res.status(400).json({
        message: "El cliente especificado no existe",
        success: false,
      });
    }
    
    // Verificar si el vehiculo ya existe
    const query = "SELECT * FROM vehiculos WHERE placa = $1";
    const values = [placa];
    const result = await db.query(query, values);

    if (result.rows.length > 0) {
      return res.status(400).json({
        message: "El vehiculo ya fue registrado",
        success: false,
      });
    }
    
    // Ingresar vehículo a la base de datos
    const insertQuery =
      "INSERT INTO vehiculos (placa, marca, modelo, anio, kilometraje, motor, transmision, cliente_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
    const insertValues = [
      placa,
      marca,
      modelo,
      anio,
      kilometraje || null,
      motor || null,
      transmision || null,
      cliente_id,
    ];
    await db.query(insertQuery, insertValues);
    res.status(201).json({
      success: true,
      message: "Vehiculo registrado con exito",
    });
  } catch (error) {
    console.error("Error al ingresar vehiculo", error);
    res.status(500).json({
      message: error.message || "Error al registrar vehiculo",
      success: false,
    });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const { placa } = req.params;
    const { marca, modelo, anio, kilometraje, motor, transmision, cliente_id } =
      req.body;

    // Validar que al menos un campo a actualizar sea proporcionado
    if (!marca && !modelo && !anio && !kilometraje && !motor && !transmision && !cliente_id) {
      return res.status(400).json({
        message: "Debe proporcionar al menos un campo para actualizar",
        success: false,
      });
    }

    // Validar formatos si se proporcionan
    if (marca) validateName(marca);
    if (modelo) validateName(modelo);
    if (anio) validateYear(anio);
    if (kilometraje) validateMileage(kilometraje);
    if (cliente_id) validateId(cliente_id);

    // Si se proporciona cliente_id, verificar que exista
    if (cliente_id) {
      const clienteQuery = "SELECT id FROM clientes WHERE id = $1";
      const clienteResult = await db.query(clienteQuery, [cliente_id]);
      
      if (clienteResult.rows.length === 0) {
        return res.status(400).json({
          message: "El cliente especificado no existe",
          success: false,
        });
      }
    }

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
      return res.status(404).json({
        message: "Vehiculo no encontrado en la bd",
        success: false,
      });
    }
    
    return res.status(200).json({
      message: "Datos del vehiculo actualizados",
      success: true,
    });
  } catch (error) {
    console.error("Error al actualizar info del vehiculo", error);
    res.status(500).json({
      message: error.message || "Error al actualizar datos del vehiculo",
      success: false,
    });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const { placa } = req.params;
    
    // Verificar si el vehículo tiene órdenes asociadas
    const ordenesQuery = "SELECT COUNT(*) FROM ordenes WHERE vehiculo_placa = $1";
    const ordenesResult = await db.query(ordenesQuery, [placa]);
    
    if (ordenesResult.rows[0].count > 0) {
      return res.status(400).json({
        message: "No se puede eliminar el vehículo. Tiene órdenes registradas",
        success: false,
      });
    }
    
    const query = "DELETE FROM vehiculos WHERE placa = $1";
    const result = await db.query(query, [placa]);
    
    if (result.rowCount === 0) {
      return res.status(400).json({
        message: "No se ha eliminado vehiculo",
        success: false,
      });
    }
    
    return res.status(201).json({
      message: "Vehiculo eliminado con exito",
      success: true,
    });
  } catch (error) {
    console.error("Error al eliminar Vehiculo", error);
    res.status(500).json({
      message: error.message || "Error al eliminar Vehiculo",
      success: false,
    });
  }
};

const getVehiclesClient = async (req, res) => {
  try {
    const { idClient } = req.params;
    
    // Verificar que el cliente exista
    validateId(idClient);
    
    const query = "SELECT placa, marca, modelo, anio, kilometraje FROM vehiculos WHERE cliente_id = $1";
    const result = await db.query(query, [idClient]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "no hay vehiculos registrados al cliente" });
    }
    const vehiclesClient = result.rows;
    res.status(201).json({
      vehiclesClient,
    });
  } catch (error) {
    console.error("Error al obtener vehículos del cliente", error);
    res.status(500).json({
      message: error.message || "Error al obtener vehículos del cliente",
    });
  }
};

module.exports = {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehiclesClient,
};
