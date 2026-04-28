const fs = require('fs')
const path = require('path')
const winston = require('winston')

const logDir = path.join(__dirname, '..', 'logs')
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

const { combine, timestamp, printf, colorize } = winston.format

const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ''
  return `${timestamp} [${level}] ${message}${extra}`
})

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), logFormat),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(colorize(), timestamp(), logFormat),
    level: process.env.LOG_LEVEL || 'debug'
  }))
}

module.exports = logger
