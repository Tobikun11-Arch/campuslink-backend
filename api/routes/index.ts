import { Router } from 'express';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import lostFoundRoutes from './lostfound.routes';
import eventsRoutes from './events.routes';
import marketplaceRoutes from './marketplace.routes';
import notesRoutes from './notes.routes';
import sectionsRoutes from './sections.routes';
import notificationsRoutes from './notifications.routes';
import adminRoutes from './admin.routes';
import filesRoutes from './files.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/lostfound', lostFoundRoutes);
router.use('/events', eventsRoutes);
router.use('/marketplace', marketplaceRoutes);
router.use('/notes', notesRoutes);
router.use('/sections', sectionsRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/admin', adminRoutes);
router.use('/files', filesRoutes);

export default router;
