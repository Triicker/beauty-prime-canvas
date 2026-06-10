import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { pt } from "./i18n/pt";
import { en } from "./i18n/en";
import { fr } from "./i18n/fr";

// Initialize i18n synchronously for SSR before any rendering
if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    initImmediate: false,
    resources: {
      pt: { translation: pt },
      en: { translation: en },
      fr: { translation: fr },
    },
    fallbackLng: "pt",
    lng: "pt",
    supportedLngs: ["pt", "en", "fr"],
    interpolation: { escapeValue: false },
  });
}

import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";
import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";

const handler = createStartHandler(defaultStreamHandler);

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const clientDir = join(__dirname, "../client");

const MIME: Record<string, string> = {
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".json": "application/json",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

async function serveStatic(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const pathname = new URL(req.url || "/", "http://localhost").pathname;
  const filePath = join(clientDir, pathname);
  // Prevent directory traversal
  if (!filePath.startsWith(clientDir + sep) && filePath !== clientDir) return false;
  try {
    const info = await stat(filePath);
    if (!info.isFile()) return false;
    const ext = extname(filePath).toLowerCase();
    const contentType = MIME[ext] || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    // Hashed assets (8+ char hash before extension) can be cached indefinitely
    const isHashed = /\.[A-Za-z0-9_-]{8,}\.[a-z0-9]+$/.test(pathname);
    res.setHeader("Cache-Control", isHashed ? "public, max-age=31536000, immutable" : "public, max-age=3600");
    res.end(await readFile(filePath));
    return true;
  } catch {
    return false;
  }
}

const port = Number(process.env.PORT || 3000);

createServer(async (req, res) => {
  // Serve static assets from dist/client/
  if (req.method === "GET" || req.method === "HEAD") {
    if (await serveStatic(req, res)) return;
  }

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
