// errorHandler.js
// Middleware centralizador de manejo de errores

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Error de validación',
      details: err.message,
      success: false
    })
  }

  // Error de base de datos - Unique constraint
  if (err.code === '23505') {
    return res.status(400).json({
      message: 'El registro ya existe',
      success: false
    })
  }

  // Error de base de datos - Foreign key constraint
  if (err.code === '23503') {
    return res.status(400).json({
      message: 'No se puede completar la operación. Referencia inválida',
      success: false
    })
  }

  // Error de base de datos - Not null constraint
  if (err.code === '23502') {
    return res.status(400).json({
      message: 'Todos los campos requeridos deben ser completados',
      success: false
    })
  }

  // Error genérico de base de datos
  if (err.code && err.code.startsWith('23')) {
    return res.status(400).json({
      message: 'Error en la operación de base de datos',
      success: false
    })
  }

  // Error genérico
  return res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
    success: false
  })
}

module.exports = errorHandler
