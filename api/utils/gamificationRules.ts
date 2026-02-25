import { ContributionAction } from '../types/gamification';

export const contributionScores: Record<ContributionAction, number> = {
  NOTE_APPROVED: 5,
  LOST_ITEM_RETRIEVED: 10,
  EVENT_PARTICIPATION: 3,
  MARKETPLACE_SUCCESS: 8
};

export const badgeCriteria: Record<string, { action: ContributionAction; count: number }> = {
  SAVIOR: { action: 'LOST_ITEM_RETRIEVED', count: 3 },
  MARKETPLACE_STAR: { action: 'MARKETPLACE_SUCCESS', count: 5 },
  TOP_NOTE_SHARER: { action: 'NOTE_APPROVED', count: 5 }
};
