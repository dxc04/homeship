import { Context, Hono } from "hono";
import { extractFormErrors, loginFormSchema } from "../lib/validators.ts";
import { zValidator } from "@hono/zod-validator";
import vento from "ventojs";
import * as UserTable from "../db/model/users.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { Session } from "jsr:@jcs224/hono-sessions";

type SessionDataTypes = {
  'userId': number
}

const app = new Hono<{
  Variables: {
    session: Session<SessionDataTypes>,
  }
}>()

const vto = vento();

app.get("/", async (c) => {
  const template = await vto.run("./views/pages/login.vto", {
    title: Deno.env.get("TITLE"),
    appName: Deno.env.get("APP_NAME"),
  });

  return c.html(template.content);
});

app.post(
  "/",
  zValidator(
    "form",
    loginFormSchema,
    async (result, c: Context) => {
      vto.cache.clear();

      const session = c.get("session");
      const data = result.data;
      const user = await UserTable.findUserByEmail(data.email);
      const passwordMatch = (user && user.password) 
        ? bcrypt.compareSync(data.password, user.password)
        : false;
      
      if (!result.success || (!passwordMatch && result.success)) {
        const template = await vto.run(
          "./views/partials/login_form.vto",
          { 
            data: result.data,
            errors: !result.success ? extractFormErrors(result.error) : null, 
            genericError: !passwordMatch && result.success ? 'Invalid email or password' : null
          },
        );
        return c.html(template.content);
      }

      session.set("userId", user.id);
      c.res.headers.append("HX-Redirect", "/app");
    },
  ),
);

export default app;
