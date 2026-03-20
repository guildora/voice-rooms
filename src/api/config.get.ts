// GET /api/apps/guildora-app-template/config
// Returns the current app config values. Restricted to admins.
// Access: requiredRoles: ["admin"] (enforced by host before this runs)

export default defineEventHandler(async (event) => {
  const { config } = event.context.guildora

  return {
    welcomeEnabled: config.welcomeEnabled ?? true,
    welcomeMessage: config.welcomeMessage ?? 'Welcome to the server, {username}!',
    announcementChannelId: config.announcementChannelId ?? null
  }
})
