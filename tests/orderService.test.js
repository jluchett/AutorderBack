jest.mock('../src/database/db', () => ({
  query: jest.fn()
}))

const db = require('../src/database/db')
const orderService = require('../src/services/orderService')

describe('orderService', () => {
  beforeEach(() => {
    db.query.mockReset()
  })

  test('getOrderStats returns aggregated metrics', async () => {
    db.query.mockResolvedValueOnce({
      rows: [
        {
          total_orders: '2',
          total_revenue: '200',
          average_order_value: '100',
          max_order_value: '150',
          min_order_value: '50'
        }
      ]
    })

    const stats = await orderService.getOrderStats({ startDate: '2026-01-01', endDate: '2026-01-31' })

    expect(stats.total_orders).toBe('2')
    expect(stats.total_revenue).toBe('200')
    expect(db.query).toHaveBeenCalledTimes(1)
  })

  test('getTopProductsReport returns product rankings', async () => {
    db.query.mockResolvedValueOnce({
      rows: [
        {
          producto_id: 'p1',
          producto_nombre: 'Aceite',
          total_quantity: '5',
          total_revenue: '250'
        }
      ]
    })

    const report = await orderService.getTopProductsReport({ limit: 5 })

    expect(report).toHaveLength(1)
    expect(report[0].producto_nombre).toBe('Aceite')
    expect(db.query).toHaveBeenCalledTimes(1)
  })

  test('getTopClientsReport returns client rankings', async () => {
    db.query.mockResolvedValueOnce({
      rows: [
        {
          cliente_id: 'c1',
          cliente_nombre: 'Cliente Uno',
          order_count: '3',
          total_revenue: '450'
        }
      ]
    })

    const report = await orderService.getTopClientsReport({ limit: 3 })

    expect(report).toHaveLength(1)
    expect(report[0].cliente_nombre).toBe('Cliente Uno')
    expect(db.query).toHaveBeenCalledTimes(1)
  })
})
