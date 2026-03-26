import { execSync } from 'child_process';
import { loadConfig } from '../config';

loadConfig();

const args = process.argv.slice(2).join(' ');
execSync(`npx prisma ${args}`, { stdio: 'inherit', env: process.env });
