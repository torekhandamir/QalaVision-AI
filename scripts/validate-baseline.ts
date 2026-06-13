import { classifyDefectBaseline } from "../lib/baseline-classifier";
import { calculatePriority } from "../lib/priority-engine";
import { validationExamples } from "../lib/validation-examples";

let correctClassCount = 0;
let correctRiskCount = 0;

const rows = validationExamples.map((example, index) => {
  const prediction = classifyDefectBaseline({
    description: example.description,
    address: example.address,
    district: example.district
  });
  const priority = calculatePriority({
    defectClass: prediction.defectClass,
    address: example.address,
    description: example.description,
    district: example.district,
    hasPhoto: true,
    aiConfidence: prediction.confidence
  });
  const classOk = prediction.defectClass === example.expectedClass;
  const riskOk = priority.riskLevel === example.expectedRisk;

  if (classOk) correctClassCount += 1;
  if (riskOk) correctRiskCount += 1;

  return {
    "#": index + 1,
    expectedClass: example.expectedClass,
    predictedClass: prediction.defectClass,
    expectedRisk: example.expectedRisk,
    predictedRisk: priority.riskLevel,
    confidence: prediction.confidence,
    matchedKeywords: prediction.matchedKeywords.join(", "),
    status: classOk && riskOk ? "ok" : "check"
  };
});

const classAccuracy = correctClassCount / validationExamples.length;
const riskAccuracy = correctRiskCount / validationExamples.length;
const mistakes = rows.filter((row) => row.status !== "ok");

console.log("QalaVision baseline validation");
console.log(`Examples: ${validationExamples.length}`);
console.log(`Class accuracy: ${(classAccuracy * 100).toFixed(1)}%`);
console.log(`Risk accuracy: ${(riskAccuracy * 100).toFixed(1)}%`);
console.table(rows);

if (mistakes.length > 0) {
  console.log("Errors / cases for manual review:");
  console.table(mistakes);
}
