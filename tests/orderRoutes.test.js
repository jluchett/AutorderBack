jest.mock('../src/database/db', () => ({
  query: jest.fn()
}))

jest.mock('../src/middlewares/authMiddleware', () => {
  return (req, res, next) => {
    req.session = { user: { id: 'test-user', role: 'admin' } }
    next()
  }
})

const request = require('supertest')
const app = require('../src/app')
const db = require('../src/database/db')

describe('Order routes integration', () => {
  beforeEach(() => {
    db.query.mockReset()
  })

  test('GET /api/orders/stats returns aggregated metrics', async () => {
    db.query.mockResolvedValueOnce({
      rows: [
        {
          total_orders: '1',
          total_revenue: '100',
          average_order_value: '100',
          max_order_value: '100',
          min_order_value: '100'
        }
      ]
    })

    const response = await request(app).get('/api/orders/stats')

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.stats.total_orders).toBe('1')
  })

  test('GET /api/orders/reports/top-products returns product report', async () => {
    db.query.mockResolvedValueOnce({
      rows: [
        {
          producto_id: 'p1',
          producto_nombre: 'Filtro',
          total_quantity: '4',
          total_revenue: '200'
        }
      ]
    })

    const response = await request(app).get('/api/orders/reports/top-products')

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.report[0].producto_nombre).toBe('Filtro')
  })
})
