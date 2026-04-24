import type {
  BotContext,
  InteractionPayload,
  MemberJoinPayload,
  RoleChangePayload,
  VoiceActivityPayload
} from '@guildora/app-sdk'
import { handleTemporaryVoiceLifecycle } from './events'
import { handleTemporaryVoiceInteractions } from './interactions'

export async function onVoiceActivity(payload: VoiceActivityPayload, ctx: BotContext): Promise<void> {
  try {
    await handleTemporaryVoiceLifecycle(payload, ctx)
  } catch (err) {
    console.error('[voice-rooms] onVoiceActivity error:', err)
  }
}

export async function onInteraction(payload: InteractionPayload, ctx: BotContext): Promise<void> {
  try {
    await handleTemporaryVoiceInteractions(payload, ctx)
  } catch (err) {
    console.error('[voice-rooms] onInteraction error:', err)
  }
}

export async function onRoleChange(_payload: RoleChangePayload, _ctx: BotContext): Promise<void> {
  // Intentionally empty: this app does not use role-change hooks.
}

export async function onMemberJoin(_payload: MemberJoinPayload, _ctx: BotContext): Promise<void> {
  // Intentionally empty: this app does not use member-join hooks.
}
