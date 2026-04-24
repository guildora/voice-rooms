// GET /api/apps/voice-rooms/settings
// Returns aggregate app statistics. Restricted to admins.

export default defineEventHandler(async (event) => {
  const { db } = event.context.guildora

  const managedChannels = await db.get('tempvc:managed-count')

  return {
    version: '1.0.0',
    managedChannels: typeof managedChannels === 'number' ? managedChannels : 0
  }
})
