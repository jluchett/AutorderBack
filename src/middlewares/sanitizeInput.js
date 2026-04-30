// sanitizeInput.js
const sanitizeValue = (value) => {
  if (typeof value !== 'string') return value

  return value
    .replace(/<script[^>]*?>.*?<\/script>/gi, '')
    .replace(/<.*?>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/[\$\{\}]/g, '')
    .trim()
}

const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) return obj
  if (typeof obj === 'string') return sanitizeValue(obj)
  if (Array.isArray(obj)) return obj.map(sanitizeObject)
  if (typeof obj === 'object') {
    return Object.keys(obj).reduce((cleanObj, key) => {
      cleanObj[key] = sanitizeObject(obj[key])
      return cleanObj
    }, {})
  }
  return obj
}

const sanitizeInput = () => (req, res, next) => {
  req.body = sanitizeObject(req.body)
  req.query = sanitizeObject(req.query)
  req.params = sanitizeObject(req.params)
  next()
}

module.exports = sanitizeInput
