import type { Skill } from "@/types/portfolio";

const skillLevelRank: Record<Skill["level"], number> = {
  Advanced: 0,
  Strong: 1,
  Growing: 2,
};

export function getOrderedSkillNames(skills: Skill[], limit?: number): string[] {
  const seen = new Set<string>();
  const orderedNames = skills
    .map((skill, index) => ({ index, skill }))
    .sort((first, second) => {
      const levelDifference = skillLevelRank[first.skill.level] - skillLevelRank[second.skill.level];
      return levelDifference || first.index - second.index;
    })
    .map(({ skill }) => skill.name.trim())
    .filter((name) => {
      const key = name.toLowerCase();

      if (!name || seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });

  return typeof limit === "number" ? orderedNames.slice(0, limit) : orderedNames;
}
