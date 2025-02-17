import { prismaClient } from "application/database";
import { HTTPException } from "hono/http-exception";
import { SessionResponse } from "models/SessionModel";

export class SessionService {
  static async getSessionsByUser(userId: string): Promise<SessionResponse[]> {
    const sessions = await prismaClient.sessions.findMany({
      where: {
        userId: userId,
      },
    });
    return sessions;
  }
  
  // createSession
  static async createSession (userId: string): Promise<SessionResponse> {
    const newSession = await prismaClient.sessions.create({
      data: {
        userId: userId,
      },
    });
    return newSession;
  };

  // deleteSession
  static async deleteSession(userId: string, sessionId: string): Promise<string> {
    await prismaClient.sessions.delete({
      where: {
        id: sessionId,
        userId: userId,
      },
    });
    return "Session deleted";
  }

  // renameSession
  static async renameSession(userId: string, sessionId: string, newName: string): Promise<SessionResponse> {
    const renameSession = await prismaClient.sessions.update({
      where: {
        id: sessionId,
        userId: userId,
      },
      data: {
        name: newName,
      },
    });
    return renameSession;
  }

  // check if session exist
  static async checkSessionExist(userId: string, sessionId: string): Promise<void> {
    const session = await prismaClient.sessions.findFirst({
      select: {
        id: true,
      },
      where: {
        id: sessionId,
        userId: userId,
      },
    });

    if (!session){
      throw new HTTPException(404, {
        message: "Session not found"
      })
    }
  }
}