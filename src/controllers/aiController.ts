import { Context } from "hono";
import { OpenAI } from "openai";
import "dotenv/config";
import { getUserIdByToken } from "@helpers/tokenHandlers";
import { errorResponse, successResponse } from "@helpers/apiHelpers";
import { SessionService } from "@services/sessionService";
import { AiService } from "@services/aiService";

export const getChat = async (ctx: Context) => {
  try {
    const userId = getUserIdByToken(ctx.req.header("Authorization"));
    const { sessionId } = ctx.req.param();
    await SessionService.checkSessionExist(userId, sessionId);
    const chat = await AiService.getChat(userId, sessionId);

    return successResponse(ctx, chat, "Get Chat Success !")
  } catch(e: any){
    return errorResponse(ctx, e.status, e.message)
  }
};

export const sendChat = async (ctx: Context) => {
  try {
    const userId = getUserIdByToken(ctx.req.header("Authorization"));
    const { sessionId } = ctx.req.param();
    const { 
      message, 
      history = []
    } = await ctx.req.json();

    if (!message) {
      return errorResponse(ctx, 400, "Message is required");
    }
    await SessionService.checkSessionExist(userId, sessionId);
    const responseAI = await AiService.sendChat(sessionId, message, history);

    return successResponse(ctx, responseAI, "Send Chat Success !", 201)
  } catch(e: any){
    return errorResponse(ctx, e.status, e.message)
  }
};

export const generateImage = async (ctx: Context) => {
  try {
    const userId = getUserIdByToken(ctx.req.header("Authorization"));
    const { prompt } = await ctx.req.json();
    if (!prompt) {
      return errorResponse(ctx, 400, "Prompt is required");
    }
    const response = await AiService.generateImage(prompt, userId);
    
    return successResponse(ctx, response, "Generate Image Success !", 201)
  } catch(e: any){
    return errorResponse(ctx, e.status, e.message)
  }
}

export const getImages = async (ctx: Context) => {
  try {
    const userId = getUserIdByToken(ctx.req.header("Authorization"));
    const response = await AiService.getImages(userId);
    
    return successResponse(ctx, response, "Get Images Success !")
  } catch(e: any){
    return errorResponse(ctx, e.status, e.message)
  }
}

export const getImageById = async (ctx: Context) => {
  try {
    const userId = getUserIdByToken(ctx.req.header("Authorization"));
    const { id } = ctx.req.param();
    const response = await AiService.getImageById(id, userId);
    
    return successResponse(ctx, response, "Get Image Success !")
  } catch(e: any){
    return errorResponse(ctx, e.status, e.message)
  }
}

export const renameImage = async (ctx: Context) => {
  try {
    const userId = getUserIdByToken(ctx.req.header("Authorization"));
    const { id } = ctx.req.param();
    const { name } = await ctx.req.json();
    if (!prompt) {
      return errorResponse(ctx, 400, "Prompt is required");
    }
    const response = await AiService.renameImage(id, userId, name);
    
    return successResponse(ctx, response, "Rename Image Success !")
  } catch(e: any){
    return errorResponse(ctx, e.status, e.message)
  }
}

export const deleteImage = async (ctx: Context) => {
  try {
    const userId = getUserIdByToken(ctx.req.header("Authorization"));
    const { id } = ctx.req.param();
    const response = await AiService.deleteImage(id, userId);
    
    return successResponse(ctx, response, "Delete Image Success !")
  } catch(e: any){
    return errorResponse(ctx, e.status, e.message)
  }
}

  