// JWT Decoder utility to extract payload without verification
// (Verification happens on backend; this is just for reading claims)

export const decodeJwt = (token) => {
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

/**
 * Normalize role by stripping "ROLE_" prefix if present
 * @param {string} role - Role string (e.g., "ADMIN" or "ROLE_ADMIN")
 * @returns {string} - Normalized role (e.g., "ADMIN")
 */
export const normalizeRole = (role) => {
  if (!role) return null;
  if (typeof role !== 'string') return null;
  return role.startsWith('ROLE_') ? role.substring(5) : role;
};

/**
 * Extract role from JWT token
 * Supports multiple claim names: role, roles, authorities
 * Normalizes ROLE_ prefix
 */
export const getRoleFromToken = (token) => {
  const decoded = decodeJwt(token);
  if (!decoded) return null;

  // Try different claim names
  let roleValue = decoded.role || decoded.roles || decoded.authorities;

  // If it's an array, take the first role
  if (Array.isArray(roleValue)) {
    roleValue = roleValue[0];
  }

  // Normalize the role (strip ROLE_ prefix if present)
  return normalizeRole(roleValue);
};

export const getUserIdFromToken = (token) => {
  const decoded = decodeJwt(token);
  return decoded?.sub ? parseInt(decoded.sub) : null;
};

export const isTokenExpired = (token) => {
  const decoded = decodeJwt(token);
  if (!decoded?.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
};

