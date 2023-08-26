const db = require("../database/db");

const getProducts = async (req, res) => {
  try {
    const query = "SELECT * FROM prodserv order by nombre";
    const result = await db.query(query);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "no hay productos registrados" });
    }
    const products = result.rows;
    res.status(201).json({
      products,
    });
  } catch (error) {
    console.error("Error al obtener productos", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { nombre, precio } = req.body;
    // Verificar si el producto ya existe en la base de datos
    const query = "SELECT * FROM prodserv WHERE nombre = $1";
    const values = [nombre];
    const result = await db.query(query, values);

    if (result.rows.length > 0) {
      return res.status(400).json({
        message: "Ya hay un producto con ese nombre",
        succes: false,
      });
    }
    //Ingresar producto a la base de datos
    const insertQuery = "INSERT INTO prodserv (nombre, precio) VALUES ($1, $2)";
    const insertValues = [nombre, precio];
    await db.query(insertQuery, insertValues);
    res.status(201).json({
      succes: true,
      message: "producto agregado con exito",
    });
  } catch (error) {
    console.error("Eror al crear producto", error);
    res.status(500).json({
      message: "Error al crear producto",
      succes: false,
    });
  }
};

module.exports = {
  getProducts,
  createProduct,
};
