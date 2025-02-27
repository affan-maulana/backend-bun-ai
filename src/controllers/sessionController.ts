import { Context } from "hono";
import { getUserIdByToken } from "@helpers/tokenHandlers";
import { SessionService } from "@services/sessionService";
import { errorResponse, successResponse } from "@helpers/apiHelpers";

export const userSessionList = async (ctx: Context) => {
  try {
    const userId = getUserIdByToken(ctx.req.header("Authorization"));
    const getSessionByUser = await SessionService.getSessionsByUser(userId);
    return successResponse(ctx, getSessionByUser, "Get Session Success !")
  } catch(e: any){
    return errorResponse(ctx, e.status, e.message)
  }
}

// newSession
export const newSession = async (ctx: Context) => {
  try {
    const userId = getUserIdByToken(ctx.req.header("Authorization"));
    const newSession = await SessionService.createSession(userId);
    return successResponse(ctx, newSession, "Create Session Success !", 201)
  } catch(e: any){
    return errorResponse(ctx, e.status, e.message)
  }
}

// deleteSession
export const deleteSession = async (ctx: Context) => {
  try {
    const { sessionId } = ctx.req.param();
    const userId = getUserIdByToken(ctx.req.header("Authorization"));

    // check if data exist
    await SessionService.checkSessionExist(userId, sessionId);

    await SessionService.deleteSession(userId, sessionId);

    return successResponse(ctx, "", "Delete Session Success !")
  } catch(e: any){
    return errorResponse(ctx, e.status, e.message)
  }
}

// renameSession
export const renameSession = async (ctx: Context) => {
  try {
    const userId = getUserIdByToken(ctx.req.header("Authorization"));
    const { sessionId } = ctx.req.param();
    const { newName } = await ctx.req.json();

    await SessionService.checkSessionExist(userId, sessionId);
    console.log("");
    
    const renameSession = await SessionService.renameSession(userId, sessionId, newName);
    return successResponse(ctx, renameSession, "Rename Session Success !")
  } catch(e: any){
    return errorResponse(ctx, e.status, e.message)
  }
}

