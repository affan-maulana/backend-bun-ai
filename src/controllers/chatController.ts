import { Context } from "hono";
import { OpenAI } from "openai";
import "dotenv/config";
import { getUserIdByToken } from "@helpers/tokenHandlers";
import { errorResponse, successResponse } from "@helpers/apiHelpers";
import { SessionService } from "@services/sessionService";
import { ChatService } from "@services/chatService";
export const chatDeepseek = async (c: Context) => {
  const { message } = await c.req.json();

  if (!message) {
    return c.json({ error: "Message is required" }, 400);
  }

  try {
		const openai = new OpenAI({
			baseURL: 'https://api.deepseek.com',
			apiKey: process.env.DEEPSEEK_API_KEY
		});

		const response = await openai.chat.completions.create({
			messages: [{ role: "system", content: "You are a helpful assistant." }],
			model: "deepseek-chat",
		});

    return c.json({ reply: response.choices[0].message.content });
	} catch (error) {
    return c.json({ error: error }, 500);
  }
};
export const chatGpt = async (c: Context) => {
  const { message } = await c.req.json();
  
  if (!message) {
    return c.json({ error: "Message is required" }, 400);
  }
  
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        // { role: "system", content: "jawab sebagai bajak laut" },
        { role: "user", content: message }
      ],
    });

    return c.json({ reply: response.choices[0].message.content });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const getChat = async (ctx: Context) => {
  try {
    const userId = getUserIdByToken(ctx.req.header("Authorization"));
    const { sessionId } = ctx.req.param();
    await SessionService.checkSessionExist(userId, sessionId);
    const chat = await ChatService.getChat(userId, sessionId);

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
      engine = "gpt"
    } = await ctx.req.json();

    if (!message) {
      return errorResponse(ctx, 400, "Message is required");
    }
    await SessionService.checkSessionExist(userId, sessionId);
    const responseAI = await ChatService.sendChat(sessionId, message, engine);

    return successResponse(ctx, responseAI, "Send Chat Success !")
  } catch(e: any){
    return errorResponse(ctx, e.status, e.message)
  }
};
