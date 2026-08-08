import { Concept, Student, PeerMatch, GeneratedIntervention } from '../types';

export const SEEDED_CONCEPTS: Concept[] = [
  // Calculus Concepts
  {
    id: 'calc-1',
    subjectId: 'calculus',
    subjectName: 'Calculus I & II',
    name: 'Basic Differentiation',
    description: 'Power rule, limit definition of derivatives, and constant multiples.',
    prerequisites: [],
    difficulty: 'Basic',
    estimatedHours: 4,
    category: 'Derivatives'
  },
  {
    id: 'calc-2',
    subjectId: 'calculus',
    subjectName: 'Calculus I & II',
    name: 'Product & Quotient Rules',
    description: 'Differentiating products and quotients of functions u(x)v(x).',
    prerequisites: ['calc-1'],
    difficulty: 'Intermediate',
    estimatedHours: 5,
    category: 'Derivatives'
  },
  {
    id: 'calc-3',
    subjectId: 'calculus',
    subjectName: 'Calculus I & II',
    name: 'Chain Rule',
    description: 'Differentiating composite functions f(g(x)).',
    prerequisites: ['calc-1'],
    difficulty: 'Intermediate',
    estimatedHours: 5,
    category: 'Derivatives'
  },
  {
    id: 'calc-4',
    subjectId: 'calculus',
    subjectName: 'Calculus I & II',
    name: 'Basic Integration',
    description: 'Antiderivatives, fundamental theorem of calculus, u-substitution.',
    prerequisites: ['calc-1'],
    difficulty: 'Basic',
    estimatedHours: 6,
    category: 'Integrals'
  },
  {
    id: 'calc-5',
    subjectId: 'calculus',
    subjectName: 'Calculus I & II',
    name: 'Integration by Parts',
    description: 'Integrating products using integral of u dv = uv - integral of v du.',
    prerequisites: ['calc-2', 'calc-4'],
    difficulty: 'Advanced',
    estimatedHours: 8,
    category: 'Integrals'
  },
  {
    id: 'calc-6',
    subjectId: 'calculus',
    subjectName: 'Calculus I & II',
    name: 'Differential Equations',
    description: 'First-order separable DEs and initial value problems.',
    prerequisites: ['calc-3', 'calc-5'],
    difficulty: 'Advanced',
    estimatedHours: 10,
    category: 'Differential Equations'
  },

  // Physics Concepts
  {
    id: 'phys-1',
    subjectId: 'physics',
    subjectName: 'Physics: Mechanics',
    name: 'Vector Operations',
    description: 'Vector addition, dot products, cross products, and components.',
    prerequisites: [],
    difficulty: 'Basic',
    estimatedHours: 4,
    category: 'Kinematics'
  },
  {
    id: 'phys-2',
    subjectId: 'physics',
    subjectName: 'Physics: Mechanics',
    name: '1D & 2D Kinematics',
    description: 'Displacement, velocity, acceleration, and projectile motion equations.',
    prerequisites: ['phys-1'],
    difficulty: 'Intermediate',
    estimatedHours: 6,
    category: 'Kinematics'
  },
  {
    id: 'phys-3',
    subjectId: 'physics',
    subjectName: 'Physics: Mechanics',
    name: "Newton's Laws of Motion",
    description: 'Force diagrams, friction, tension, and mass-acceleration relations.',
    prerequisites: ['phys-2'],
    difficulty: 'Intermediate',
    estimatedHours: 7,
    category: 'Dynamics'
  },
  {
    id: 'phys-4',
    subjectId: 'physics',
    subjectName: 'Physics: Mechanics',
    name: 'Work & Energy Theorem',
    description: 'Kinetic energy, potential energy, work done by variable forces.',
    prerequisites: ['phys-3', 'calc-4'],
    difficulty: 'Intermediate',
    estimatedHours: 7,
    category: 'Energy'
  },
  {
    id: 'phys-5',
    subjectId: 'physics',
    subjectName: 'Physics: Mechanics',
    name: 'Momentum & Collisions',
    description: 'Impulse, elastic and inelastic collisions in 1D/2D.',
    prerequisites: ['phys-3'],
    difficulty: 'Advanced',
    estimatedHours: 8,
    category: 'Momentum'
  },
  {
    id: 'phys-6',
    subjectId: 'physics',
    subjectName: 'Physics: Mechanics',
    name: 'Rotational Dynamics',
    description: 'Torque, moment of inertia, angular momentum, and rolling motion.',
    prerequisites: ['phys-3', 'phys-5'],
    difficulty: 'Advanced',
    estimatedHours: 9,
    category: 'Rotation'
  }
];

