const {
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
} = require('../src/utils/validators')

describe('validators', () => {
  test('validateEmail returns true for valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true)
  })

  test('validatePhone accepts numeric phone strings', () => {
    expect(validatePhone('1234567')).toBe(true)
  })

  test('validateId rejects empty string', () => {
    expect(() => validateId('')).toThrow('El ID no puede estar vacío')
  })

  test('validateName rejects short names', () => {
    expect(() => validateName('Ab')).toThrow('El nombre debe tener mínimo 3 caracteres')
  })

  test('validatePassword rejects short passwords', () => {
    expect(() => validatePassword('abc123')).toThrow('La contraseña debe tener mínimo 8 caracteres')
  })

  test('validatePrice accepts valid number strings', () => {
    expect(validatePrice('10.50')).toBe(true)
  })

  test('validateQuantity rejects invalid quantity', () => {
    expect(() => validateQuantity('0')).toThrow('La cantidad debe ser mayor a 0')
  })

  test('validatePlate rejects long plate values', () => {
    expect(() => validatePlate('ABCDEFGHIJK')).toThrow('La placa no puede exceder 10 caracteres')
  })

  test('validateYear accepts current year', () => {
    const currentYear = new Date().getFullYear()
    expect(validateYear(String(currentYear))).toBe(true)
  })

  test('validateMileage rejects negative mileage', () => {
    expect(() => validateMileage('-10')).toThrow('El kilometraje no puede ser negativo')
  })
})
