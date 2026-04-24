/**
 * Bot-facing message strings for the voice-rooms app.
 *
 * Bot hooks run outside the Hub context and do not have access to useI18n,
 * so all strings are hardcoded here, matching the en.json values under
 * bot.renameMenu.*.
 *
 * This is a pure data module — no imports.
 */

export const botMessages = {
  /** Select menu placeholder text. */
  placeholder: 'Select an icon',

  /** Select menu prompt — shows the current icon and base name. */
  prompt: (token: string, name: string): string =>
    `Select a new icon for your channel (${token} ${name}).`,

  /** The selected icon is already in use by another managed channel. */
  iconOccupied: 'This icon is already used by another managed voice channel.',

  /** The user's current voice channel is not managed by this app. */
  channelNotManaged: 'Your current channel is not managed by this app.',

  /** Channel rename feature is disabled in settings. */
  renameDisabled: 'Channel rename is currently disabled.',

  /** The user selected an invalid or unrecognised icon token. */
  invalidIcon: 'Please select a valid icon.',

  /** The rename operation itself failed (e.g. Discord API error). */
  renameFailed: 'Could not rename the channel.',

  /** Generic fallback when the rename fails for an unknown reason. */
  fallback: 'Rename failed.',

  /** The user is not connected to any voice channel. */
  notInVoice: 'You are not connected to a voice channel.',

  /** The user's channel exists but is not one we manage. */
  notManaged: 'Your current voice channel is not managed by this app.',

  /** All available icon tokens are already taken by other channels. */
  noFreeIcons: 'No free icons are available right now.'
}
