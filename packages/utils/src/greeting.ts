export function formatGreeting(target: string): string {
  const now = new Date().toISOString();
  return `[${now}] Hello from ${target} via Bun monorepo!`;
}


