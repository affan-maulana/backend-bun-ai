import { Hono } from 'hono';
import { chatDeepseek, chatGpt } from '@controllers/chatController';

const router = new Hono()

router.post('/deepseek', (c) => chatDeepseek(c));
router.post('/gpt', (c) => chatGpt(c));

export const ChatRoutes = router;