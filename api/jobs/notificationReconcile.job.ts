// I re-enqueue missed notifications when Redis recovers from downtime
import { NotificationModel } from '../models/Notification.model';
import { sendNotification } from '../utils/notificationSender';
import { logger } from '../logging/logger';

// I re-enqueue missed notifications when Redis recovers from downtime
export async function reconcileNotifications() {
  const pending = await NotificationModel.find({ pendingPush: true }).limit(100).exec();

  for (const notification of pending) {
    try {
      await sendNotification(notification.recipientIds.map((id) => String(id)), {
        type: notification.type,
        title: 'Notification',
        body: notification.type
      });
      await NotificationModel.updateOne({ _id: notification.id }, { pendingPush: false }).exec();
    } catch (error) {
      logger.error({ err: error }, 'Failed to re-enqueue notification');
    }
  }
}
