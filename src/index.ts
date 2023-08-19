import express from "express";
import { Router } from "express"
import loggerFactory from "./logger";
import config from "./config";

const app = express();

const router = Router();

const logger = loggerFactory.create();
const { servicePort } = config;

const start = async () => {
  router.get("/ping", (req, res) => {
    const result = "pong!";
    logger.info("/ping, result - {result}", { result });
    return res.json({ result });
  });

  app.use(router);
  app.listen(servicePort, () =>
    logger.info(`Service started on port ${servicePort}...`),
  );
};

start().catch((error) =>
  logger.error(`Error occurred on starting service, error: {error}`, {
    error,
  }),
);
