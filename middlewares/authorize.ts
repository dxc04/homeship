import { createMiddleware } from 'hono/factory';

export const authorize = createMiddleware(async (c, next) => {
  const session = c.get("session");
  const userId = session.get("userId");

  if (!userId) {
    if ( c.req.header('HX-Request') ) {
      c.res.headers.append("HX-Location", "/login");
      c.status(401);
      return c.res;
    }
    
    return c.redirect("/login");
  }

  await next();
});
