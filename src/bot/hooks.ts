// Bot hook handlers for Template.
// All hooks declared in manifest.botHooks must be exported here.

import type {
  BotContext,
  VoiceActivityPayload,
  RoleChangePayload,
  MemberJoinPayload,
  InteractionPayload
} from '@guildora/app-sdk'

/**
 * onVoiceActivity — fires when a member joins, leaves, or moves in voice.
 * Tracks member activity in the KV store.
 */
export async function onVoiceActivity(payload: VoiceActivityPayload, ctx: BotContext) {
  if (payload.action === 'join') {
    // Record that this member has been active
    await ctx.db.set(`member:${payload.memberId}`, {
      lastSeen: new Date().toISOString(),
      lastChannel: payload.channelId
    })
  }
}

/**
 * onRoleChange — fires when a member's roles are updated.
 * Logs the role change to the KV store for audit purposes.
 */
export async function onRoleChange(payload: RoleChangePayload, ctx: BotContext) {
  if (payload.addedRoles.length > 0 || payload.removedRoles.length > 0) {
    await ctx.db.set(`rolechange:${payload.memberId}:${Date.now()}`, {
      added: payload.addedRoles,
      removed: payload.removedRoles,
      at: new Date().toISOString()
    })
  }
}

/**
 * onMemberJoin — fires when a new member joins the Discord server.
 * Sends a configurable welcome message if enabled.
 */
export async function onMemberJoin(payload: MemberJoinPayload, ctx: BotContext) {
  const welcomeEnabled = (ctx.config.welcomeEnabled as boolean) ?? true
  if (!welcomeEnabled) return

  const announcementChannelId = ctx.config.announcementChannelId as string | undefined
  if (!announcementChannelId) return

  const template = (ctx.config.welcomeMessage as string) ?? 'Welcome to the server, {username}!'
  const message = template.replace('{username}', `<@${payload.memberId}>`)

  await ctx.bot.sendMessage(announcementChannelId, message)

  // Track the new member
  await ctx.db.set(`member:${payload.memberId}`, {
    joinedAt: payload.joinedAt,
    lastSeen: payload.joinedAt
  })
}

/**
 * onInteraction — fires when a slash command is used.
 * Handles the /template command.
 */
export async function onInteraction(payload: InteractionPayload, ctx: BotContext) {
  if (payload.commandName !== 'template') return

  // Log the interaction
  await ctx.db.set(`audit:${payload.memberId}:${Date.now()}`, {
    command: 'template',
    at: payload.occurredAt
  })
}
