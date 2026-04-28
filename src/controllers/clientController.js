// clientController.js
const db = require('../database/db')
const { validateId, validateName, validatePhone, validateEmail } = require('../utils/validators')

const getClients = async (req, res) => {
  try {
    const query = 'SELECT * FROM clientes order by id'
    const result = await db.query(query)
    const clients = result.rows || []
    res.status(200).json({
      clients
    })
  } catch (error) {
    console.error('Error al obtener clientes', error)
    res.status(500).json({ message: 'Error al obtener clientes' })
  }
}

const createClient = async (req, res) => {
  try {
    const { id, nombre, telefono, email } = req.body

    // Validar campos requeridos
    if (!id || !nombre || !telefono) {
      return res.status(400).json({
        message: 'Los campos id, nombre y telefono son obligatorios',
        success: false
      })
    }

    // Validar formato de datos
    validateId(id)
    validateName(nombre)
    validatePhone(telefono)
    if (email && !validateEmail(email)) {
      return res.status(400).json({
        message: 'El email no tiene un formato válido',
        success: false
      })
    }

    // Verificar si el cliente ya existe en la base de datos
    const query = 'SELECT * FROM clientes WHERE id = $1'
    const values = [id]
    const result = await db.query(query, values)

    if (result.rows.length > 0) {
      return res.status(400).json({
        message: 'El cliente ya existe',
        success: false
      })
    }

    // Ingresar cliente a la base de datos
    const insertQuery =
      'INSERT INTO clientes (id, nombre, telefono, email) VALUES ($1, $2, $3, $4)'
    const insertValues = [id, nombre, telefono, email || null]
    await db.query(insertQuery, insertValues)
    res.status(201).json({
      success: true,
      message: 'Cliente registrado con exito'
    })
  } catch (error) {
    console.error('Error al crear cliente', error)
    // Manejo específico de errores de base de datos
    if (error.code === '23505') { // Unique constraint violation
      return res.status(400).json({
        message: 'El cliente ya existe en la base de datos',
        success: false
      })
    }
    res.status(500).json({
      message: error.message || 'Error al crear cliente',
      success: false
    })
  }
}

const updateClient = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, telefono, email } = req.body

    // Validar que al menos un campo a actualizar sea proporcionado
    if (!nombre && !telefono && !email) {
      return res.status(400).json({
        message: 'Debe proporcionar al menos un campo para actualizar',
        success: false
      })
    }

    // Validar formatos si se proporcionan
    if (nombre) validateName(nombre)
    if (telefono) validatePhone(telefono)
    if (email && !validateEmail(email)) {
      return res.status(400).json({
        message: 'El email no tiene un formato válido',
        success: false
      })
    }

    const query =
      'UPDATE clientes SET nombre = $2, telefono = $3, email = $4 WHERE id = $1'
    const values = [id, nombre, telefono, email || null]

    const result = await db.query(query, values)

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Cliente no encontrado',
        success: false
      })
    }

    return res.status(200).json({
      message: 'Datos del cliente actualizados',
      success: true
    })
  } catch (error) {
    console.error('Error al actualizar info del cliente', error)
    res.status(500).json({
      message: error.message || 'Error al actualizar info del cliente',
      success: false
    })
  }
}

const deleteClient = async (req, res) => {
  try {
    const { id } = req.params

    // Verificar si el cliente tiene vehículos asociados
    const vehiculosQuery = 'SELECT COUNT(*) FROM vehiculos WHERE cliente_id = $1'
    const vehiculosResult = await db.query(vehiculosQuery, [id])

    if (vehiculosResult.rows[0].count > 0) {
      return res.status(400).json({
        message: 'No se puede eliminar el cliente. Tiene vehículos registrados',
        success: false
      })
    }

    // Verificar si el cliente tiene órdenes asociadas
    const ordenesQuery = 'SELECT COUNT(*) FROM ordenes WHERE cliente_id = $1'
    const ordenesResult = await db.query(ordenesQuery, [id])

    if (ordenesResult.rows[0].count > 0) {
      return res.status(400).json({
        message: 'No se puede eliminar el cliente. Tiene órdenes registradas',
        success: false
      })
    }

    const query = 'DELETE FROM clientes WHERE id = $1'
    const result = await db.query(query, [id])

    if (result.rowCount === 0) {
      return res.status(400).json({
        message: 'No se ha eliminado cliente',
        success: false
      })
    }

    return res.status(201).json({
      message: 'Cliente eliminado con exito',
      success: true
    })
  } catch (error) {
    console.error('Error al eliminar cliente', error)
    res.status(500).json({
      message: error.message || 'Error al eliminar cliente',
      success: false
    })
  }
}

module.exports = {
  getClients,
  createClient,
  updateClient,
  deleteClient
}
