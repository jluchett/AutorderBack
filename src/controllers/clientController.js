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

module.exports = {
    getClients,
}