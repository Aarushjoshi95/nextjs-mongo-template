// npm run content:check (also runs before every build).
// Validates content/ and config/ and exits 1 with every error found.
import { loadContent } from '@/lib/content';

const { errors } = loadContent();
if (errors.length) {
  console.error(`Content check failed (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('Content check passed.');
