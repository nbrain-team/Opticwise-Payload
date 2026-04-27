import fs from 'node:fs';
import path from 'node:path';

const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const { getPayload } = await import('payload');
const config = (await import('../src/payload.config.ts')).default;

console.log('[push-schema] initializing payload (push:true will sync columns)...');
const payload = await getPayload({ config });
console.log('[push-schema] payload initialized; schema in sync.');
await payload.db.destroy?.();
process.exit(0);
