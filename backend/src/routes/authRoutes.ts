import { Router } from 'express';
import { login, me, refresh, register, updateMe, uploadAvatar } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.get('/me', authMiddleware, me);
router.patch('/me', authMiddleware, updateMe);
router.post('/avatar', authMiddleware, upload.single('avatar'), uploadAvatar);

export default router;
