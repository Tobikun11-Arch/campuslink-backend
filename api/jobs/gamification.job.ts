// I run nightly to recalculate reputation scores and contribution ranks
import {activityRepository} from '../repositories/activity.repository';
import {userRepository} from '../repositories/user.repository';
import {reportRepository} from '../repositories/report.repository';
import {contributionScores, badgeCriteria} from '../utils/gamificationRules';

// I run nightly to recalculate reputation scores and contribution ranks
export async function recalcGamification() {
  const aggregates = await activityRepository.aggregateContribution();

  for (const entry of aggregates) {
    const userId = String(entry._id);
    const actions: string[] = entry.actions || [];
    let contributionScore = 0;

    for (const action of actions) {
      const value =
        contributionScores[action as keyof typeof contributionScores] ?? 0;
      contributionScore += value;
    }

    await userRepository.setContribution(userId, contributionScore);

    const earnedBadges: string[] = [];
    for (const [badge, criteria] of Object.entries(badgeCriteria)) {
      const count = actions.filter(action => action === criteria.action).length;
      if (count >= criteria.count) {
        earnedBadges.push(badge);
      }
    }

    await userRepository.setBadges(userId, earnedBadges);

    const reports = await reportRepository.countReportsForUser(userId);
    const user = await userRepository.findById(userId);
    const tradeCount = user?.tradeCount ?? 0;
    const reputationScore =
      tradeCount + reports === 0
        ? 0
        : (tradeCount / (tradeCount + reports)) * 100;
    await userRepository.updateReputation(
      userId,
      Number(reputationScore.toFixed(2))
    );
  }

  const users = await userRepository.listAll();
  const sorted = [...users].sort(
    (a, b) => (b.contributionScore ?? 0) - (a.contributionScore ?? 0)
  );
  for (let i = 0; i < sorted.length; i++) {
    await userRepository.setGlobalRank(String(sorted[i]._id), i + 1);
  }
}
