import { formatGreeting } from "@bank/utils";

const port = Number(process.env.PORT || 3001);

Bun.serve({
  port,
  fetch(_req) {
    return new Response(formatGreeting("API"), {
      headers: { "Content-Type": "application/json" }
    });
  }
});

console.log(`API server running on http://localhost:${port}`);


