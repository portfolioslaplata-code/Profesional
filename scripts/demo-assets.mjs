import { mkdir, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { portfolio } from '../src/data/portfolio.js'

await mkdir('tmp/pdfs', { recursive: true })
await writeFile('tmp/pdfs/portfolio.json', JSON.stringify(portfolio))
const result = spawnSync(
  process.argv[2] || 'python',
  ['scripts/demo-assets.py', 'tmp/pdfs/portfolio.json'],
  { stdio: 'inherit' },
)
process.exitCode = result.status ?? 1
