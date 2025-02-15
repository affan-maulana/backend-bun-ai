import { Context } from "hono";
import { OpenAI } from "openai";
import "dotenv/config";
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
