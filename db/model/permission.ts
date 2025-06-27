
import { db } from "../dbclient-neon.ts";


export async function findUserRole(user_id: number) {
  const role = await db.query.rolesTable.findFirst({
    where: (roles, { eq }) => (eq(roles.user_id, user_id)),
    with: {
      roleType: true,
    },
  });
  console.log(role);
  return role;
}
