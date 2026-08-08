export type SubjectId = 'calculus' | 'physics';

export interface Concept {
  id: string;
  subjectId: SubjectId;
  subjectName: string;
  name: string;
  description: string;
  prerequisites: string[]; // Concept IDs
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  category: string;
}

export interface QALog {
  id: string;
  timestamp: string;
  conceptId: string;
  questionText: string;
  phrasingSentiment: 'confused' | 'hesitant' | 'neutral' | 'confident';
  sentimentScore: number; // 0 (confused) to 1 (confident)
  detectedKeywords: string[];
}

export interface BehavioralMetrics {
  quizRetries: number;
  avgTimeOnTaskMin: number;
  hesitationClicks: number;
  avoidanceDays: number;
}

export interface TopicPerformance {
  conceptId: string;
  attendancePct: number; // 0-100
  assessmentScore: number; // 0-100
  behavior: BehavioralMetrics;
  qaLogs: QALog[];
  lastStudiedDaysAgo: number;
  masteryTimestamp?: string; // ISO date string if mastered recently
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  grade: string;
  performances: Record<string, TopicPerformance>; // conceptId -> performance
  overallGpa: number;
  learningStyle: 'Visual-Analogy' | 'Step-by-Step' | 'Intuitive-Socratic';
}

export interface CognitiveDebtMetrics {
  conceptId: string;
  conceptName: string;
  subjectId: SubjectId;
  attendancePct: number;
  assessmentScore: number;
  behaviorScore: number; // 0-100
  nlpSentimentScore: number; // 0-100
  confidenceScore: number; // 0-100 weighted raw
  decayedConfidenceScore: number; // 0-100 after decay curve
  daysUntilCritical: number; // predicted days until score drops < 50
  compoundingRiskScore: number; // risk score factoring downstream concepts
  downstreamDependentsCount: number;
  isRootCause: boolean;
  rootCauseConceptId?: string;
  rootCauseConceptName?: string;
  silenceAlert: boolean;
  decayRate: number;
}

export interface PeerMatch {
  id: string;
  strugglingStudentId: string;
  strugglingStudentName: string;
  strugglingStudentAvatar: string;
  mentorStudentId: string;
  mentorStudentName: string;
  mentorStudentAvatar: string;
  conceptId: string;
  conceptName: string;
  masteredDaysAgo: number;
  icebreakerPrompt: string;
  practiceChallenge: string;
  status: 'pending' | 'connected' | 'completed';
  createdAt: string;
}

export interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GeneratedIntervention {
  studentId: string;
  studentName: string;
  conceptId: string;
  conceptName: string;
  rootCauseConceptId: string;
  rootCauseConceptName: string;
  title: string;
  summary: string;
  keyAnalogy: string;
  stepByStep: string[];
  practiceQuestions: PracticeQuestion[];
  peerCoachingStarter: string;
  generatedAt: string;
}

export type UserRole = 'teacher' | 'student';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  grade?: string;
  department?: string;
  securityToken?: string;
  loginTime?: string;
}
