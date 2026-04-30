const buildPagination = ({ page = 1, limit = 50 } = {}) => {
  const parsedPage = Number.isInteger(Number(page)) && Number(page) > 0 ? Number(page) : 1
  const parsedLimit = Number.isInteger(Number(limit)) && Number(limit) > 0 ? Number(limit) : 50
  const offset = (parsedPage - 1) * parsedLimit
  return {
    clause: ' LIMIT $LIMIT OFFSET $OFFSET',
    values: [parsedLimit, offset]
  }
}

const addCondition = (conditions, values, condition, value) => {
  if (value !== undefined && value !== null && value !== '') {
    values.push(value)
    conditions.push(condition(values.length))
  }
}

const toSafeNumber = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

module.exports = {
  buildPagination,
  addCondition,
  toSafeNumber
}
