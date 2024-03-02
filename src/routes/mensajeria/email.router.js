// email.router.js
import { Router } from 'express';
import {
  sendEmail,
  sendEmailWithAttachments,
  sendRegistrationEmail,
} from '../../controllers/email.controller.js';

const router = Router();

router.get('/', sendEmail);
router.get('/attachments', sendEmailWithAttachments);
router.get('/registro', sendRegistrationEmail);

export default router;
