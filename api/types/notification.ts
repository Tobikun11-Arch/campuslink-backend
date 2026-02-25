export type NotificationPayload = {
  type: string;
  title: string;
  body: string;
  data?: Record<string, string>;
};
