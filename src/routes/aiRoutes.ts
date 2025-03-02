import { Hono } from 'hono';
import { sendChat, getChat, generateImage, getImages, getImageById, renameImage } from '@controllers/aiController';

const router = new Hono()

router.get('/chat/:sessionId', (c) => getChat(c));
router.post('/chat/:sessionId', (c) => sendChat(c));
router.post('image', (c) => generateImage(c));
router.get('images', (c) => getImages(c));
router.get('image/:id', (c) => getImageById(c));
router.put('image/:id', (c) => renameImage(c));

export const AiRoutes = router;