# Guildora App Template

A ready-to-use template for building Guildora apps. Demonstrates all integration points: Hub pages, API routes, bot hooks, config fields, and i18n.

This template demonstrates the **welcome/announcement pattern** with role-gated pages (App, Moderation, Admin), full EN + DE i18n, and a `/template` bot command. Replace the example logic with your own implementation.

## Quick Start

### 1. Use this template

```bash
# Clone or copy this repository
git clone https://github.com/your-username/guildora-app-template.git template
cd template

# Remove the template's git history and start fresh
rm -rf .git
git init
git add .
git commit -m "Initial commit"
```

### 2. Customize the manifest

Edit `manifest.json`:
- Change `id` to your app's unique identifier (e.g. `my-awesome-app`)
- Update `name`, `description`, `author`, `repositoryUrl`
- Adjust navigation, permissions, pages, and hooks as needed

### 3. Implement your logic

- `src/pages/` — Vue components for Hub pages
- `src/api/` — Nitro API handlers
- `src/bot/hooks.ts` — Bot event handlers
- `src/i18n/` — Translation strings

### 4. Sideload for testing

1. Open your Guildora instance as Admin
2. Go to **Admin → Apps → Sideload**
3. Paste your GitHub repository URL
4. Click **Load** and then **Activate**

### 5. Publish to Marketplace

See [docs/07-deployment.md](docs/07-deployment.md) for publishing steps.

---

## Navigation Patterns

### Role-gated pages with user-without-submenu

This template demonstrates a common pattern where plain users see a rail item but no panel submenu, while moderators and admins see panel items.

**Rail item** — `requiredRoles: ["user"]`, `to: "/apps/guildora-app-template"`:
- All members see it in the sidebar rail
- Clicking it navigates directly to the App page (no panel expands)

**Panel items** — all start at `requiredRoles: ["moderator"]`:
- Plain users get **no panel** at all, so clicking the rail item is a direct navigation
- Moderators → panel shows **App** + **Moderation**
- Admins → panel shows **App** + **Moderation** + **Admin**

```
Role      | Rail visible | Panel shown  | Pages accessible
----------|--------------|--------------|------------------
user      | ✓            | ✗ (none)     | App only
moderator | ✓            | ✓ (2 items)  | App + Moderation
admin     | ✓            | ✓ (3 items)  | App + Moderation + Admin
```

---

## Documentation

| File | Description |
|------|-------------|
| [docs/01-overview.md](docs/01-overview.md) | What Guildora apps are and how they work |
| [docs/02-manifest.md](docs/02-manifest.md) | Complete manifest field reference |
| [docs/03-hub-integration.md](docs/03-hub-integration.md) | Pages, API routes, navigation |
| [docs/04-bot-integration.md](docs/04-bot-integration.md) | Bot hook implementation |
| [docs/05-config-fields.md](docs/05-config-fields.md) | Config fields usage |
| [docs/06-i18n.md](docs/06-i18n.md) | Internationalization (DE + EN) |
| [docs/07-deployment.md](docs/07-deployment.md) | Marketplace publishing |

For AI-assisted development, see [AGENTS.md](AGENTS.md).

---

## File Structure

```
guildora-app-template/
├── manifest.json          ← App definition (sideloadable)
├── README.md
├── AGENTS.md              ← AI agent guidance
├── docs/                  ← Full documentation
└── src/
    ├── pages/
    │   ├── index.vue      ← App page (user+)
    │   ├── mod.vue        ← Moderation page (moderator+)
    │   └── admin.vue      ← Admin page (admin+)
    ├── api/
    │   ├── overview.get.ts   ← GET community overview (user+)
    │   ├── announce.post.ts  ← POST announcement (moderator+)
    │   ├── config.get.ts     ← GET app config (admin+)
    │   └── settings.get.ts   ← GET app statistics (admin+)
    ├── bot/
    │   └── hooks.ts       ← Bot event handlers
    └── i18n/
        ├── en.json
        └── de.json
```

## License

MIT
