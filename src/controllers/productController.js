//productController.js
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

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio } = req.body;

    const query = "UPDATE prodserv SET nombre = $2, precio = $3 WHERE id = $1";
    const values = [id, nombre, precio];

    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      // La consulta no modificó ninguna fila en la base de datos
      return res.status(404).json({
        message: "No se pudo actualizar producto",
        succes: false,
      });
    }
    // Devolver la respuesta con los datos actualizados
    return res.status(200).json({
      message: "Datos del producto actualizados",
      succes: true,
    });
  } catch (error) {
    console.error("Eror al actualizar producto", error);
    res.status(500).json({
      message: "Eror al actualizar producto",
      succes: false,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "Delete FROM prodserv WHERE id = $1";
    const result = await db.query(query, [id]);
    if (result.rowCount === 0) {
      return res.status(400).json({
        message: "No se pudo eliminar el producto",
        succes: false,
      });
    }
    return res.status(201).json({
      message: "Producto eliminado con exito",
      succes: true,
    });
  } catch (error) {
    console.error("Error al eliminar producto", error);
    res.status(500).json({
      message: "Error al eliminar producto",
      succes: false,
    });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
