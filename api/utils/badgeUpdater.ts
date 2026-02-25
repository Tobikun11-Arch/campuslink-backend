import { ContributionAction } from '../types/gamification';
import { userRepository } from '../repositories/user.repository';
import { activityRepository } from '../repositories/activity.repository';
import { contributionScores, badgeCriteria } from './gamificationRules';

// I update badge progress and contribution score based on a single action
export async function updateBadgeProgress(userId: string, action: ContributionAction, referenceId: string) {
  const increment = contributionScores[action] ?? 0;
  await userRepository.incrementContribution(userId, increment);
  await activityRepository.create({ type: action, referenceId, userId, action });

  for (const [badge, criteria] of Object.entries(badgeCriteria)) {
    if (criteria.action !== action) {
      continue;
    }

    const count = await activityRepository.countByAction(userId, action);
    if (count >= criteria.count) {
      await userRepository.addBadge(userId, badge);
    }
  }
}