export const SEEDED_STUDENTS: Student[] = [
  {
    id: 'std-1',
    name: 'Alex Chen',
    email: 'alex.chen@university.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    grade: 'Undergraduate Soph',
    learningStyle: 'Step-by-Step',
    overallGpa: 3.4,
    performances: {
      'calc-1': {
        conceptId: 'calc-1',
        attendancePct: 95,
        assessmentScore: 92,
        behavior: { quizRetries: 1, avgTimeOnTaskMin: 18, hesitationClicks: 1, avoidanceDays: 0 },
        qaLogs: [{ id: 'q1', timestamp: '2026-08-01', conceptId: 'calc-1', questionText: 'Does power rule apply to negative exponents too?', phrasingSentiment: 'confident', sentimentScore: 0.9, detectedKeywords: ['power rule', 'negative exponents'] }],
        lastStudiedDaysAgo: 2,
        masteryTimestamp: '2026-08-01T10:00:00Z'
      },
      'calc-2': {
        conceptId: 'calc-2',
        attendancePct: 62,
        assessmentScore: 48,
        behavior: { quizRetries: 4, avgTimeOnTaskMin: 42, hesitationClicks: 12, avoidanceDays: 6 },
        qaLogs: [{ id: 'q2', timestamp: '2026-08-05', conceptId: 'calc-2', questionText: 'I keep mixing up which function gets differentiated first in product rule.', phrasingSentiment: 'confused', sentimentScore: 0.25, detectedKeywords: ['mixing up', 'product rule'] }],
        lastStudiedDaysAgo: 5
      },
      'calc-3': {
        conceptId: 'calc-3',
        attendancePct: 88,
        assessmentScore: 84,
        behavior: { quizRetries: 2, avgTimeOnTaskMin: 22, hesitationClicks: 3, avoidanceDays: 1 },
        qaLogs: [],
        lastStudiedDaysAgo: 3
      },
      'calc-4': {
        conceptId: 'calc-4',
        attendancePct: 90,
        assessmentScore: 86,
        behavior: { quizRetries: 1, avgTimeOnTaskMin: 20, hesitationClicks: 2, avoidanceDays: 1 },
        qaLogs: [],
        lastStudiedDaysAgo: 3
      },
      'calc-5': {
        conceptId: 'calc-5',
        attendancePct: 70,
        assessmentScore: 42,
        behavior: { quizRetries: 5, avgTimeOnTaskMin: 55, hesitationClicks: 18, avoidanceDays: 8 },
        qaLogs: [{ id: 'q3', timestamp: '2026-08-06', conceptId: 'calc-5', questionText: 'Why does my answer blow up whenever I choose u = x^2 in integration by parts?', phrasingSentiment: 'confused', sentimentScore: 0.2, detectedKeywords: ['blow up', 'integration by parts'] }],
        lastStudiedDaysAgo: 6
      },
      'calc-6': {
        conceptId: 'calc-6',
        attendancePct: 65,
        assessmentScore: 35,
        behavior: { quizRetries: 6, avgTimeOnTaskMin: 60, hesitationClicks: 22, avoidanceDays: 9 },
        qaLogs: [],
        lastStudiedDaysAgo: 8
      },
      'phys-1': {
        conceptId: 'phys-1',
        attendancePct: 94,
        assessmentScore: 90,
        behavior: { quizRetries: 1, avgTimeOnTaskMin: 15, hesitationClicks: 1, avoidanceDays: 1 },
        qaLogs: [],
        lastStudiedDaysAgo: 2
      },
      'phys-2': {
        conceptId: 'phys-2',
        attendancePct: 88,
        assessmentScore: 82,
        behavior: { quizRetries: 2, avgTimeOnTaskMin: 24, hesitationClicks: 4, avoidanceDays: 2 },
        qaLogs: [],
        lastStudiedDaysAgo: 3
      },
      'phys-3': {
        conceptId: 'phys-3',
        attendancePct: 82,
        assessmentScore: 78,
        behavior: { quizRetries: 2, avgTimeOnTaskMin: 28, hesitationClicks: 5, avoidanceDays: 3 },
        qaLogs: [],
        lastStudiedDaysAgo: 4
      },
      'phys-4': {
        conceptId: 'phys-4',
        attendancePct: 75,
        assessmentScore: 68,
        behavior: { quizRetries: 3, avgTimeOnTaskMin: 35, hesitationClicks: 8, avoidanceDays: 4 },
        qaLogs: [],
        lastStudiedDaysAgo: 4
      },
      'phys-5': {
        conceptId: 'phys-5',
        attendancePct: 70,
        assessmentScore: 60,
        behavior: { quizRetries: 3, avgTimeOnTaskMin: 40, hesitationClicks: 10, avoidanceDays: 5 },
        qaLogs: [],
        lastStudiedDaysAgo: 5
      },
      'phys-6': {
        conceptId: 'phys-6',
        attendancePct: 60,
        assessmentScore: 45,
        behavior: { quizRetries: 4, avgTimeOnTaskMin: 50, hesitationClicks: 15, avoidanceDays: 7 },
        qaLogs: [],
        lastStudiedDaysAgo: 6
      }
    }
  },
  {
    id: 'std-2',
    name: 'Maya Patel',
    email: 'maya.patel@university.edu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    grade: 'Undergraduate Fresh',
    learningStyle: 'Visual-Analogy',
    overallGpa: 3.9,
    performances: {
      'calc-1': {
        conceptId: 'calc-1',
        attendancePct: 100,
        assessmentScore: 98,
        behavior: { quizRetries: 1, avgTimeOnTaskMin: 12, hesitationClicks: 0, avoidanceDays: 0 },
        qaLogs: [],
        lastStudiedDaysAgo: 1,
        masteryTimestamp: '2026-08-07T14:00:00Z'
      },
      'calc-2': {
        conceptId: 'calc-2',
        attendancePct: 98,
        assessmentScore: 95,
        behavior: { quizRetries: 1, avgTimeOnTaskMin: 15, hesitationClicks: 1, avoidanceDays: 0 },
        qaLogs: [],
        lastStudiedDaysAgo: 1,
        masteryTimestamp: '2026-08-07T15:00:00Z'
      },
      'calc-3': {
        conceptId: 'calc-3',
        attendancePct: 96,
        assessmentScore: 94,
        behavior: { quizRetries: 1, avgTimeOnTaskMin: 16, hesitationClicks: 1, avoidanceDays: 0 },
        qaLogs: [],
        lastStudiedDaysAgo: 1,
        masteryTimestamp: '2026-08-06T11:00:00Z'
      },
      'calc-4': {
        conceptId: 'calc-4',
        attendancePct: 98,
        assessmentScore: 96,
        behavior: { quizRetries: 1, avgTimeOnTaskMin: 14, hesitationClicks: 0, avoidanceDays: 0 },
        qaLogs: [],
        lastStudiedDaysAgo: 1,
        masteryTimestamp: '2026-08-06T16:00:00Z'
      },
      'calc-5': {
        conceptId: 'calc-5',
        attendancePct: 95,
        assessmentScore: 92,
        behavior: { quizRetries: 1, avgTimeOnTaskMin: 20, hesitationClicks: 2, avoidanceDays: 1 },
        qaLogs: [],
        lastStudiedDaysAgo: 2,
        masteryTimestamp: '2026-08-06T18:00:00Z'
      },
      'calc-6': {
        conceptId: 'calc-6',
        attendancePct: 90,
        assessmentScore: 88,
        behavior: { quizRetries: 2, avgTimeOnTaskMin: 25, hesitationClicks: 3, avoidanceDays: 1 },
        qaLogs: [],
        lastStudiedDaysAgo: 2
      },
      'phys-1': { conceptId: 'phys-1', attendancePct: 100, assessmentScore: 96, behavior: { quizRetries: 1, avgTimeOnTaskMin: 12, hesitationClicks: 0, avoidanceDays: 0 }, qaLogs: [], lastStudiedDaysAgo: 1 },
      'phys-2': { conceptId: 'phys-2', attendancePct: 98, assessmentScore: 94, behavior: { quizRetries: 1, avgTimeOnTaskMin: 15, hesitationClicks: 1, avoidanceDays: 1 }, qaLogs: [], lastStudiedDaysAgo: 1 },
      'phys-3': { conceptId: 'phys-3', attendancePct: 96, assessmentScore: 92, behavior: { quizRetries: 1, avgTimeOnTaskMin: 18, hesitationClicks: 1, avoidanceDays: 1 }, qaLogs: [], lastStudiedDaysAgo: 2 },
      'phys-4': { conceptId: 'phys-4', attendancePct: 95, assessmentScore: 90, behavior: { quizRetries: 1, avgTimeOnTaskMin: 20, hesitationClicks: 2, avoidanceDays: 2 }, qaLogs: [], lastStudiedDaysAgo: 2 },
      'phys-5': { conceptId: 'phys-5', attendancePct: 92, assessmentScore: 89, behavior: { quizRetries: 2, avgTimeOnTaskMin: 22, hesitationClicks: 2, avoidanceDays: 2 }, qaLogs: [], lastStudiedDaysAgo: 2 },
      'phys-6': { conceptId: 'phys-6', attendancePct: 88, assessmentScore: 85, behavior: { quizRetries: 2, avgTimeOnTaskMin: 28, hesitationClicks: 4, avoidanceDays: 3 }, qaLogs: [], lastStudiedDaysAgo: 3 }
    }
  },
  {
    id: 'std-3',
    name: 'Marcus Vance',
    email: 'marcus.vance@university.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    grade: 'Undergraduate Junior',
    learningStyle: 'Intuitive-Socratic',
    overallGpa: 2.8,
    performances: {
      'calc-1': { conceptId: 'calc-1', attendancePct: 85, assessmentScore: 80, behavior: { quizRetries: 2, avgTimeOnTaskMin: 22, hesitationClicks: 4, avoidanceDays: 1 }, qaLogs: [], lastStudiedDaysAgo: 3 },
      'calc-2': { conceptId: 'calc-2', attendancePct: 78, assessmentScore: 72, behavior: { quizRetries: 3, avgTimeOnTaskMin: 28, hesitationClicks: 6, avoidanceDays: 2 }, qaLogs: [], lastStudiedDaysAgo: 3 },
      'calc-3': { conceptId: 'calc-3', attendancePct: 70, assessmentScore: 65, behavior: { quizRetries: 3, avgTimeOnTaskMin: 32, hesitationClicks: 8, avoidanceDays: 4 }, qaLogs: [], lastStudiedDaysAgo: 4 },
      'calc-4': { conceptId: 'calc-4', attendancePct: 82, assessmentScore: 78, behavior: { quizRetries: 2, avgTimeOnTaskMin: 24, hesitationClicks: 5, avoidanceDays: 2 }, qaLogs: [], lastStudiedDaysAgo: 3 },
      'calc-5': { conceptId: 'calc-5', attendancePct: 60, assessmentScore: 50, behavior: { quizRetries: 4, avgTimeOnTaskMin: 48, hesitationClicks: 16, avoidanceDays: 7 }, qaLogs: [{ id: 'q4', timestamp: '2026-08-04', conceptId: 'calc-5', questionText: 'Why do we need the LIATE rule in integration by parts?', phrasingSentiment: 'hesitant', sentimentScore: 0.4, detectedKeywords: ['LIATE rule'] }], lastStudiedDaysAgo: 5 },
      'calc-6': { conceptId: 'calc-6', attendancePct: 55, assessmentScore: 40, behavior: { quizRetries: 5, avgTimeOnTaskMin: 52, hesitationClicks: 20, avoidanceDays: 8 }, qaLogs: [], lastStudiedDaysAgo: 7 },
      'phys-1': { conceptId: 'phys-1', attendancePct: 90, assessmentScore: 88, behavior: { quizRetries: 1, avgTimeOnTaskMin: 18, hesitationClicks: 2, avoidanceDays: 1 }, qaLogs: [], lastStudiedDaysAgo: 2 },
      'phys-2': { conceptId: 'phys-2', attendancePct: 50, assessmentScore: 42, behavior: { quizRetries: 5, avgTimeOnTaskMin: 50, hesitationClicks: 18, avoidanceDays: 8 }, qaLogs: [{ id: 'q5', timestamp: '2026-08-03', conceptId: 'phys-2', questionText: 'I get confused decomposing 2D velocity vectors into x and y components.', phrasingSentiment: 'confused', sentimentScore: 0.22, detectedKeywords: ['decomposing', 'vectors'] }], lastStudiedDaysAgo: 6 },
      'phys-3': { conceptId: 'phys-3', attendancePct: 48, assessmentScore: 38, behavior: { quizRetries: 6, avgTimeOnTaskMin: 58, hesitationClicks: 24, avoidanceDays: 9 }, qaLogs: [], lastStudiedDaysAgo: 7 },
      'phys-4': { conceptId: 'phys-4', attendancePct: 45, assessmentScore: 32, behavior: { quizRetries: 6, avgTimeOnTaskMin: 60, hesitationClicks: 25, avoidanceDays: 10 }, qaLogs: [], lastStudiedDaysAgo: 8 },
      'phys-5': { conceptId: 'phys-5', attendancePct: 40, assessmentScore: 30, behavior: { quizRetries: 7, avgTimeOnTaskMin: 65, hesitationClicks: 28, avoidanceDays: 11 }, qaLogs: [], lastStudiedDaysAgo: 9 },
      'phys-6': { conceptId: 'phys-6', attendancePct: 35, assessmentScore: 25, behavior: { quizRetries: 8, avgTimeOnTaskMin: 70, hesitationClicks: 30, avoidanceDays: 12 }, qaLogs: [], lastStudiedDaysAgo: 10 }
    }
  },
  {
    id: 'std-4',
    name: 'Sophia Rodriguez',
    email: 'sophia.r@university.edu',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    grade: 'Undergraduate Soph',
    learningStyle: 'Step-by-Step',
    overallGpa: 3.6,
    performances: {
      'calc-1': { conceptId: 'calc-1', attendancePct: 98, assessmentScore: 94, behavior: { quizRetries: 1, avgTimeOnTaskMin: 16, hesitationClicks: 1, avoidanceDays: 0 }, qaLogs: [], lastStudiedDaysAgo: 1 },
      'calc-2': { conceptId: 'calc-2', attendancePct: 92, assessmentScore: 88, behavior: { quizRetries: 2, avgTimeOnTaskMin: 22, hesitationClicks: 3, avoidanceDays: 1 }, qaLogs: [], lastStudiedDaysAgo: 2 },
      'calc-3': { conceptId: 'calc-3', attendancePct: 90, assessmentScore: 86, behavior: { quizRetries: 2, avgTimeOnTaskMin: 20, hesitationClicks: 2, avoidanceDays: 1 }, qaLogs: [], lastStudiedDaysAgo: 2 },
      'calc-4': { conceptId: 'calc-4', attendancePct: 94, assessmentScore: 90, behavior: { quizRetries: 1, avgTimeOnTaskMin: 18, hesitationClicks: 2, avoidanceDays: 1 }, qaLogs: [], lastStudiedDaysAgo: 2 },
      'calc-5': { conceptId: 'calc-5', attendancePct: 88, assessmentScore: 84, behavior: { quizRetries: 2, avgTimeOnTaskMin: 26, hesitationClicks: 4, avoidanceDays: 2 }, qaLogs: [], lastStudiedDaysAgo: 3 },
      'calc-6': { conceptId: 'calc-6', attendancePct: 85, assessmentScore: 82, behavior: { quizRetries: 2, avgTimeOnTaskMin: 28, hesitationClicks: 5, avoidanceDays: 3 }, qaLogs: [], lastStudiedDaysAgo: 3 },
      'phys-1': { conceptId: 'phys-1', attendancePct: 96, assessmentScore: 92, behavior: { quizRetries: 1, avgTimeOnTaskMin: 14, hesitationClicks: 1, avoidanceDays: 1 }, qaLogs: [], lastStudiedDaysAgo: 2 },
      'phys-2': { conceptId: 'phys-2', attendancePct: 94, assessmentScore: 90, behavior: { quizRetries: 1, avgTimeOnTaskMin: 18, hesitationClicks: 2, avoidanceDays: 2 }, qaLogs: [], lastStudiedDaysAgo: 2 },
      'phys-3': { conceptId: 'phys-3', attendancePct: 90, assessmentScore: 85, behavior: { quizRetries: 2, avgTimeOnTaskMin: 22, hesitationClicks: 3, avoidanceDays: 2 }, qaLogs: [], lastStudiedDaysAgo: 3 },
      'phys-4': { conceptId: 'phys-4', attendancePct: 88, assessmentScore: 84, behavior: { quizRetries: 2, avgTimeOnTaskMin: 25, hesitationClicks: 4, avoidanceDays: 3 }, qaLogs: [], lastStudiedDaysAgo: 3 },
      'phys-5': { conceptId: 'phys-5', attendancePct: 82, assessmentScore: 78, behavior: { quizRetries: 3, avgTimeOnTaskMin: 30, hesitationClicks: 6, avoidanceDays: 4 }, qaLogs: [], lastStudiedDaysAgo: 4 },
      'phys-6': { conceptId: 'phys-6', attendancePct: 78, assessmentScore: 72, behavior: { quizRetries: 3, avgTimeOnTaskMin: 35, hesitationClicks: 8, avoidanceDays: 5 }, qaLogs: [], lastStudiedDaysAgo: 5 }
    }
  },
  {
    id: 'std-5',
    name: 'Devon Wright',
    email: 'devon.w@university.edu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    grade: 'Undergraduate Fresh',
    learningStyle: 'Visual-Analogy',
    overallGpa: 2.9,
    performances: {
      'calc-1': { conceptId: 'calc-1', attendancePct: 75, assessmentScore: 68, behavior: { quizRetries: 3, avgTimeOnTaskMin: 30, hesitationClicks: 7, avoidanceDays: 3 }, qaLogs: [], lastStudiedDaysAgo: 4 },
      'calc-2': { conceptId: 'calc-2', attendancePct: 55, assessmentScore: 42, behavior: { quizRetries: 5, avgTimeOnTaskMin: 45, hesitationClicks: 15, avoidanceDays: 7 }, qaLogs: [], lastStudiedDaysAgo: 6 },
      'calc-3': { conceptId: 'calc-3', attendancePct: 70, assessmentScore: 62, behavior: { quizRetries: 3, avgTimeOnTaskMin: 32, hesitationClicks: 8, avoidanceDays: 4 }, qaLogs: [], lastStudiedDaysAgo: 5 },
      'calc-4': { conceptId: 'calc-4', attendancePct: 80, assessmentScore: 75, behavior: { quizRetries: 2, avgTimeOnTaskMin: 25, hesitationClicks: 5, avoidanceDays: 3 }, qaLogs: [], lastStudiedDaysAgo: 4 },
      'calc-5': { conceptId: 'calc-5', attendancePct: 50, assessmentScore: 38, behavior: { quizRetries: 6, avgTimeOnTaskMin: 55, hesitationClicks: 20, avoidanceDays: 8 }, qaLogs: [], lastStudiedDaysAgo: 7 },
      'calc-6': { conceptId: 'calc-6', attendancePct: 45, assessmentScore: 30, behavior: { quizRetries: 7, avgTimeOnTaskMin: 60, hesitationClicks: 24, avoidanceDays: 10 }, qaLogs: [], lastStudiedDaysAgo: 9 },
      'phys-1': { conceptId: 'phys-1', attendancePct: 88, assessmentScore: 84, behavior: { quizRetries: 2, avgTimeOnTaskMin: 20, hesitationClicks: 3, avoidanceDays: 2 }, qaLogs: [], lastStudiedDaysAgo: 3 },
      'phys-2': { conceptId: 'phys-2', attendancePct: 82, assessmentScore: 76, behavior: { quizRetries: 2, avgTimeOnTaskMin: 25, hesitationClicks: 5, avoidanceDays: 3 }, qaLogs: [], lastStudiedDaysAgo: 4 },
      'phys-3': { conceptId: 'phys-3', attendancePct: 75, assessmentScore: 70, behavior: { quizRetries: 3, avgTimeOnTaskMin: 30, hesitationClicks: 7, avoidanceDays: 4 }, qaLogs: [], lastStudiedDaysAgo: 4 },
      'phys-4': { conceptId: 'phys-4', attendancePct: 65, assessmentScore: 55, behavior: { quizRetries: 4, avgTimeOnTaskMin: 40, hesitationClicks: 12, avoidanceDays: 6 }, qaLogs: [], lastStudiedDaysAgo: 6 },
      'phys-5': { conceptId: 'phys-5', attendancePct: 60, assessmentScore: 50, behavior: { quizRetries: 5, avgTimeOnTaskMin: 45, hesitationClicks: 15, avoidanceDays: 7 }, qaLogs: [], lastStudiedDaysAgo: 7 },
      'phys-6': { conceptId: 'phys-6', attendancePct: 50, assessmentScore: 40, behavior: { quizRetries: 6, avgTimeOnTaskMin: 50, hesitationClicks: 18, avoidanceDays: 8 }, qaLogs: [], lastStudiedDaysAgo: 8 }
    }
  },
  {
    id: 'std-6',
    name: 'Emily Zhang',
    email: 'emily.z@university.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    grade: 'Undergraduate Soph',
    learningStyle: 'Step-by-Step',
    overallGpa: 3.85,
    performances: {
      'calc-1': { conceptId: 'calc-1', attendancePct: 100, assessmentScore: 98, behavior: { quizRetries: 1, avgTimeOnTaskMin: 12, hesitationClicks: 0, avoidanceDays: 0 }, qaLogs: [], lastStudiedDaysAgo: 1, masteryTimestamp: '2026-08-07T09:00:00Z' },
      'calc-2': { conceptId: 'calc-2', attendancePct: 96, assessmentScore: 94, behavior: { quizRetries: 1, avgTimeOnTaskMin: 16, hesitationClicks: 1, avoidanceDays: 0 }, qaLogs: [], lastStudiedDaysAgo: 1, masteryTimestamp: '2026-08-07T12:00:00Z' },
      'calc-3': { conceptId: 'calc-3', attendancePct: 98, assessmentScore: 96, behavior: { quizRetries: 1, avgTimeOnTaskMin: 15, hesitationClicks: 0, avoidanceDays: 0 }, qaLogs: [], lastStudiedDaysAgo: 1, masteryTimestamp: '2026-08-06T10:00:00Z' },
      'calc-4': { conceptId: 'calc-4', attendancePct: 95, assessmentScore: 92, behavior: { quizRetries: 1, avgTimeOnTaskMin: 18, hesitationClicks: 1, avoidanceDays: 1 }, qaLogs: [], lastStudiedDaysAgo: 2 },
      'calc-5': { conceptId: 'calc-5', attendancePct: 94, assessmentScore: 90, behavior: { quizRetries: 1, avgTimeOnTaskMin: 22, hesitationClicks: 2, avoidanceDays: 1 }, qaLogs: [], lastStudiedDaysAgo: 2, masteryTimestamp: '2026-08-06T17:00:00Z' },
      'calc-6': { conceptId: 'calc-6', attendancePct: 92, assessmentScore: 88, behavior: { quizRetries: 2, avgTimeOnTaskMin: 25, hesitationClicks: 3, avoidanceDays: 2 }, qaLogs: [], lastStudiedDaysAgo: 2 },
      'phys-1': { conceptId: 'phys-1', attendancePct: 98, assessmentScore: 95, behavior: { quizRetries: 1, avgTimeOnTaskMin: 14, hesitationClicks: 0, avoidanceDays: 0 }, qaLogs: [], lastStudiedDaysAgo: 1 },
      'phys-2': { conceptId: 'phys-2', attendancePct: 96, assessmentScore: 93, behavior: { quizRetries: 1, avgTimeOnTaskMin: 16, hesitationClicks: 1, avoidanceDays: 1 }, qaLogs: [], lastStudiedDaysAgo: 1, masteryTimestamp: '2026-08-07T11:00:00Z' },
      'phys-3': { conceptId: 'phys-3', attendancePct: 95, assessmentScore: 91, behavior: { quizRetries: 1, avgTimeOnTaskMin: 19, hesitationClicks: 1, avoidanceDays: 1 }, qaLogs: [], lastStudiedDaysAgo: 2 },
      'phys-4': { conceptId: 'phys-4', attendancePct: 92, assessmentScore: 89, behavior: { quizRetries: 2, avgTimeOnTaskMin: 22, hesitationClicks: 2, avoidanceDays: 2 }, qaLogs: [], lastStudiedDaysAgo: 2 },
      'phys-5': { conceptId: 'phys-5', attendancePct: 90, assessmentScore: 87, behavior: { quizRetries: 2, avgTimeOnTaskMin: 24, hesitationClicks: 3, avoidanceDays: 2 }, qaLogs: [], lastStudiedDaysAgo: 2 },
      'phys-6': { conceptId: 'phys-6', attendancePct: 88, assessmentScore: 84, behavior: { quizRetries: 2, avgTimeOnTaskMin: 28, hesitationClicks: 4, avoidanceDays: 3 }, qaLogs: [], lastStudiedDaysAgo: 3 }
    }
  }
];

