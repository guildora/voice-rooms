const ORDERED_BASE_TOKENS = [
  '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎'
]

const HEART_FALLBACK = '❤️'

function isTokenAvailable(token: string, usedTokens: Set<string>, pendingTokens: Set<string>): boolean {
  return !usedTokens.has(token) && !pendingTokens.has(token)
}

export function getOrderedBaseTokens(): string[] {
  return [...ORDERED_BASE_TOKENS]
}

export function buildTemporaryChannelName(
  token: string,
  channelName: string,
  countingStyle: 'numeric' | 'emoji' = 'numeric',
  defaultIcon?: string
): string {
  if (countingStyle === 'numeric') {
    const icon = defaultIcon || '🔵'
    return `${icon} ${channelName} ${token}`
  }
  return `${token} ${channelName}`
}

export function getNextAvailableToken(
  usedTokens: Set<string>,
  pendingTokens: Set<string>,
  countingStyle: 'numeric' | 'emoji' = 'numeric',
  preferredToken?: string
): string {
  if (countingStyle === 'numeric') {
    let num = 1
    while (num <= 500) {
      const token = String(num)
      if (isTokenAvailable(token, usedTokens, pendingTokens)) {
        return token
      }
      num++
    }
    return String(Date.now())
  }

  // Emoji style
  const preferred = typeof preferredToken === 'string' ? preferredToken.trim() : ''
  if (preferred && isTokenAvailable(preferred, usedTokens, pendingTokens)) {
    return preferred
  }

  for (const token of ORDERED_BASE_TOKENS) {
    if (isTokenAvailable(token, usedTokens, pendingTokens)) {
      return token
    }
  }

  let multiplier = 2
  while (multiplier < 256) {
    const token = HEART_FALLBACK.repeat(multiplier)
    if (isTokenAvailable(token, usedTokens, pendingTokens)) {
      return token
    }
    multiplier += 1
  }

  return `${HEART_FALLBACK}${Date.now()}`
}

export function isValidManagedVoiceName(
  name: string,
  channelName = 'Voice Room',
  countingStyle: 'numeric' | 'emoji' = 'numeric',
  defaultIcon?: string
): boolean {
  return extractToken(name, channelName, countingStyle, defaultIcon) !== null
}

export function extractToken(
  name: string,
  channelName = 'Voice Room',
  countingStyle: 'numeric' | 'emoji' = 'numeric',
  defaultIcon?: string
): string | null {
  const normalized = typeof name === 'string' ? name.trim() : ''
  if (!normalized) return null

  if (countingStyle === 'numeric') {
    const icon = defaultIcon || '🔵'
    const prefix = `${icon} ${channelName} `
    if (!normalized.startsWith(prefix)) return null
    const token = normalized.slice(prefix.length).trim()
    return /^\d+$/.test(token) ? token : null
  }

  // Emoji style
  const suffix = ` ${channelName}`
  if (!normalized.endsWith(suffix)) return null
  const token = normalized.slice(0, normalized.length - suffix.length).trim()
  return token.length > 0 ? token : null
}
