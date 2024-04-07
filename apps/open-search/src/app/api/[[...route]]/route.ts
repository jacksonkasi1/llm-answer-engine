import { Hono } from "hono";
import { cors } from "hono/cors";

import { stream } from "hono/streaming";

import { handle } from "hono/vercel";

export const config = {
  runtime: "edge",
};

type EnvConfig = {
  AI: any;
};

const app = new Hono().basePath("/api");

app.use("/*", cors());

// app.post("/chat", async (c) => {
//   try {
//     const {} = env<EnvConfig>(c);

//   } catch (err) {
//     console.error(err);

//     return c.json(
//       { results: [], message: "Something went wrong." },
//       {
//         status: 500,
//       },
//     );
//   }
// });

// export const POST = handle(app);

// export default app as never;

app.get("/", async (c) => {
  return c.json({ message: "Hello Next.js!" });
});

// Endpoint for chat which uses streaming
app.get("/chat", async (c) => {
  return stream(c, async (stream) => {
    try {
      // Example: Write a simple text response multiple times
      for (let i = 0; i < 5; i++) {
        await stream.write(`Stream content ${i}\n`);
        // Wait for a second before the next write
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      // When done writing to the stream
      stream.close();
    } catch (err) {
      // Error handling if something goes wrong during the stream
      console.error("Error during streaming:", err);
      stream.close();
    }
  });
});

export const GET = handle(app);
export default app as never;
