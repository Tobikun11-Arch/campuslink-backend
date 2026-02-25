import { redis } from './redis';
import { notificationQueue } from './notificationQueue';
import { logger } from '../logging/logger';

const CONSUMER_NAME = `consumer-${process.pid}`;
const MAX_RETRIES = 5;

async function reclaimPending() {
  const pending = await redis.xpending(notificationQueue.STREAM_KEY, notificationQueue.GROUP_NAME, '-', '+', 10);
  for (const entry of pending as any[]) {
    const [id] = entry;
    await redis.xclaim(
      notificationQueue.STREAM_KEY,
      notificationQueue.GROUP_NAME,
      CONSUMER_NAME,
      60000,
      id
    );
  }
}

// I run a worker loop to process queued notifications with retries
export async function startNotificationWorker() {
  await reclaimPending();

  while (true) {
    const stream = await redis.xreadgroup(
      'GROUP',
      notificationQueue.GROUP_NAME,
      CONSUMER_NAME,
      'BLOCK',
      5000,
      'COUNT',
      10,
      'STREAMS',
      notificationQueue.STREAM_KEY,
      '>'
    );

    if (!stream) {
      continue;
    }

    for (const [, messages] of stream) {
      for (const [id, fields] of messages) {
        let data: Record<string, string> = {};
        try {
          data = Object.fromEntries((fields as string[]).map((value, index, array) => {
            if (index % 2 === 0) {
              return [value, array[index + 1]];
            }
            return null;
          }).filter(Boolean) as [string, string][]);

          const attempts = Number(data.attempts || 0);
          if (attempts >= MAX_RETRIES) {
            await redis.xadd(notificationQueue.DLQ_KEY, '*', 'payload', JSON.stringify(data));
            await redis.xack(notificationQueue.STREAM_KEY, notificationQueue.GROUP_NAME, id);
            continue;
          }

          // I would dispatch to FCM here; for now we acknowledge the job
          await redis.xack(notificationQueue.STREAM_KEY, notificationQueue.GROUP_NAME, id);
        } catch (error) {
          const attempts = Number(data.attempts || 0) + 1;
          logger.error({ err: error }, 'Notification worker error');
          await redis.xadd(notificationQueue.STREAM_KEY, '*', 'payload', JSON.stringify(data), 'attempts', String(attempts));
          await redis.xack(notificationQueue.STREAM_KEY, notificationQueue.GROUP_NAME, id);
        }
      }
    }
  }
}
