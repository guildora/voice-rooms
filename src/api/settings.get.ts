// GET /api/apps/guildora-app-template/settings
// Returns aggregate app statistics. Restricted to admins.
// Access: requiredRoles: ["admin"] (enforced by host before this runs)

export default defineEventHandler(async (event) => {
  const { userRoles, db } = event.context.guildora

  if (!['admin', 'superadmin'].some(r => userRoles.includes(r))) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const members = await db.list('member:')

  return {
    version: '1.0.0',
    totalMembers: members.length
  }
})
