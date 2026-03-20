// GET /api/apps/guildora-app-template/overview
// Returns a community overview for the App page.
// Access: requiredRoles: ["user"] (enforced by host before this runs)

export default defineEventHandler(async (event) => {
  const { db } = event.context.guildora

  // Count tracked members (any key under the `member:` prefix)
  const members = await db.list('member:')

  return {
    membersTracked: members.length,
    appActive: true
  }
})
