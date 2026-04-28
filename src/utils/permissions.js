// permissions.js
const ROLE_PERMISSIONS = {
  admin: [
    'manage_users',
    'view_users',
    'manage_clients',
    'view_clients',
    'manage_products',
    'view_products',
    'manage_orders',
    'view_orders',
    'manage_vehicles',
    'view_vehicles'
  ],
  ventas: [
    'view_users',
    'manage_clients',
    'view_clients',
    'manage_products',
    'view_products',
    'manage_orders',
    'view_orders',
    'manage_vehicles',
    'view_vehicles'
  ],
  mecanico: [
    'view_clients',
    'view_products',
    'view_orders',
    'view_vehicles'
  ]
}

const getPermissionsForRole = (role) => ROLE_PERMISSIONS[role] || []

module.exports = {
  ROLE_PERMISSIONS,
  getPermissionsForRole
}
