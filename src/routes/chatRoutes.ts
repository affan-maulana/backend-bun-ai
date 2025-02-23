import { Hono } from 'hono';
import { sendChat, getChat, testChat } from '@controllers/chatController';

const router = new Hono()

router.get('/:sessionId', (c) => getChat(c));
router.post('/:sessionId', (c) => sendChat(c));
router.post('/', (c) => testChat(c));

export const ChatRoutes = router;