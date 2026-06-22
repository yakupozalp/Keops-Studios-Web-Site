import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import type { IncomingMessage, ServerResponse } from "http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// pino-http's typings may be a module object in this TS config; cast to a callable
const pino = pinoHttp as unknown as (opts?: any) => import("express").RequestHandler;

app.use(
  pino({
    logger,
    serializers: {
      req(req: IncomingMessage & { id?: string }) {
        return {
          id: (req as any).id,
          method: req.method,
          url: (req as any).url?.split("?")[0],
        };
      },
      res(res: ServerResponse) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
