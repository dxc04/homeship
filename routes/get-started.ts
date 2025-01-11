import { Hono } from "hono";
import vento from "ventojs";

const app = new Hono();
const vto = vento();

app.get("/", async (c) => {
  const template = await vto.run("./views/pages/get-started.vto", {
    title: "Sweet Homes with Dwello",
    appName: Deno.env.get("APP_NAME"),
  });

  vto.cache.clear();

  return c.html(template.content);
});

export default app;