export const DEMO_PEER_MATCHES: PeerMatch[] = [
  {
    id: 'pm-demo-1',
    strugglingStudentId: 'std-1',
    strugglingStudentName: 'Alex Chen',
    strugglingStudentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    mentorStudentId: 'std-2',
    mentorStudentName: 'Maya Patel',
    mentorStudentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    conceptId: 'calc-2',
    conceptName: 'Product & Quotient Rules',
    masteredDaysAgo: 1,
    icebreakerPrompt: "Hey Maya! Alex is struggling with setting up Product Rule derivative terms. Since you mastered this yesterday (98% score), could you share your mental shortcut?",
    practiceChallenge: "Work together to differentiate f(x) = (3x^2 + 5)(2x - 1)^3 and verify each product component.",
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'pm-demo-2',
    strugglingStudentId: 'std-3',
    strugglingStudentName: 'Marcus Vance',
    strugglingStudentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    mentorStudentId: 'std-6',
    mentorStudentName: 'Emily Zhang',
    mentorStudentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    conceptId: 'phys-2',
    conceptName: '1D & 2D Kinematics',
    masteredDaysAgo: 1,
    icebreakerPrompt: "Hi Emily! Marcus is stuck decomposing 2D motion vectors into sine/cosine axes. Mind helping him visualize vector components?",
    practiceChallenge: "Draw a projectile launch trajectory at 30 degrees and solve for max height together.",
    status: 'connected',
    createdAt: new Date().toISOString()
  }
];

