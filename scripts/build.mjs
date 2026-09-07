// Vinext exits immediately after prerendering. On Windows, defer successful
// shutdown so its native worker handles can close before Node terminates.
if (process.platform === 'win32') {
  const exit = process.exit.bind(process);
  let pending = false;
  process.exit = (code = 0) => {
    if (Number(code) !== 0) return exit(code);
    if (!pending) {
      pending = true;
      setTimeout(() => exit(0), 1000);
    }
  };
}
process.argv = [process.argv[0], 'vinext', 'build'];
await import(new URL('../node_modules/vinext/dist/cli.js', import.meta.url).href);

