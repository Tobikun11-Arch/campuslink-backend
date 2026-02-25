import { redis } from './redis';
import { NotificationPayload } from '../types/notification';

const STREAM_KEY = 'notifications:stream';
const DLQ_KEY = 'notifications:dlq';
const GROUP_NAME = 'notifications-group';

export type NotificationJob = {
  target: string[];
  payload: NotificationPayload;
  attempts?: number;
};

async function ensureGroup() {
  try {
    await redis.xgroup('CREATE', STREAM_KEY, GROUP_NAME, '$', 'MKSTREAM');
  } catch (error: any) {
    if (!String(error?.message).includes('BUSYGROUP')) {
      throw error;
    }
  }
}

export async function enqueueNotification(job: NotificationJob) {
  await ensureGroup();
  await redis.xadd(
    STREAM_KEY,
    '*',
    'target',
    JSON.stringify(job.target),
    'payload',
    JSON.stringify(job.payload),
    'attempts',
    String(job.attempts ?? 0)
  );
}

export const notificationQueue = {
  STREAM_KEY,
  DLQ_KEY,
  GROUP_NAME
};