export const DEMO_INTERVENTIONS: GeneratedIntervention[] = [
  {
    studentId: 'std-1',
    studentName: 'Alex Chen',
    conceptId: 'calc-5',
    conceptName: 'Integration by Parts',
    rootCauseConceptId: 'calc-2',
    rootCauseConceptName: 'Product & Quotient Rules',
    title: 'Root-Cause Micro-Lesson: Rebuilding Product Rule Foundations',
    summary: 'Your difficulty in Integration by Parts is rooted in confusion when setting up product rule derivatives. Integration by Parts is simply the product rule in reverse (d(uv) = u dv + v du).',
    keyAnalogy: 'Think of Integration by Parts like an un-wrapping process: u is the layer you unwrap (differentiate until simple), and dv is the core package you integrate.',
    stepByStep: [
      'Step 1: Pick u using the LIATE order (Logarithms, Inverse trig, Algebraic, Trig, Exponentials).',
      'Step 2: Calculate du by taking the derivative of u (requires solid Product Rule knowledge!).',
      'Step 3: Integrate dv to find v.',
      'Step 4: Plug into uv - ∫ v du and verify that the remaining integral is simpler than the original.'
    ],
    practiceQuestions: [
      {
        id: 'pq-1',
        question: 'In the integral ∫ x * e^x dx, which choice for u follows the LIATE rule best?',
        options: ['u = e^x', 'u = x', 'u = x * e^x', 'u = dx'],
        correctIndex: 1,
        explanation: 'x is Algebraic (A) which comes before Exponential (E) in LIATE, making u = x the ideal choice because du = dx simplifies the expression.'
      },
      {
        id: 'pq-2',
        question: 'If u = x^2 and dv = cos(x)dx, what is v?',
        options: ['v = -sin(x)', 'v = sin(x)', 'v = 2x', 'v = -cos(x)'],
        correctIndex: 1,
        explanation: 'Integrating dv = cos(x)dx gives v = sin(x) (since the derivative of sin(x) is cos(x)).'
      },
      {
        id: 'pq-3',
        question: 'What is the product rule derivative of f(x) = x * sin(x)?',
        options: ['x * cos(x)', 'sin(x) + x * cos(x)', 'cos(x)', '1 * cos(x)'],
        correctIndex: 1,
        explanation: 'By product rule d/dx[u*v] = u\'v + uv\', d/dx[x*sin(x)] = 1*sin(x) + x*cos(x) = sin(x) + x*cos(x).'
      }
    ],
    peerCoachingStarter: "Maya Patel mastered Product Rule yesterday. Connect with Maya for a 5-minute peer chat!",
    generatedAt: new Date().toISOString()
  }
];
