import React, { useState } from 'react';
import { Concept, Student, CognitiveDebtMetrics } from '../types';
import { computeCognitiveDebtMetrics } from '../utils/cognitiveEngine';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Zap,
  Info,
  Clock,
  BookOpen
} from 'lucide-react';

interface ConceptGraphVisualizerProps {
  concepts: Concept[];
  selectedSubject: string;
  student?: Student;
  allStudents?: Student[];
  onSelectConceptForIntervention?: (concept: Concept) => void;
}

export const ConceptGraphVisualizer: React.FC<ConceptGraphVisualizerProps> = ({
  concepts,
  selectedSubject,
  student,
  allStudents = [],
  onSelectConceptForIntervention
}) => {
  const filteredConcepts = concepts.filter(c => c.subjectId === selectedSubject);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    filteredConcepts[0]?.id || null
  );

  // Compute metrics for active student or class average
  const metricsMap = new Map<string, CognitiveDebtMetrics>();
  filteredConcepts.forEach(c => {
    if (student) {
      metricsMap.set(c.id, computeCognitiveDebtMetrics(student, c, concepts));
    } else {
      // Calculate class average for teacher view
      let avgAttendance = 0;
      let avgAssessment = 0;
      let count = 0;
      allStudents.forEach(st => {
        const p = st.performances[c.id];
        if (p) {
          avgAttendance += p.attendancePct;
          avgAssessment += p.assessmentScore;
          count++;
        }
      });
      const att = count > 0 ? Math.round(avgAttendance / count) : 80;
      const ass = count > 0 ? Math.round(avgAssessment / count) : 75;
      const dummyStudent: Student = {
        id: 'avg',
        name: 'Class Average',
        email: '',
        avatar: '',
        grade: '',
        learningStyle: 'Step-by-Step',
        overallGpa: 3.5,
        performances: {
          [c.id]: {
            conceptId: c.id,
            attendancePct: att,
            assessmentScore: ass,
            behavior: { quizRetries: 2, avgTimeOnTaskMin: 22, hesitationClicks: 3, avoidanceDays: 1 },
            qaLogs: [],
            lastStudiedDaysAgo: 2
          }
        }
      };
      metricsMap.set(c.id, computeCognitiveDebtMetrics(dummyStudent, c, concepts));
    }
  });

  const selectedConcept = filteredConcepts.find(c => c.id === selectedNodeId) || filteredConcepts[0];
  const selectedMetric = selectedConcept ? metricsMap.get(selectedConcept.id) : null;

  function getNodeColorClass(score: number | undefined) {
    if (score === undefined) return 'bg-slate-800 border-slate-700 text-slate-300';
    if (score >= 80) return 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300 shadow-emerald-500/10';
    if (score >= 60) return 'bg-amber-950/80 border-amber-500/80 text-amber-300 shadow-amber-500/10';
    return 'bg-red-950/90 border-red-500 text-red-200 shadow-red-500/20 animate-pulse';
  }

  function getBadgeBg(score: number | undefined) {
    if (score === undefined) return 'bg-slate-800 text-slate-400';
    if (score >= 80) return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    if (score >= 60) return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    return 'bg-red-500/20 text-red-400 border border-red-500/40 font-bold';
  }

  return (
    <div className="bg-[#151518] rounded-3xl border border-slate-800 p-6 shadow-2xl backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BookOpen className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Concept Prerequisite DAG (Directed Acyclic Graph)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual map showing how foundational concepts feed into advanced topics. Click any topic node to evaluate root causes.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-300">Strong (&ge;80%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-slate-300">Moderate (60-79%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <span className="text-red-400 font-semibold">Root Cause Risk (&lt;60%)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Graph Nodes Canvas Representation */}
        <div className="lg:col-span-7 bg-slate-950 rounded-xl p-6 border border-slate-800 relative min-h-[420px] flex flex-col justify-around">
          
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
            <span>Graph Hierarchy & Prerequisites</span>
            <span className="text-cyan-400">Backtracking Active</span>
          </div>

          <div className="space-y-8 relative">
            {filteredConcepts.map((concept) => {
              const metric = metricsMap.get(concept.id);
              const score = metric?.decayedConfidenceScore;
              const isSelected = concept.id === selectedNodeId;
              const isRootCause = metric?.isRootCause && (score !== undefined && score < 60);

              const prereqNames = concept.prerequisites
                .map(pId => filteredConcepts.find(c => c.id === pId)?.name)
                .filter(Boolean);

              return (
                <div key={concept.id} className="relative">
                  {/* Visual Prerequisite Arrow Connection Line if prerequisites exist */}
                  {prereqNames.length > 0 && (
                    <div className="text-[10px] text-slate-500 mb-1 flex items-center space-x-1 pl-4">
                      <span>Depends on:</span>
                      {prereqNames.map((pName, i) => (
                        <span key={i} className="bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">
                          {pName}
                        </span>
                      ))}
                    </div>
                  )}

                  <div
                    onClick={() => setSelectedNodeId(concept.id)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative flex items-center justify-between ${getNodeColorClass(
                      score
                    )} ${
                      isSelected ? 'ring-2 ring-cyan-400 scale-[1.02] shadow-lg' : 'hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {score !== undefined && score >= 80 ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : score !== undefined && score >= 60 ? (
                          <HelpCircle className="w-5 h-5 text-amber-400" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm text-white">{concept.name}</h4>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900/60 border border-slate-700 text-slate-400">
                            {concept.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                          {concept.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {isRootCause && (
                        <span className="px-2 py-1 bg-red-600 text-white font-bold text-[10px] uppercase rounded-md tracking-wider flex items-center space-x-1 shadow-md shadow-red-600/30">
                          <Zap className="w-3 h-3 fill-current animate-bounce" />
                          <span>True Root Cause</span>
                        </span>
                      )}

                      <div className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold ${getBadgeBg(score)}`}>
                        {score !== undefined ? `${score}%` : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Details Panel */}
        <div className="lg:col-span-5 bg-slate-950 rounded-xl p-6 border border-slate-800 flex flex-col justify-between">
          {selectedConcept && selectedMetric ? (
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider">
                    Topic Inspector
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {selectedConcept.name}
                  </h3>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${getBadgeBg(selectedMetric.decayedConfidenceScore)}`}>
                  {selectedMetric.decayedConfidenceScore}% Confidence
                </div>
              </div>

              {/* Cognitive Signals Breakdown */}
              <div className="mt-4 space-y-3 text-xs">
                <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Attendance Signal (25%)</span>
                  <span className="font-mono text-white font-semibold">{selectedMetric.attendancePct}%</span>
                </div>

                <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Assessment Recency Score (35%)</span>
                  <span className="font-mono text-white font-semibold">{selectedMetric.assessmentScore}%</span>
                </div>

                <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Behavioral Friction Score (20%)</span>
                  <span className="font-mono text-white font-semibold">{selectedMetric.behaviorScore}%</span>
                </div>

                <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">NLP Question Sentiment (20%)</span>
                  <span className="font-mono text-white font-semibold">{selectedMetric.nlpSentimentScore}%</span>
                </div>
              </div>

              {/* Decay & Root Cause Diagnostic */}
              <div className="mt-5 p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-xs">
                  <Clock className="w-4 h-4" />
                  <span>Cognitive Debt Analysis</span>
                </div>

                <p className="text-xs text-slate-300">
                  {selectedMetric.daysUntilCritical === 0 ? (
                    <span className="text-red-400 font-semibold">
                      Critical Threshold Breached! Requires immediate micro-remediation.
                    </span>
                  ) : (
                    <span>
                      Predicted to drop below usable threshold (50%) in{' '}
                      <strong className="text-cyan-300">{selectedMetric.daysUntilCritical} days</strong> if unvisited.
                    </span>
                  )}
                </p>

                {selectedMetric.rootCauseConceptId && selectedMetric.rootCauseConceptId !== selectedConcept.id && (
                  <div className="mt-3 p-3 bg-red-950/60 border border-red-800/80 rounded-lg text-xs text-red-200">
                    <span className="font-bold block text-red-400">Root-Cause Traceback:</span>
                    Surface struggle in {selectedConcept.name} is caused by ancestor gap in{' '}
                    <strong className="text-white underline">{selectedMetric.rootCauseConceptName}</strong>.
                  </div>
                )}
              </div>

              {/* Trigger Intervention Action Button */}
              {onSelectConceptForIntervention && (
                <button
                  onClick={() => onSelectConceptForIntervention(selectedConcept)}
                  className="w-full mt-6 py-2.5 px-4 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-cyan-600/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Root-Cause Mini-Lesson</span>
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Select any node in the concept DAG to inspect detailed cognitive signals.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
