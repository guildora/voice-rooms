/**
 * Ambient type stubs for CI syntax checking.
 *
 * These declarations satisfy tsc --noEmit for Nitro/Vue globals and the
 * Guildora app-sdk that are injected at runtime by the host process.
 * They are intentionally minimal — only the surface used by this app.
 *
 * Placed under src/ so tsconfig.ci.json picks it up automatically.
 */
declare const defineEventHandler: (handler: (...args: any[]) => any) => any
declare const createError: (opts: { statusCode?: number; message?: string }) => never
declare const readBody: (event: any) => Promise<any>
declare const useFetch: (url: string) => Promise<any>
declare const useI18n: () => { t: (key: string, params?: Record<string, string>) => string; locale: string }
declare const useAuth: () => { user: any; hasRole: (role: string) => boolean; guildId: string }
declare const useAppConfig: () => Record<string, any>
declare const ref: <T>(value: T) => { value: T }
declare const computed: <T>(fn: () => T) => { value: T }
declare const onMounted: (fn: () => void) => void
declare const watch: (source: any, cb: (val: any, oldVal: any) => void) => void
declare const nextTick: (fn?: () => void) => Promise<void>

declare module '@guildora/app-sdk' {
  export interface VoiceActivityPayload {
    memberId: string
    action: 'join' | 'leave' | 'move'
    channelId: string
    previousChannelId?: string
    durationSeconds?: number
    guildId: string
  }
  export interface RoleChangePayload {
    memberId: string
    addedRoles: string[]
    removedRoles: string[]
    allRoles: string[]
  }
  export interface MemberJoinPayload {
    memberId: string
    joinedAt: string
  }
  export interface InteractionPayload {
    memberId: string
    commandName: string
    occurredAt: string
  }
  export interface BotContext {
    guildId: string
    config: Record<string, any>
    db: any
    bot: any
  }
}
