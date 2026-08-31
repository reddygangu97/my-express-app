import express from "express";

import { db } from "./db";
import { errorHandler } from "./middleware/error-handler";
import { contactsRouter } from "./routes/contacts";

export const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));

app.get("/health", async (_request, response) => {
  try {
    await db.query("SELECT 1");
    response.status(200).json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Database health check failed", error);
    response.status(503).json({ status: "error", database: "unavailable" });
  }
});

app.use("/contacts", contactsRouter);

app.use((_request, response) => {
  response.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Route not found",
    },
  });
});

app.use(errorHandler);
