// validators.js
// Funciones de validación centralizadas para reutilizar en controladores

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{7,15}$/
  return phoneRegex.test(phone)
}

const validateId = (id) => {
  if (typeof id !== 'string') throw new Error('El ID debe ser una cadena de texto')
  if (id.length === 0) throw new Error('El ID no puede estar vacío')
  if (id.length > 12) throw new Error('El ID no puede exceder 12 caracteres')
  return true
}

const validateName = (name) => {
  if (typeof name !== 'string') throw new Error('El nombre debe ser una cadena de texto')
  if (name.trim().length === 0) throw new Error('El nombre no puede estar vacío')
  if (name.length < 3) throw new Error('El nombre debe tener mínimo 3 caracteres')
  if (name.length > 100) throw new Error('El nombre no puede exceder 100 caracteres')
  return true
}

const validatePassword = (password) => {
  if (typeof password !== 'string') throw new Error('La contraseña debe ser una cadena de texto')
  if (password.length < 8) throw new Error('La contraseña debe tener mínimo 8 caracteres')
  if (password.length > 50) throw new Error('La contraseña no puede exceder 50 caracteres')
  return true
}

const validatePrice = (price) => {
  const priceNum = parseFloat(price)
  if (isNaN(priceNum)) throw new Error('El precio debe ser un número válido')
  if (priceNum < 0) throw new Error('El precio no puede ser negativo')
  return true
}

const validateQuantity = (quantity) => {
  const quantityNum = parseInt(quantity)
  if (isNaN(quantityNum)) throw new Error('La cantidad debe ser un número válido')
  if (quantityNum <= 0) throw new Error('La cantidad debe ser mayor a 0')
  return true
}

const validatePlate = (plate) => {
  if (typeof plate !== 'string') throw new Error('La placa debe ser una cadena de texto')
  if (plate.trim().length === 0) throw new Error('La placa no puede estar vacía')
  if (plate.length > 10) throw new Error('La placa no puede exceder 10 caracteres')
  return true
}

const validateYear = (year) => {
  const yearNum = parseInt(year)
  const currentYear = new Date().getFullYear()
  if (isNaN(yearNum)) throw new Error('El año debe ser un número válido')
  if (yearNum < 1950 || yearNum > currentYear + 1) throw new Error(`El año debe estar entre 1950 y ${currentYear + 1}`)
  return true
}

const validateMileage = (mileage) => {
  const mileageNum = parseInt(mileage)
  if (isNaN(mileageNum)) throw new Error('El kilometraje debe ser un número válido')
  if (mileageNum < 0) throw new Error('El kilometraje no puede ser negativo')
  return true
}

module.exports = {
  validateEmail,
  validatePhone,
  validateId,
  validateName,
  validatePassword,
  validatePrice,
  validateQuantity,
  validatePlate,
  validateYear,
  validateMileage
}
