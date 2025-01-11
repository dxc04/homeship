import { SessionData, Store } from "jsr:@jcs224/hono-sessions";
import { eq } from "drizzle-orm";
import { sessionsTable as sessions } from "../db/schema/users.ts";
import { db } from "../db/dbclient.ts";

export class SessionStore implements Store {
  db = db;
  sessions = sessions;

  constructor() {
    this.db = db;
    this.sessions = sessions;
  }

/**
 * Retrieves a session by its session ID.
 *
 * @param {string} sessionId - The ID of the session to retrieve.
 * @returns {Promise<SessionData | undefined>} - A promise that resolves to the session data if found, or undefined if the session does not exist.
 */

  /**
   * Retrieves a session by its session ID.
   *
   * @param {string} sessionId - The ID of the session to retrieve.
   * @returns {Promise<SessionData | null>} - A promise that resolves to the session data if found, or null if the session does not exist.
   */
  async getSessionById(sessionId: string): Promise<SessionData | null> {
    const [session] = await this.db
      .select()
      .from(this.sessions)
      .where(eq(this.sessions.id, sessionId));

    return session?.data as SessionData || null;
  }

  /**
   * Creates a new session if it does not already exist, or updates the existing session if it does.
   *
   * @param {string} sessionId - The ID of the session to create or update
   * @param {SessionData} sessionData - The session data to store in the session
   */
  async createSession(sessionId: string, sessionData: SessionData) {
    await this.db
      .insert(this.sessions)
      .values({ data: sessionData, id: sessionId })
      .onConflictDoUpdate({
        target: this.sessions.id,
        set: { data: sessionData },
      });
  }

  async persistSessionData(sessionId: string, sessionData: SessionData) {
    await this.createSession(sessionId, sessionData);
  }

  /**
   * Delete a session by session ID.
   *
   * @param {string} sessionId - session ID to delete
   */
  async deleteSession(sessionId: string) {
    await this.db.delete(this.sessions).where(
      eq(this.sessions.id, sessionId),
    );
  }
}

export default SessionStore;
