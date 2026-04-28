const db = require('../../database/db')
const logger = require('../../utils/logger')

const deleteUser = async (req, res) => {
  const { id } = req.params

  try {
    // Validar que el ID sea proporcionado
    if (!id || id.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario requerido'
      })
    }

    // Ejecutar DELETE
    const result = await db.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    )

    // Verificar si el usuario existía
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      })
    }

    res.status(200).json({
      success: true,
      message: `Usuario ${id} eliminado exitosamente`
    })
  } catch (error) {
    logger.error('Error al eliminar usuario', { error, userId: id })
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario'
    })
  }
}

module.exports = deleteUser
