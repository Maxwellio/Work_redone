/** Совпадает с authority Spring Security для роли «Администратор» (см. UserDetailsServiceImpl). */
export const ROLE_ADMIN = 'ROLE_ADMIN'

/**
 * @param {{ roles?: string[] } | null | undefined} user — объект из GET /api/current-user
 * @returns {boolean}
 */
export function userHasAdminRole(user) {
  const roles = user?.roles
  return Array.isArray(roles) && roles.includes(ROLE_ADMIN)
}
