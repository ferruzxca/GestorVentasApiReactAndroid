const VALID_STATUS = ['activo', 'inactivo'];
const VALID_ROLES = ['Administrador', 'Vendedor'];

export function validateProductPayload(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    return ['El body debe ser un objeto JSON'];
  }

  if (!payload.nombre || typeof payload.nombre !== 'string') {
    errors.push('nombre es requerido y debe ser texto');
  }

  if (!payload.marca || typeof payload.marca !== 'string') {
    errors.push('marca es requerida y debe ser texto');
  }

  if (!payload.descripcion || typeof payload.descripcion !== 'string') {
    errors.push('descripcion es requerida y debe ser texto');
  }

  if (!Number.isInteger(payload.cantidad_stock) || payload.cantidad_stock < 0) {
    errors.push('cantidad_stock debe ser entero >= 0');
  }

  if (typeof payload.precio !== 'number' || Number.isNaN(payload.precio) || payload.precio < 0) {
    errors.push('precio debe ser numero >= 0');
  }

  if (!VALID_STATUS.includes(payload.status)) {
    errors.push('status debe ser activo o inactivo');
  }

  return errors;
}

export function validateStockPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return ['El body debe ser un objeto JSON'];
  }

  if (!Number.isInteger(payload.cantidad_stock) || payload.cantidad_stock < 0) {
    return ['cantidad_stock debe ser entero >= 0'];
  }

  return [];
}

export function validateUserPayload(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    return ['El body debe ser un objeto JSON'];
  }

  if (!payload.nombre || typeof payload.nombre !== 'string') {
    errors.push('nombre es requerido y debe ser texto');
  }

  if (!VALID_ROLES.includes(payload.rol)) {
    errors.push('rol debe ser Administrador o Vendedor');
  }

  if (!VALID_STATUS.includes(payload.status)) {
    errors.push('status debe ser activo o inactivo');
  }

  return errors;
}
