import React, { useState } from 'react';
import { Student, Concept, PeerMatch, GeneratedIntervention, QALog } from '../types';
import { computeCognitiveDebtMetrics, findPeerMatches } from '../utils/cognitiveEngine';
import { ConceptGraphVisualizer } from './ConceptGraphVisualizer';
import {
  Brain,
  Zap,
  Sparkles,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  MessageSquare,
  Users,
  BookOpen,
  ChevronRight,
  HelpCircle,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

interface StudentDashboardProps {
  student: Student;
  concepts: Concept[];
  allStudents: Student[];
  selectedSubject: string;
  peerMatches: PeerMatch[];
  interventions: GeneratedIntervention[];
  onGenerateIntervention: (student: Student, concept: Concept) => void;
  onConnectPeerMatch: (matchId: string) => void;
  onAddQALog: (studentId: string, conceptId: string, questionText: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  concepts,
  allStudents,
  selectedSubject,
  peerMatches,
  interventions,
  onGenerateIntervention,
  onConnectPeerMatch,
  onAddQALog
}) => {
  const filteredConcepts = concepts.filter(c => c.subjectId === selectedSubject);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [selectedConceptForQA, setSelectedConceptForQA] = useState(filteredConcepts[0]?.id || '');
  const [activeQuizIndex, setActiveQuizIndex] = useState<number | null>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizAnswerSubmitted, setQuizAnswerSubmitted] = useState(false);

  // Compute metrics for all concepts for this student
  const studentMetrics = filteredConcepts.map(c => computeCognitiveDebtMetrics(student, c, concepts));

  // Find lowest score / root cause concept
  const weakestMetric = [...studentMetrics].sort((a, b) => a.decayedConfidenceScore - b.decayedConfidenceScore)[0];
  const weakestConcept = filteredConcepts.find(c => c.id === weakestMetric?.conceptId);

  // Find relevant intervention or demo intervention
  const activeIntervention = interventions.find(
    i => i.studentId === student.id && i.conceptId === weakestConcept?.id
  ) || interventions[0];

  // Find relevant peer match
  const peerMatchCandidates = weakestConcept
    ? findPeerMatches(student, weakestMetric?.rootCauseConceptId || weakestConcept.id, allStudents, weakestConcept)
    : [];

  // Construct 14-Day Forgetting Curve Data for Recharts
  const curveData = Array.from({ length: 14 }).map((_, day) => {
    const decayFactor = Math.exp(-0.04 * day);
    const scoreWithoutReview = Math.round((weakestMetric?.confidenceScore || 75) * decayFactor);
    const scoreWithReview = Math.round(
      Math.min(100, (weakestMetric?.confidenceScore || 75) * decayFactor + (day >= 3 ? 25 : 0))
    );

    return {
      day: `Day ${day}`,
      'Untouched Knowledge Decay': scoreWithoutReview,
      'With Micro-Remediation': scoreWithReview,
      Threshold: 50
    };
  });

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    onAddQALog(student.id, selectedConceptForQA || filteredConcepts[0]?.id, newQuestionText);
    setNewQuestionText('');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Banner: Student Identity & Cognitive Debt Overview */}
      <div className="bg-[#151518] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center space-x-5">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-indigo-500/30 shadow-xl"
            />
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {student.name}
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {student.learningStyle}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1 uppercase tracking-wider">
                {student.grade} &bull; GPA {student.overallGpa} &bull; ACTIVE SUBJECT:{' '}
                <strong className="text-indigo-300">{selectedSubject}</strong>
              </p>
            </div>
          </div>

          {/* Cognitive Debt Score Index Card */}
          <div className="w-full lg:w-auto flex items-center bg-[#0A0A0B] rounded-2xl border border-slate-800 p-4 sm:p-5 space-x-6">
            <div className="text-center border-r border-slate-800 pr-6">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                Avg Mastery
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-black text-white mt-1 block">
                {Math.round(
                  studentMetrics.reduce((acc, m) => acc + m.decayedConfidenceScore, 0) /
                    (studentMetrics.length || 1)
                )}
                %
              </span>
            </div>

            <div className="text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                Cognitive Debt Risk
              </span>
              <span className={`text-2xl sm:text-3xl font-mono font-black mt-1 block ${
                weakestMetric && weakestMetric.compoundingRiskScore > 100
                  ? 'text-rose-500'
                  : 'text-emerald-400'
              }`}>
                {weakestMetric?.compoundingRiskScore || 0}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid: Left Column (Forgetting Curve & Micro Lesson), Right Column (Root Cause & Peer Match) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (7 cols): Forgetting Curve Chart & Today's Micro-Lesson */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Forgetting Curve Chart */}
          <div className="bg-[#151518] border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-white">
                    Cognitive Knowledge Decay Forecast
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  Predictive forgetting curve for topic:{' '}
                  <span className="text-indigo-300 font-semibold">{weakestConcept?.name}</span>
                </p>
              </div>

              <div className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{weakestMetric?.daysUntilCritical || 0}d to critical</span>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={curveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0A0A0B', borderColor: '#27272A', borderRadius: '0.75rem', fontSize: '12px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line
                    type="monotone"
                    dataKey="Untouched Knowledge Decay"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="With Micro-Remediation"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Threshold"
                    stroke="#f59e0b"
                    strokeDasharray="5 5"
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Today's Auto-Generated Micro-Lesson Card */}
          <div className="bg-[#151518] border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  Today's Targeted Micro-Lesson
                </h3>
              </div>
              
              <button
                onClick={() => weakestConcept && onGenerateIntervention(student, weakestConcept)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-md shadow-indigo-600/20"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Re-Generate with Gemini AI</span>
              </button>
            </div>

            {activeIntervention ? (
              <div className="mt-5 space-y-5">
                
                <div>
                  <h4 className="text-sm font-bold text-cyan-300">
                    {activeIntervention.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {activeIntervention.summary}
                  </p>
                </div>

                {/* Key Analogy Box */}
                <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/60 flex items-start space-x-3">
                  <Lightbulb className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-mono text-purple-300 uppercase tracking-wider font-bold block">
                      Intuitive Analogy ({student.learningStyle})
                    </span>
                    <p className="text-xs text-purple-200 mt-0.5">
                      {activeIntervention.keyAnalogy}
                    </p>
                  </div>
                </div>

                {/* Step-by-Step Guidance */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-200 block">
                    Actionable Steps:
                  </span>
                  {activeIntervention.stepByStep.map((step, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold font-mono text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                {/* Interactive Practice Questions */}
                {activeIntervention.practiceQuestions && activeIntervention.practiceQuestions.length > 0 && (
                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-white block flex items-center space-x-1.5">
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                      <span>Adaptive Quick Practice Quiz ({activeIntervention.practiceQuestions.length} Questions)</span>
                    </span>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                      <p className="text-xs font-semibold text-slate-200">
                        {activeIntervention.practiceQuestions[activeQuizIndex || 0].question}
                      </p>

                      <div className="space-y-2">
                        {activeIntervention.practiceQuestions[activeQuizIndex || 0].options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => {
                              setSelectedQuizOption(oIdx);
                              setQuizAnswerSubmitted(true);
                            }}
                            className={`w-full text-left p-2.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                              selectedQuizOption === oIdx
                                ? oIdx === activeIntervention.practiceQuestions[activeQuizIndex || 0].correctIndex
                                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                                  : 'bg-red-950/80 border-red-500 text-red-200'
                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <span className="font-mono text-slate-500 mr-2">{String.fromCharCode(65 + oIdx)}.</span>
                            {opt}
                          </button>
                        ))}
                      </div>

                      {quizAnswerSubmitted && (
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 mt-2">
                          <strong className="text-cyan-400 block mb-1">Explanation:</strong>
                          {activeIntervention.practiceQuestions[activeQuizIndex || 0].explanation}
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                Click "Re-Generate" to trigger Gemini AI micro-lesson for this student.
              </div>
            )}
          </div>

        </div>

        {/* Right Column (5 cols): Peer Knowledge Match & Q&A Phrasing Simulator */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Peer Knowledge Market Card */}
          <div className="bg-[#151518] border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center space-x-2 pb-4 border-b border-slate-800">
              <Users className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                Peer Knowledge Broker Match
              </h3>
            </div>

            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Instead of standard AI lectures, NeuroPulse matches you with a classmate who recently mastered this root cause topic in the last 48 hours.
            </p>

            {peerMatchCandidates.length > 0 ? (
              <div className="mt-4 space-y-4">
                {peerMatchCandidates.map((pm) => (
                  <div key={pm.id} className="p-4 rounded-2xl bg-[#0A0A0B] border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={pm.mentorStudentAvatar}
                          alt={pm.mentorStudentName}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-white">{pm.mentorStudentName}</h4>
                          <span className="text-[10px] text-emerald-400 font-mono">
                            Mastered {pm.conceptName} ({pm.masteredDaysAgo}d ago)
                          </span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        {pm.status}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#151518] border border-slate-800 text-xs text-slate-300 italic">
                      "{pm.icebreakerPrompt}"
                    </div>

                    <button
                      onClick={() => onConnectPeerMatch(pm.id)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Start Peer Coaching Session</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#0A0A0B] border border-slate-800 text-center text-slate-400 text-xs mt-4 font-mono">
                No active peer mentors found for this specific root cause topic right now.
              </div>
            )}
          </div>

          {/* Q&A Phrasing & Sentiment Inspector */}
          <div className="bg-[#151518] border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center space-x-2 pb-4 border-b border-slate-800">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">
                Q&A Phrasing Sentiment Signal
              </h3>
            </div>

            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              NeuroPulse scans your Q&A phrasing for confused or hesitant keywords (NLP scoring), flagging hidden cognitive gaps even if your test score was lucky.
            </p>

            <form onSubmit={handleQuestionSubmit} className="mt-4 space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-500 tracking-wider block mb-1">
                  Select Topic
                </label>
                <select
                  value={selectedConceptForQA}
                  onChange={(e) => setSelectedConceptForQA(e.target.value)}
                  className="w-full bg-[#0A0A0B] text-slate-200 text-xs rounded-xl p-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
                >
                  {filteredConcepts.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-500 tracking-wider block mb-1">
                  Ask a Question or Explain Where You Are Stuck
                </label>
                <textarea
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="e.g. I keep getting lost on step 2 of substitution because I don't know why the negative sign flips..."
                  rows={3}
                  className="w-full bg-[#0A0A0B] text-slate-200 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-indigo-500 resize-none font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-indigo-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Q&A & Compute Sentiment Signal</span>
              </button>
            </form>

            {/* Existing Student Q&A Logs */}
            <div className="mt-5 space-y-2">
              <span className="text-[11px] font-mono uppercase text-slate-400 block">
                Logged Q&A Phrasing History:
              </span>

              {studentMetrics.flatMap(m => student.performances[m.conceptId]?.qaLogs || []).length > 0 ? (
                studentMetrics
                  .flatMap(m => student.performances[m.conceptId]?.qaLogs || [])
                  .map((log) => (
                    <div key={log.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-cyan-300">{log.questionText}</span>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                          log.phrasingSentiment === 'confused'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {log.phrasingSentiment} ({Math.round(log.sentimentScore * 100)}%)
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Keywords: {log.detectedKeywords.join(', ')}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-xs text-slate-500 italic p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  No Q&A phrasing logged yet for this subject.
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Full Concept Graph Visualization */}
      <div className="mt-12">
        <ConceptGraphVisualizer
          concepts={concepts}
          selectedSubject={selectedSubject}
          student={student}
          onSelectConceptForIntervention={(concept) => onGenerateIntervention(student, concept)}
        />
      </div>

    </div>
  );
};
