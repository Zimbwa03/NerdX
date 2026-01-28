// Web-specific database stub for WatermelonDB
// On web we don't use the native SQLite adapter, so we expose
// a no-op database and mark Watermelon as unavailable.
//
// This avoids bundling the Node-only `better-sqlite3` dependency
// from `@nozbe/watermelondb/adapters/sqlite` while keeping the
// same public API (`database`, `isWatermelonAvailable`) used by
// the rest of the app.

// In web builds, simply export `null` and `false`. All callers
// are written to gracefully skip sync when Watermelon is not
// available (see `SyncService.ts`).

export const database: any = null;
export const isWatermelonAvailable = false;

