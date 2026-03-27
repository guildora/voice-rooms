// GET /api/apps/voice-rooms/settings
// Returns aggregate app statistics. Restricted to admins.

export default defineEventHandler(async (event) => {
  const { db } = event.context.guildora

  const managedChannels = await db.get('tempvc:managed-count')

  const trackedTotals = await db.list('tempvc:activity:total:')
  const totalTrackedSeconds = trackedTotals.reduce((sum, entry) => {
    const value = typeof entry.value === 'number' ? entry.value : 0
    return sum + value
  }, 0)

  return {
    version: '1.0.0',
    totalMembers: trackedTotals.length,
    managedChannels: typeof managedChannels === 'number' ? managedChannels : 0,
    trackedMembers: trackedTotals.length,
    totalTrackedSeconds
  }
})
