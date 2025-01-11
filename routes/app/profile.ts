import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("This is the logged main app");
});

export default app;
