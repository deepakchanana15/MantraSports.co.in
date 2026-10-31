/**
 * Local development Postgres (portable, no Windows service)
 * Run: npm run db:local:start | db:local:stop | db:local:status
 *
 * Uses the PostgreSQL binaries and data folder in LOCAL_PG_HOME
 * (set in .env.local). Development only — production uses Neon.
 */

import { spawnSync } from 'node:child_process'
import { join } from 'node:path'
import { config } from 'dotenv'

config({ path: '.env.local' })

const home = process.env.LOCAL_PG_HOME
if (!home) {
  console.error('LOCAL_PG_HOME is not set in .env.local')
  process.exit(1)
}

const action = process.argv[2]
const args = {
  start: ['start', '-w', '-l', join(home, 'postgres.log')],
  stop: ['stop', '-w', '-m', 'fast'],
  status: ['status'],
}[action]

if (!args) {
  console.error('Usage: node scripts/local-db.mjs start|stop|status')
  process.exit(1)
}

const pgCtl = join(home, 'pgsql', 'bin', 'pg_ctl')
const result = spawnSync(pgCtl, [...args, '-D', join(home, 'data')], { stdio: 'inherit' })
process.exit(result.status ?? 1)
