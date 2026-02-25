import { enqueueNotification } from '../queues/notificationQueue';
import { NotificationPayload } from '../types/notification';
import { handleExternalError } from './errorWrapper';

// I enqueue notifications so delivery is reliable and retriable
export async function sendNotification(target: string[], payload: NotificationPayload) {
  try {
    await enqueueNotification({ target, payload });
  } catch (error) {
    throw handleExternalError('redis', error);
  }
}
