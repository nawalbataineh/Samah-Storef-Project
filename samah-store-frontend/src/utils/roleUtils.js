/**
 * Normalize role to uppercase for consistent comparisons
 * @param {string|null|undefined} role - Raw role string
 * @returns {string|null} Normalized uppercase role or null
 */
export const normalizeRole = (role) => {
  if (!role || typeof role !== 'string') return null;
  return role.trim().toUpperCase();
};

/**
 * Valid roles in the system
 */
export const ROLES = {
  ADMIN: 'ADMIN',
  EMPLOYEE: 'EMPLOYEE',
  CUSTOMER: 'CUSTOMER',
};

/**
 * Check if role is valid
 * @param {string} role - Role to check
 * @returns {boolean}
 */
export const isValidRole = (role) => {
  const normalized = normalizeRole(role);
  return Object.values(ROLES).includes(normalized);
};

