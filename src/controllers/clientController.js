const db = require("../database/db");

const getClients = async (req, res) => {
  try {
    const query = "SELECT * FROM clientes order by id";
    const result = await db.query(query);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "no hay clientes registrados" });
    }
    const clients = result.rows;
    res.status(201).json({
      clients,
    });
  } catch (error) {
    console.error("Error al obtener clientes", error);
    res.status(500).json({ message: "Error al obtener clientes" });
  }
};

const createClient = async (req, res) => {
  try {
    const { id, nombre, telefono, email } = req.body;
    // Verificar si el cliente ya existe en la base de datos
    const query = "SELECT * FROM clientes WHERE id = $1";
    const values = [id];
    const result = await db.query(query, values);

    if (result.rows.length > 0) {
      return res.status(400).json({
        message: "El cliente ya existe",
        succes: false,
      });
    }
    //Inngresar cliente a la base de datos
    const insertQuery =
      "INSERT INTO clientes (id, nombre, telefono, email) VALUES ($1, $2, $3, $4)";
    const insertValues = [id, nombre, telefono, email];
    await db.query(insertQuery, insertValues);
    res.status(201).json({
      succes: true,
      message: "Cliente registrado con exito",
    });
  } catch (error) {
    console.error("Eror al crear cliente", error);
    res.status(500).json({
      message: "Error al crear cliente",
      succes: false,
    });
  }
};

const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, email } = req.body;

    const query =
      "UPDATE clientes SET nombre = $2, telefono = $3, email = $4 WHERE id = $1";
    const values = [id, nombre, telefono, email];

    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      // La consulta no modificó ninguna fila en la base de datos
      return res.status(404).json({
        message: "Cliente no encontrado",
        succes: false,
      });
    }
    // Devolver la respuesta con los datos actualizados
    return res.status(200).json({
      message: "Datos del cliente actualizados",
      succes: true,
    });
  } catch (error) {
    console.error("Eror al actualizar info del cliente", error);
    res.status(500).json({
      message: "Eror al actualizar info del cliente",
      succes: false,
    });
  }
};

const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "Delete FROM clientes WHERE id = $1";
    const result = await db.query(query, [id]);
    if (result.rowCount === 0) {
      return res.status(400).json({
        message: "No se ha eliminado cliente",
        succes: false,
      });
    }
    return res.status(201).json({
      message: "Cliente eliminado con exito",
      succes: true,
    });
  } catch (error) {
    console.error("Error al eliminar cliente", error);
    res.status(500).json({
      message: "Eror al eliminar cliente",
      succes: false,
    });
  }
};

module.exports = {
  getClients,
  createClient,
  updateClient,
  deleteClient,
};
