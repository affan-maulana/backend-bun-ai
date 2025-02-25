import { Hono } from 'hono';
import { sendChat, getChat, generateImage } from '@controllers/aiController';

const router = new Hono()

router.get('/chat/:sessionId', (c) => getChat(c));
router.post('/chat/:sessionId', (c) => sendChat(c));
router.post('image', (c) => generateImage(c));

export const AiRoutes = router;