// GET /api/apps/voice-rooms/settings
// Returns aggregate app statistics. Restricted to admins.

export default defineEventHandler(async (event) => {
  const { db } = event.context.guildora

  const index = await db.get('tempvc:managed-index')
  const managedChannels = Array.isArray(index) ? index.length : 0

  return {
    version: '1.0.0',
    managedChannels
  }
})
