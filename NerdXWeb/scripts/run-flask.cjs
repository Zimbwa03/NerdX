/**
 * Start Flask from the repo root (parent of NerdXWeb) so /admin and /api proxies work on localhost:5000.
 */
const { spawn } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const isWin = process.platform === 'win32';
const py = isWin ? 'python' : 'python3';
const child = spawn(py, ['backend/main.py'], {
  cwd: root,
  stdio: 'inherit',
  shell: isWin,
});

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
