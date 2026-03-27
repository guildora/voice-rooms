import type { BotContext, VoiceActivityPayload } from '@guildora/app-sdk'
import { loadTempVoiceConfig } from './configLoader'
import { cleanupIfManagedAndEmpty, ensureChannelForLobbyJoin } from './voiceChannelManager'

const TRACKING_SESSION_PREFIX = 'tempvc:activity:session:'
const TRACKING_TOTAL_PREFIX = 'tempvc:activity:total:'

function activitySessionKey(memberId: string): string {
  return `${TRACKING_SESSION_PREFIX}${memberId}`
}

function activityTotalKey(memberId: string): string {
  return `${TRACKING_TOTAL_PREFIX}${memberId}`
}

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

async function getTrackedTotal(ctx: BotContext, memberId: string): Promise<number> {
  const current = await ctx.db.get(activityTotalKey(memberId))
  return typeof current === 'number' ? current : 0
}

async function addTrackedSeconds(ctx: BotContext, memberId: string, seconds: number): Promise<void> {
  if (seconds <= 0) return

  const total = await getTrackedTotal(ctx, memberId)
  await ctx.db.set(activityTotalKey(memberId), total + seconds)
}

export async function handleVoiceActivityTracker(payload: VoiceActivityPayload, ctx: BotContext): Promise<void> {
  const config = loadTempVoiceConfig(ctx.config as Record<string, unknown>)
  if (!config.activityTrackingEnabled) return

  const nowIso = new Date().toISOString()

  if (payload.action === 'join') {
    await ctx.db.set(activitySessionKey(payload.memberId), {
      channelId: payload.channelId,
      joinedAt: nowIso
    })
    return
  }

  if (payload.action === 'leave') {
    const fallbackDuration = typeof payload.durationSeconds === 'number' ? Math.max(0, payload.durationSeconds) : 0
    await addTrackedSeconds(ctx, payload.memberId, fallbackDuration)
    await ctx.db.delete(activitySessionKey(payload.memberId))
    return
  }

  if (payload.action === 'move') {
    const fallbackDuration = typeof payload.durationSeconds === 'number' ? Math.max(0, payload.durationSeconds) : 0
    await addTrackedSeconds(ctx, payload.memberId, fallbackDuration)

    await ctx.db.set(activitySessionKey(payload.memberId), {
      channelId: payload.channelId,
      joinedAt: nowIso
    })
  }
}
