import type { BotContext, VoiceActivityPayload } from '@guildora/app-sdk'
import { loadTempVoiceConfig } from './configLoader'
import { cleanupIfManagedAndEmpty, ensureChannelForLobbyJoin } from './voiceChannelManager'

export async function handleTemporaryVoiceLifecycle(payload: VoiceActivityPayload, ctx: BotContext): Promise<void> {
  const config = loadTempVoiceConfig(ctx.config as Record<string, unknown>)

  if (!config.enabled) return
  if (!config.lobbyChannelId || !config.temporaryVoiceCategoryId) return

  if (payload.action === 'join' && payload.channelId === config.lobbyChannelId) {
    await ensureChannelForLobbyJoin(payload.memberId, payload.guildId, ctx)
    return
  }

  if (payload.action === 'move') {
    if (payload.previousChannelId) {
      await cleanupIfManagedAndEmpty(payload.previousChannelId, payload.guildId, ctx)
    }

    if (payload.channelId === config.lobbyChannelId) {
      await ensureChannelForLobbyJoin(payload.memberId, payload.guildId, ctx)
    }

    return
  }

  if (payload.action === 'leave') {
    const leftChannelId = payload.previousChannelId ?? payload.channelId
    if (leftChannelId) {
      await cleanupIfManagedAndEmpty(leftChannelId, payload.guildId, ctx)
    }
  }
}
