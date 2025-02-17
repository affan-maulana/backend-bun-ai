import { Hono } from 'hono';
import { sendChat, getChat } from '@controllers/chatController';

const router = new Hono()

router.get('/:sessionId', (c) => getChat(c));
router.post('/:sessionId', (c) => sendChat(c));

export const ChatRoutes = router;