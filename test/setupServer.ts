/* istanbul ignore file */
import express from 'express';
import http from 'http';
import type { NextApiHandler } from 'next';
import { apiResolver } from 'next/dist/server/api-utils/node';
import { parse } from 'url';

export function setupServer(handler: NextApiHandler, disableBodyParser?: boolean): http.Server | express.Express {
  if (process.env.TEST_SERVER === 'nextjs') {
    // @ts-ignore
    handler.config = { api: { bodyParser: !disableBodyParser } };
    return http.createServer((req, res) => {
      const parsedUrl = parse(req.url as any, true);
      return apiResolver(req, res, parsedUrl.query, handler, {} as any, false);
    });
  }

  return express()
    .use(express.json())
    .all('*', handler as any);
}
