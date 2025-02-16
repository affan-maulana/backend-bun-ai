import { Hono } from 'hono';
import { userSessionList, newSession, deleteSession, renameSession } from '@controllers/sessionController';
const router = new Hono()

router.get('/', (c) =>  userSessionList(c) );
router.post('/', (c) =>  newSession(c) );
router.delete('/:sessionId', (c) =>  deleteSession(c) );
router.put('/:sessionId', (c) =>  renameSession(c) );

export const SessionRoutes = router;