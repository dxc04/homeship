import { Context, Hono } from "hono";
import vento from "ventojs";
import profile from "./profile.ts";

const app = new Hono();
const vto = vento();
/*
app.use('*', async (c: Context, next) => {
  const session = c.get("session");
  const userId = session.get("userId");

  if (!userId) {
    return c.redirect('/login'); 
  }

  await next(); 
});*/

// todo: move navLinks as constants to a file
const navLinks = [
/*  {
    group: "",
    links: [
      { name: "Dashboard", icon: "dashboard" },
    ],
  }, */
  {
    group: "Community",
    links: [
      { name: "Message Board", icon: "message-board" },
      { name: "Messages", icon: "messages" },
    ],
  },
  {
    group: "Manage",
    links: [
      { name: "Members", icon: "members" },
      { name: "Requests", icon: "requests" },
      { name: "Violations", icon: "violations" },
      { name: "Documents", icon: "documents" },
      { name: "Events", icon: "events" },
      { name: "Work Permits", icon: "work-permits" },
    ],
  },
  {
    group: "Financials",
    links: [
      { name: "Billing", icon: "billing" },
      { name: "Reports", icon: "reports" },
    ],
  },
];

app.get("/", async (c: Context) => {
  //const session = c.get("session");
  //const userId = session.get("userId");

  const template = await vto.run("./views/layouts/app.vto", {
    title: "Sweet Homes with Dwello",
    navLinks: navLinks,
    appName: Deno.env.get("APP_NAME"),
  });
  vto.cache.clear();
  return c.html(template.content);
});

app.route("/profile", profile);

export default app;
