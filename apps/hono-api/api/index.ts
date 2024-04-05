import { serve } from "@hono/node-server";
import "dotenv/config";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text(`Hello Hono 0! ${process.env.BUN_MODE}`);
});

app.get("/api", (c) => {
  return c.text(`Hello Hono api! ${process.env.BUN_MODE}`);
});

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on port http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
