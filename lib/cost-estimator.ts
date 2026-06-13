import { defectTaxonomy, type DefectClass } from "./defect-taxonomy";

export type RepairCostEstimate = {
  estimatedRepairCostKZT: number;
  costExplanation: string;
  disclaimer: string;
};

const disclaimer =
  "Оценка является ориентиром для приоритизации, а не финальной сметой закупки";

export function estimateRepairCost(
  defectClass: DefectClass,
  severity: number,
  description = ""
): RepairCostEstimate {
  const taxonomy = defectTaxonomy[defectClass];
  const sizeMultiplier = getSizeMultiplier(description);
  const severityMultiplier = severity >= 85 ? 1.25 : severity >= 70 ? 1.12 : 1;
  const rule = taxonomy.costRule;

  if (rule.type === "area") {
    const estimatedAreaM2 = Math.max(
      1,
      Math.round((1.5 + severity / 22) * sizeMultiplier)
    );
    const cost = roundToThousand(
      rule.baseKZTPerM2 * estimatedAreaM2 * severityMultiplier
    );

    return {
      estimatedRepairCostKZT: cost,
      costExplanation: `${taxonomy.labelRu}: ${rule.baseKZTPerM2.toLocaleString("ru-RU")} KZT за м2 * ориентировочно ${estimatedAreaM2} м2 с учетом severity ${severity}/100.`,
      disclaimer
    };
  }

  if (rule.type === "range") {
    const rangePosition = Math.min(1, Math.max(0, severity / 100));
    const cost = roundToThousand(
      (rule.minKZT + (rule.maxKZT - rule.minKZT) * rangePosition) *
        sizeMultiplier
    );

    return {
      estimatedRepairCostKZT: cost,
      costExplanation: `${taxonomy.labelRu}: диапазон ${rule.minKZT.toLocaleString("ru-RU")}-${rule.maxKZT.toLocaleString("ru-RU")} KZT скорректирован по severity ${severity}/100.`,
      disclaimer
    };
  }

  return {
    estimatedRepairCostKZT: roundToThousand(rule.amountKZT * severityMultiplier),
    costExplanation: `${taxonomy.labelRu}: базовая фиксированная оценка ${rule.amountKZT.toLocaleString("ru-RU")} KZT скорректирована по severity ${severity}/100.`,
    disclaimer
  };
}

function getSizeMultiplier(description: string) {
  return /large|big|deep|huge|глубок|больш|крупн|огромн/i.test(description)
    ? 1.55
    : 1;
}

function roundToThousand(value: number) {
  return Math.round(value / 1000) * 1000;
}
