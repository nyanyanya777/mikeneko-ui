import { loadRules, loadTokens } from "../utils/loader.js";
import type { Violation } from "../utils/types.js";

/**
 * Extract primary color hex values from tokens.json for hardcode detection.
 * Returns escaped regex patterns like ["#2b70ef", "#1d5bd6", ...].
 */
function extractPrimaryHexValues(): string[] {
  try {
    const tokens = loadTokens();
    const hexValues: string[] = [];
    const primary = tokens.color?.primary;
    if (primary) {
      for (const entry of Object.values(primary)) {
        const val = typeof entry === "object" && entry !== null && "value" in entry
          ? String((entry as { value: unknown }).value)
          : "";
        if (/^#[0-9a-fA-F]{6}$/.test(val)) {
          hexValues.push(val.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
        }
      }
    }
    return hexValues;
  } catch {
    // Tokens not available — skip hex detection
    return [];
  }
}

/**
 * Extract all class attribute values from HTML string.
 */
function extractClasses(html: string): string[] {
  const classRegex = /class\s*=\s*["']([^"']+)["']/gi;
  const allClasses: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = classRegex.exec(html)) !== null) {
    const classes = match[1].split(/\s+/).filter(Boolean);
    allClasses.push(...classes);
  }

  return [...new Set(allClasses)];
}

/**
 * Check for structural accessibility issues in HTML.
 */
function checkStructuralIssues(html: string): StructuralIssue[] {
  const issues: StructuralIssue[] = [];

  // Check: img without alt
  const imgNoAlt = /<img(?![^>]*\balt\s*=)[^>]*>/gi;
  let match: RegExpExecArray | null;
  while ((match = imgNoAlt.exec(html)) !== null) {
    issues.push({
      type: "accessibility",
      severity: "critical",
      message: "<img> に alt 属性がない",
      suggestion: "alt=\"説明テキスト\" を付与（装飾画像は alt=\"\"）",
      context: match[0].slice(0, 80),
    });
  }

  // Check: button without accessible name
  const buttonNoLabel = /<button(?![^>]*\baria-label)[^>]*>\s*<(?:svg|img|i\b)/gi;
  while ((match = buttonNoLabel.exec(html)) !== null) {
    issues.push({
      type: "accessibility",
      severity: "high",
      message: "アイコンボタンに aria-label がない",
      suggestion: "aria-label=\"操作内容\" を付与",
      context: match[0].slice(0, 80),
    });
  }

  // Check: input without label association
  const inputIds = new Set<string>();
  const labelFors = new Set<string>();
  const inputIdRegex = /<input[^>]*\bid\s*=\s*["']([^"']+)["'][^>]*>/gi;
  const labelForRegex = /<label[^>]*\bfor\s*=\s*["']([^"']+)["'][^>]*>/gi;

  while ((match = inputIdRegex.exec(html)) !== null) inputIds.add(match[1]);
  while ((match = labelForRegex.exec(html)) !== null) labelFors.add(match[1]);

  for (const id of inputIds) {
    if (!labelFors.has(id)) {
      issues.push({
        type: "accessibility",
        severity: "high",
        message: `<input id="${id}"> に対応する <label for="${id}"> がない`,
        suggestion: "<label> を for 属性で関連付け、または aria-label を付与",
      });
    }
  }

  // Check: table without scope on th
  if (/<table[\s>]/i.test(html) && /<th(?![^>]*\bscope\b)/i.test(html)) {
    issues.push({
      type: "accessibility",
      severity: "medium",
      message: "<th> に scope 属性がない",
      suggestion: "scope=\"col\" または scope=\"row\" を付与",
    });
  }

  // Check: dialog/modal without role
  if (/modal|dialog/i.test(html) && !/<[^>]*role\s*=\s*["']dialog["']/i.test(html)) {
    // Only flag if there's a modal-like structure
    const hasOverlay = /bg-black\/|backdrop|overlay/i.test(html);
    if (hasOverlay) {
      issues.push({
        type: "accessibility",
        severity: "high",
        message: "モーダル構造に role=\"dialog\" がない",
        suggestion: "role=\"dialog\" と aria-modal=\"true\" を付与",
      });
    }
  }

  // Check: semantic color usage — detect hardcoded primary hex from tokens
  const primaryHexPatterns = extractPrimaryHexValues();
  if (primaryHexPatterns.length > 0) {
    const hexRegex = new RegExp(primaryHexPatterns.join("|"), "gi");
    while ((match = hexRegex.exec(html)) !== null) {
      issues.push({
        type: "semantic",
        severity: "medium",
        message: `ハードコードされた色 "${match[0]}" を検出`,
        suggestion: "セマンティックトークン (bg-primary, text-primary 等) を使用",
        context: match[0],
      });
    }
  }

  // Check: raw Tailwind color classes that should use semantic tokens
  const rawColorClasses = /(?:bg|text|border)-(?:blue|indigo)-\d{2,3}/gi;
  while ((match = rawColorClasses.exec(html)) !== null) {
    issues.push({
      type: "semantic",
      severity: "medium",
      message: `生のTailwindカラークラス "${match[0]}" を検出`,
      suggestion: "セマンティックトークン (bg-primary, text-primary, border-primary 等) を使用",
      context: match[0],
    });
  }

  return issues;
}

export interface StructuralIssue {
  type: "accessibility" | "semantic" | "structure";
  severity: "critical" | "high" | "medium" | "low";
  message: string;
  suggestion: string;
  context?: string;
}

export interface HtmlCheckResult {
  classViolations: Violation[];
  structuralIssues: StructuralIssue[];
  summary: {
    totalClasses: number;
    uniqueClasses: number;
    violationCount: number;
    structuralIssueCount: number;
    bySeverity: Record<string, number>;
  };
}

/**
 * Check an entire HTML string against DS prohibition rules and structural best practices.
 */
export function checkHtml(html: string): HtmlCheckResult {
  const rulesData = loadRules();
  const allClasses = extractClasses(html);
  const uniqueClasses = [...new Set(allClasses)];

  // Check classes against rules
  const classViolations: Violation[] = [];
  for (const cls of uniqueClasses) {
    for (const rule of rulesData.rules) {
      const patterns = rule.patterns ?? (rule.pattern ? [rule.pattern] : []);
      for (const pattern of patterns) {
        if (cls.includes(pattern)) {
          classViolations.push({
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

  // Check structural issues
  const structuralIssues = checkStructuralIssues(html);

  // Build summary
  const bySeverity: Record<string, number> = {};
  for (const v of classViolations) {
    bySeverity[v.severity] = (bySeverity[v.severity] || 0) + 1;
  }
  for (const s of structuralIssues) {
    bySeverity[s.severity] = (bySeverity[s.severity] || 0) + 1;
  }

  return {
    classViolations,
    structuralIssues,
    summary: {
      totalClasses: allClasses.length,
      uniqueClasses: uniqueClasses.length,
      violationCount: classViolations.length,
      structuralIssueCount: structuralIssues.length,
      bySeverity,
    },
  };
}
