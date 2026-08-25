import { ExpertsService } from './experts.service';
import { parseRequirementText, rankExpertsForRequirement, MatchingWeights, DEFAULT_WEIGHTS } from '@/lib/services/matchingEngine';

let currentWeights: MatchingWeights = { ...DEFAULT_WEIGHTS };

export class MatchingService {
  static getWeights() {
    return currentWeights;
  }

  static updateWeights(weights: Partial<MatchingWeights>) {
    currentWeights = { ...currentWeights, ...weights };
    return currentWeights;
  }

  static async matchExpertsForRequirementText(rawText: string, budgetRange?: string) {
    const parsed = parseRequirementText(rawText);
    const experts = await ExpertsService.getAllExperts();
    return rankExpertsForRequirement(parsed, experts as any, currentWeights, budgetRange);
  }
}
