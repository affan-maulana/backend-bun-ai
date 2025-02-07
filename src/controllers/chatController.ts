import { Context } from "hono";
import axios from "axios";
import { OpenAI } from "openai";
import "dotenv/config";

// import { LoginRequest, RegisterRequest } from "models/AuthModel";
// import { AuthService } from "services/authService";

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
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  if (!message) {
    return c.json({ error: "Message is required" }, 400);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // You can use 'gpt-4' if available
      messages: [{ role: "user", content: message }],
    });

    return c.json({ reply: response.choices[0].message.content });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
