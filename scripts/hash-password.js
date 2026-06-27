#!/usr/bin/env node
// Generate a SHA-256 hash for your protected page password.
// Usage: node scripts/hash-password.js yourpassword

const crypto = require('crypto');
const password = process.argv[2];

if (!password) {
  console.log('\nUsage: node scripts/hash-password.js <your-password>\n');
  process.exit(1);
}

const hash = crypto.createHash('sha256').update(password.trim()).digest('hex');

console.log('\n─────────────────────────────────────────────────────');
console.log('Password hash (copy the line below):');
console.log(hash);
console.log('─────────────────────────────────────────────────────');
console.log('\nGhost Admin → Design → Customize →');
console.log('"Protected Page Password Hash" → paste and save.\n');
