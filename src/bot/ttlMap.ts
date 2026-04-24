/**
 * TTLMap — a generic Map wrapper with time-to-live eviction.
 *
 * Each entry carries a `lastAccess` timestamp that is bumped on every
 * `get` and `set`. A background sweep (started via `startSweep`) evicts
 * entries whose age exceeds `maxAgeMs`.
 *
 * The sweep timer uses `unref()` so it does NOT prevent Node.js process exit.
 */

interface TTLEntry<V> {
  value: V
  lastAccess: number
}

export class TTLMap<K, V> {
  private readonly store = new Map<K, TTLEntry<V>>()
  private sweepTimer: ReturnType<typeof setInterval> | null = null

  /** Number of entries currently in the map. */
  get size(): number {
    return this.store.size
  }

  /** Retrieve a value, bumping its lastAccess timestamp. Returns undefined if missing. */
  get(key: K): V | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined
    entry.lastAccess = Date.now()
    return entry.value
  }

  /** Store a value, setting lastAccess to now. */
  set(key: K, value: V): this {
    this.store.set(key, { value, lastAccess: Date.now() })
    return this
  }

  /** Remove an entry. Returns true if the entry existed. */
  delete(key: K): boolean {
    return this.store.delete(key)
  }

  /** Check whether an entry exists (does NOT bump lastAccess). */
  has(key: K): boolean {
    return this.store.has(key)
  }

  /**
   * Start a periodic sweep that evicts entries older than `maxAgeMs`.
   * @param intervalMs — how often to run the sweep (milliseconds)
   * @param maxAgeMs   — maximum age of an entry before eviction (milliseconds)
   */
  startSweep(intervalMs: number, maxAgeMs: number): void {
    this.stopSweep()
    this.sweepTimer = setInterval(() => {
      try {
        this.sweepOnce(maxAgeMs)
      } catch (err) {
        // Sweep must never throw unhandled — log and continue
        console.error('[voice-rooms] TTLMap sweep error:', err)
      }
    }, intervalMs)

    // Do not prevent Node.js process exit
    if (this.sweepTimer && typeof this.sweepTimer === 'object' && 'unref' in this.sweepTimer) {
      this.sweepTimer.unref()
    }
  }

  /** Stop the periodic sweep. */
  stopSweep(): void {
    if (this.sweepTimer !== null) {
      clearInterval(this.sweepTimer)
      this.sweepTimer = null
    }
  }

  /**
   * Run a single sweep pass — evict entries whose age exceeds `maxAgeMs`.
   * Returns the number of evicted entries.
   */
  sweepOnce(maxAgeMs: number): number {
    const now = Date.now()
    let evicted = 0

    for (const [key, entry] of this.store) {
      if (now - entry.lastAccess > maxAgeMs) {
        this.store.delete(key)
        evicted++
      }
    }

    if (evicted > 0) {
      console.debug(`[voice-rooms] TTLMap sweep: evicted ${evicted} stale entr${evicted === 1 ? 'y' : 'ies'}`)
    }

    return evicted
  }

  /**
   * Diagnostic snapshot — entry count and age of the oldest entry.
   * Useful for observability and debugging.
   */
  debugInfo(): { entryCount: number; oldestAgeMs: number | null } {
    const now = Date.now()
    let oldest: number | null = null

    for (const entry of this.store.values()) {
      const age = now - entry.lastAccess
      if (oldest === null || age > oldest) {
        oldest = age
      }
    }

    return {
      entryCount: this.store.size,
      oldestAgeMs: oldest
    }
  }
}
