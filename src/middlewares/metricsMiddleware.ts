import { publishMetric } from "../lib/clouddwatchMetrics";
import { Request, Response } from "express";

function metricsMiddleware() {
  return async (req: Request, res: Response, next: () => void) => {
    const start = Date.now();

    res.on("finish", async () => {
      const duration = Date.now() - start;

      await publishMetric("HttpRequestDuration", duration, "Milliseconds");

      let statusRange = "2xx";
      if (res.statusCode >= 400 && res.statusCode < 500) statusRange = "4xx";
      else if (res.statusCode >= 500) statusRange = "5xx";

      await publishMetric(`HttpStatus_${statusRange}`, 1, "Count");
    });

    next();
  };
}

export default metricsMiddleware;
