import { getProhibitionRules, loadRules } from "../utils/loader.js";
import type { Violation } from "../utils/types.js";

/**
 * Check a class string against prohibition rules.
 * Returns an array of violations found with full metadata.
 */
export function checkRule(classes: string): Violation[] {
  const rulesData = loadRules();
  const violations: Violation[] = [];
  const classList = classes.split(/\s+/).filter(Boolean);

  for (const cls of classList) {
    for (const rule of rulesData.rules) {
      const patterns = rule.patterns ?? (rule.pattern ? [rule.pattern] : []);
      for (const pattern of patterns) {
        if (cls.includes(pattern)) {
          violations.push({
            ruleId: rule.id,
            class: cls,
            category: rule.category,
            reason: rule.reason,
            alternative: rule.alternative,
            severity: rule.severity,
            contextual: rule.contextual,
          });
        }
      }
    }
  }

  return violations;
}

/**
 * Legacy check returning simple objects (backward compatible).
 */
export function checkRuleLegacy(classes: string): { class: string; reason: string; alternative: string }[] {
  const rules = getProhibitionRules();
  const violations: { class: string; reason: string; alternative: string }[] = [];
  const classList = classes.split(/\s+/).filter(Boolean);

  for (const cls of classList) {
    for (const rule of rules) {
      if (cls.includes(rule.pattern)) {
        violations.push({
          class: cls,
          reason: rule.reason,
          alternative: rule.alternative,
        });
      }
    }
  }

  return violations;
}
