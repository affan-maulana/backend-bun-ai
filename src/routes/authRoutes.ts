import { Hono } from 'hono';
import { loginUser, registerUser, sendEmailConfirmation, verifyPinAndLogin } from '@controllers/authController';

const router = new Hono()

//routes posts index
router.post('login', (c) => loginUser(c));
router.post('register', (c) => registerUser(c));
router.post('request', (c) => sendEmailConfirmation(c));
router.post('verify', (c) => verifyPinAndLogin(c));

export const AuthRoutes = router;