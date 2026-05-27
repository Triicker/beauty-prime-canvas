import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";
import { createServer } from "node:http";

const handler = createStartHandler(defaultStreamHandler);

const port = Number(process.env.PORT || 3000);

createServer(async (req, res) => {
  const protocol =
    (req.headers["x-forwarded-proto"] as string | undefined) || "http";
  const host = req.headers.host || `localhost:${port}`;
  const url = `${protocol}://${host}${req.url}`;

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk as Buffer);
  }
  const bodyBuffer = chunks.length > 0 ? Buffer.concat(chunks) : undefined;

  const request = new Request(url, {
    method: req.method,
    headers: req.headers as HeadersInit,
    body: bodyBuffer && bodyBuffer.length > 0 ? bodyBuffer : undefined,
  });

  const response = await handler(request);

  const headers: Record<string, string | string[]> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });
  res.writeHead(response.status, headers);

  if (response.body) {
    const reader = response.body.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    } finally {
      reader.releaseLock();
    }
  }
  res.end();
}).listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default {
  fetch: handler,
};
