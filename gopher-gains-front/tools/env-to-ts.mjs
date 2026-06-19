import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envPath = resolve(root, '.env');
const envExamplePath = resolve(root, '.env.template');

function parseEnv(filePath) {
  const env = {};
  if (!existsSync(filePath)) return env;
  const content = readFileSync(filePath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function hasValue(obj) {
  return Object.values(obj).some(v => v !== undefined && v !== '');
}

const envVars = parseEnv(envPath);
const exampleVars = parseEnv(envExamplePath);
const vars = hasValue(envVars) ? envVars : exampleVars;

const apiUrl = vars.NG_APP_API_URL || 'http://localhost:8080/api/v1';
const title = vars.NG_APP_TITLE || 'Gopher Gains';

const devContent = `export const environment = {
  production: false,
  apiUrl: '${apiUrl}',
  title: '${title}',
};
`;

const prodContent = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
  title: '${title}',
};
`;

const envDir = resolve(root, 'src/environments');
writeFileSync(resolve(envDir, 'environment.ts'), devContent);
writeFileSync(resolve(envDir, 'environment.prod.ts'), prodContent);

console.log(`✓ environment.ts generated (apiUrl: ${apiUrl})`);
