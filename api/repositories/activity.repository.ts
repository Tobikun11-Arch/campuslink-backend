import { ActivityModel } from '../models/Activity.model';

export const activityRepository = {
  create: (data: { type: string; referenceId: string; userId: string; action: string }) =>
    ActivityModel.create({
      type: data.type,
      referenceId: data.referenceId,
      userId: data.userId,
      action: data.action
    }),
  countByAction: (userId: string, action: string) =>
    ActivityModel.countDocuments({ userId, action }).exec(),
  aggregateContribution: () =>
    ActivityModel.aggregate([
      {
        $group: {
          _id: '$userId',
          actions: { $push: '$action' }
        }
      }
    ])
};
