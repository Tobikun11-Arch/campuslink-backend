import { NotificationModel } from '../models/Notification.model';
import { sendNotification } from '../utils/notificationSender';
import { logger } from '../logging/logger';

export const notificationService = {
  async createNotification(data: {
    type: string;
    targetAudience: string;
    delivery: string;
    senderId: string;
    recipientIds: string[];
    title: string;
    body: string;
  }) {
    const notification = await NotificationModel.create({
      type: data.type,
      targetAudience: data.targetAudience,
      delivery: data.delivery,
      senderId: data.senderId,
      recipientIds: data.recipientIds,
      pendingPush: true
    });

    try {
      await sendNotification(data.recipientIds, {
        type: data.type,
        title: data.title,
        body: data.body
      });

      await NotificationModel.updateOne({ _id: notification.id }, { pendingPush: false }).exec();
    } catch (error) {
      // I keep the notification pending when external push fails
      logger.error({ err: error }, 'FCM delivery failed, will retry later');
    }
  }
};
