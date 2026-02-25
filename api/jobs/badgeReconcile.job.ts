// I reconcile badge progress to keep it consistent with activity history
import { activityRepository } from '../repositories/activity.repository';
import { userRepository } from '../repositories/user.repository';
import { badgeCriteria } from '../utils/gamificationRules';

// I reconcile badge progress to keep it consistent with activity history
export async function reconcileBadges() {
  const aggregates = await activityRepository.aggregateContribution();

  for (const entry of aggregates) {
    const userId = String(entry._id);
    const actions: string[] = entry.actions || [];
    const earnedBadges: string[] = [];

    for (const [badge, criteria] of Object.entries(badgeCriteria)) {
      const count = actions.filter((action) => action === criteria.action).length;
      if (count >= criteria.count) {
        earnedBadges.push(badge);
      }
    }

    await userRepository.setBadges(userId, earnedBadges);
  }
}
