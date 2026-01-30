/**
 * Root Metro config when running from repo root.
 * Uses app folder as project root so the watcher only scans NerdXApp (avoids "Failed to start watch mode" on Windows).
 */
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const repoRoot = __dirname;
const appRoot = path.join(repoRoot, 'NerdXApp');

const config = getDefaultConfig(appRoot);

// Watch repo root too so entry files (index.js, App.js) and root node_modules are found
config.watchFolders = [repoRoot, appRoot];
config.resolver.nodeModulesPaths = [
  path.join(appRoot, 'node_modules'),
  path.join(repoRoot, 'node_modules'),
];

module.exports = config;
