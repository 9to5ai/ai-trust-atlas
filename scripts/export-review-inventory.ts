import { writeFileSync } from 'node:fs'
import { instruments } from '../src/data/instruments'
writeFileSync('/tmp/atlas-review-inventory.json', JSON.stringify(instruments, null, 2))
console.log(instruments.map(s => `${s.id} | ${s.authorityClass} | ${s.status} | ${s.published} | ${s.summary}`).join('\n'))
