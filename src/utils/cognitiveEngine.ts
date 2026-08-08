import { Concept, Student, TopicPerformance, CognitiveDebtMetrics, PeerMatch } from '../types';

/**
 * Calculates raw behavior score (0-100) based on retries, time-on-task, hesitation, avoidance
 */
export function calculateBehaviorScore(behavior: TopicPerformance['behavior']): number {
  let score = 100;
  
  // Quiz retries penalty (each retry above 1 reduces score)
  if (behavior.quizRetries > 1) {
    score -= (behavior.quizRetries - 1) * 10;
  }
  
  // Hesitation clicks penalty
  score -= behavior.hesitationClicks * 2;

  // Time on task (ideal is 15-30 mins; if excessive e.g. > 45 mins, indicates struggle)
  if (behavior.avgTimeOnTaskMin > 45) {
    score -= 15;
  } else if (behavior.avgTimeOnTaskMin < 5 && behavior.avgTimeOnTaskMin > 0) {
    score -= 10; // rushed through
  }

  // Avoidance days penalty
  if (behavior.avoidanceDays > 5) {
    score -= (behavior.avoidanceDays - 5) * 3;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Calculates NLP Sentiment score (0-100) from Q&A phrasing logs
 */
export function calculateNLPSentimentScore(perf: TopicPerformance): number {
  if (!perf.qaLogs || perf.qaLogs.length === 0) {
    // Default to assessment score if no Q&A recorded
    return perf.assessmentScore;
  }

  const totalSentiment = perf.qaLogs.reduce((sum, log) => sum + log.sentimentScore, 0);
  const avg = totalSentiment / perf.qaLogs.length;
  return Math.round(avg * 100);
}

/**
 * Calculates decay constant lambda based on difficulty
 */
function getDecayLambda(concept: Concept): number {
  switch (concept.difficulty) {
    case 'Advanced': return 0.05;
    case 'Intermediate': return 0.035;
    case 'Basic': default: return 0.025;
  }
}

/**
 * Calculates downstream dependents count for a concept in the DAG
 */
export function getDownstreamDependentsCount(conceptId: string, concepts: Concept[]): number {
  let count = 0;
  const visited = new Set<string>();

  function traverse(currId: string) {
    for (const c of concepts) {
      if (c.prerequisites.includes(currId) && !visited.has(c.id)) {
        visited.add(c.id);
        count++;
        traverse(c.id);
      }
    }
  }

  traverse(conceptId);
  return count;
}

/**
 * Backtracks prerequisite chain to find true root cause concept
 */
export function findRootCause(
  targetConceptId: string,
  student: Student,
  conceptsMap: Map<string, Concept>
): { rootCauseId: string; rootCauseName: string; isSelf: boolean } {
  const targetConcept = conceptsMap.get(targetConceptId);
  if (!targetConcept || targetConcept.prerequisites.length === 0) {
    return {
      rootCauseId: targetConceptId,
      rootCauseName: targetConcept?.name || targetConceptId,
      isSelf: true
    };
  }

  let lowestScore = 999;
  let lowestConceptId = targetConceptId;

  function evaluateNode(cId: string) {
    const perf = student.performances[cId];
    if (perf) {
      const bScore = calculateBehaviorScore(perf.behavior);
      const nlpScore = calculateNLPSentimentScore(perf);
      const rawScore = 0.25 * perf.attendancePct + 0.35 * perf.assessmentScore + 0.20 * bScore + 0.20 * nlpScore;
      if (rawScore < lowestScore) {
        lowestScore = rawScore;
        lowestConceptId = cId;
      }
    }

    const cObj = conceptsMap.get(cId);
    if (cObj && cObj.prerequisites) {
      for (const preId of cObj.prerequisites) {
        evaluateNode(preId);
      }
    }
  }

  evaluateNode(targetConceptId);

  const lowestObj = conceptsMap.get(lowestConceptId);
  return {
    rootCauseId: lowestConceptId,
    rootCauseName: lowestObj ? lowestObj.name : lowestConceptId,
    isSelf: lowestConceptId === targetConceptId
  };
}

/**
 * Computes full Cognitive Debt Metrics for a student across a single concept
 */
export function computeCognitiveDebtMetrics(
  student: Student,
  concept: Concept,
  conceptsList: Concept[]
): CognitiveDebtMetrics {
  const perf = student.performances[concept.id] || {
    conceptId: concept.id,
    attendancePct: 80,
    assessmentScore: 70,
    behavior: { quizRetries: 1, avgTimeOnTaskMin: 20, hesitationClicks: 2, avoidanceDays: 0 },
    qaLogs: [],
    lastStudiedDaysAgo: 2
  };

  const behaviorScore = calculateBehaviorScore(perf.behavior);
  const nlpSentimentScore = calculateNLPSentimentScore(perf);

  // Raw weighted score (4 signals)
  const confidenceScore = Math.round(
    0.25 * perf.attendancePct +
    0.35 * perf.assessmentScore +
    0.20 * behaviorScore +
    0.20 * nlpSentimentScore
  );

  // Exponential decay curve: S_decayed = S_0 * e^(-lambda * t)
  const lambda = getDecayLambda(concept);
  const t = perf.lastStudiedDaysAgo;
  const decayedConfidenceScore = Math.max(0, Math.min(100, Math.round(confidenceScore * Math.exp(-lambda * t))));

  // Days until critical threshold (< 50)
  let daysUntilCritical = 0;
  if (decayedConfidenceScore < 50) {
    daysUntilCritical = 0; // Already critical
  } else {
    // 50 = S_0 * e^(-lambda * t_crit) => t_crit = ln(S_0 / 50) / lambda
    const totalDaysToCritical = Math.log(confidenceScore / 50) / lambda;
    daysUntilCritical = Math.max(0, Math.round(totalDaysToCritical - t));
  }

  // Downstream dependents count
  const downstreamCount = getDownstreamDependentsCount(concept.id, conceptsList);

  // Compounding risk score = (100 - decayedConfidence) * (1 + 0.5 * downstreamCount)
  const compoundingRiskScore = Math.round((100 - decayedConfidenceScore) * (1 + 0.5 * downstreamCount));

  // Root cause determination
  const conceptsMap = new Map(conceptsList.map(c => [c.id, c]));
  const rootCauseRes = findRootCause(concept.id, student, conceptsMap);

  // Silence alert (avoidance > 6 days and no questions despite low assessment)
  const silenceAlert = perf.behavior.avoidanceDays >= 6 || (perf.qaLogs.length === 0 && perf.assessmentScore < 60);

  return {
    conceptId: concept.id,
    conceptName: concept.name,
    subjectId: concept.subjectId,
    attendancePct: perf.attendancePct,
    assessmentScore: perf.assessmentScore,
    behaviorScore,
    nlpSentimentScore,
    confidenceScore,
    decayedConfidenceScore,
    daysUntilCritical,
    compoundingRiskScore,
    downstreamDependentsCount: downstreamCount,
    isRootCause: rootCauseRes.isSelf,
    rootCauseConceptId: rootCauseRes.rootCauseId,
    rootCauseConceptName: rootCauseRes.rootCauseName,
    silenceAlert,
    decayRate: lambda
  };
}

/**
 * Finds top peer mentor candidates for a struggling student on a root cause concept
 */
export function findPeerMatches(
  strugglingStudent: Student,
  rootCauseConceptId: string,
  allStudents: Student[],
  concept: Concept
): PeerMatch[] {
  const matches: PeerMatch[] = [];

  for (const peer of allStudents) {
    if (peer.id === strugglingStudent.id) continue;

    const peerPerf = peer.performances[rootCauseConceptId];
    if (!peerPerf) continue;

    const bScore = calculateBehaviorScore(peerPerf.behavior);
    const nlpScore = calculateNLPSentimentScore(peerPerf);
    const score = 0.25 * peerPerf.attendancePct + 0.35 * peerPerf.assessmentScore + 0.20 * bScore + 0.20 * nlpScore;

    // High mastery condition
    if (score >= 82) {
      matches.push({
        id: `pm-${strugglingStudent.id}-${peer.id}-${rootCauseConceptId}`,
        strugglingStudentId: strugglingStudent.id,
        strugglingStudentName: strugglingStudent.name,
        strugglingStudentAvatar: strugglingStudent.avatar,
        mentorStudentId: peer.id,
        mentorStudentName: peer.name,
        mentorStudentAvatar: peer.avatar,
        conceptId: rootCauseConceptId,
        conceptName: concept.name,
        masteredDaysAgo: peerPerf.lastStudiedDaysAgo || 1,
        icebreakerPrompt: `Hey ${peer.name}! I saw you recently mastered ${concept.name}. Could you walk me through your intuitive trick for solving these step-by-step?`,
        practiceChallenge: `Solve a 3-step practice problem together on ${concept.name} and explain the underlying reasoning!`,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
    }
  }

  // Sort by highest recent score
  return matches.slice(0, 3);
}
