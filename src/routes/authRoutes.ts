import { Hono } from 'hono';
import { loginUser, registerUser } from '@controllers/authController';

const router = new Hono()

//routes posts index
router.post('login', (c) => loginUser(c));
router.post('register', (c) => registerUser(c));

export const AuthRoutes = router;