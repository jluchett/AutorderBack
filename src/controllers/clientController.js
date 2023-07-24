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
    // Verificar si el usuario ya existe en la base de datos
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

module.exports = {
  getClients,
  createClient,
};
