import { loadTempVoiceConfig } from '../bot/configLoader'

// GET /api/apps/voice-rooms/config
// Returns normalized app config values. Accessible to moderators and above.

export default defineEventHandler(async (event) => {
  const normalized = loadTempVoiceConfig(event.context.guildora.config as Record<string, unknown>)

  return {
    enabled: normalized.enabled,
    lobbyChannelId: normalized.lobbyChannelId,
    temporaryVoiceCategoryId: normalized.temporaryVoiceCategoryId,
    defaultChannelIcon: normalized.defaultChannelIcon,
    defaultChannelName: normalized.defaultChannelName,
    maxManagedChannels: normalized.maxManagedChannels,
    renameEnabled: normalized.renameEnabled
  }
})
