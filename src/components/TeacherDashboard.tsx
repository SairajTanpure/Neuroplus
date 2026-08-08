import React, { useState } from 'react';
import { Student, Concept, PeerMatch, CognitiveDebtMetrics } from '../types';
import { computeCognitiveDebtMetrics, findPeerMatches } from '../utils/cognitiveEngine';
import {
  Users,
  AlertTriangle,
  Zap,
  Sparkles,
  Search,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
  Layers,
  Clock,
  Filter,
  BarChart3,
  BookOpen
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';

interface TeacherDashboardProps {
  students: Student[];
  concepts: Concept[];
  selectedSubject: string;
  peerMatches: PeerMatch[];
  onTriggerIntervention: (student: Student, concept: Concept) => void;
  onCreatePeerMatch: (match: PeerMatch) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  students,
  concepts,
  selectedSubject,
  peerMatches,
  onTriggerIntervention,
  onCreatePeerMatch
}) => {
  const filteredConcepts = concepts.filter(c => c.subjectId === selectedSubject);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'at_risk' | 'silence_alert'>('all');
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<{
    student: Student;
    concept: Concept;
    metric: CognitiveDebtMetrics;
  } | null>(null);

  // Compute all metrics for all students across all concepts in active subject
  const studentMetricsMap = new Map<string, CognitiveDebtMetrics[]>();
  const atRiskStudentsList: {
    student: Student;
    metrics: CognitiveDebtMetrics[];
    weakestMetric: CognitiveDebtMetrics;
    weakestConcept: Concept;
  }[] = [];

  students.forEach(st => {
    const metrics = filteredConcepts.map(c => computeCognitiveDebtMetrics(st, c, concepts));
    studentMetricsMap.set(st.id, metrics);

    const sorted = [...metrics].sort((a, b) => a.decayedConfidenceScore - b.decayedConfidenceScore);
    const weakest = sorted[0];
    const weakestC = filteredConcepts.find(c => c.id === weakest?.conceptId);

    if (weakest && weakestC) {
      atRiskStudentsList.push({
        student: st,
        metrics,
        weakestMetric: weakest,
        weakestConcept: weakestC
      });
    }
  });

  // Sort at risk students by highest compounding risk score
  atRiskStudentsList.sort((a, b) => b.weakestMetric.compoundingRiskScore - a.weakestMetric.compoundingRiskScore);

  // Filter students based on search and tab filter
  const filteredAtRiskStudents = atRiskStudentsList.filter(item => {
    const matchesSearch = item.student.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterMode === 'at_risk') return item.weakestMetric.decayedConfidenceScore < 60;
    if (filterMode === 'silence_alert') return item.weakestMetric.silenceAlert;
    return true;
  });

  // Class KPI Aggregations
  const totalConfidenceSum = atRiskStudentsList.reduce((sum, item) => {
    const avg = item.metrics.reduce((a, m) => a + m.decayedConfidenceScore, 0) / (item.metrics.length || 1);
    return sum + avg;
  }, 0);
  const classAvgConfidence = Math.round(totalConfidenceSum / (atRiskStudentsList.length || 1));

  const atRiskCount = atRiskStudentsList.filter(item => item.weakestMetric.decayedConfidenceScore < 60).length;
  const silenceAlertCount = atRiskStudentsList.filter(item => item.weakestMetric.silenceAlert).length;

  // Find most frequent root cause concept across class
  const rootCauseCounts: Record<string, number> = {};
  atRiskStudentsList.forEach(item => {
    const rcName = item.weakestMetric.rootCauseConceptName || item.weakestConcept.name;
    rootCauseCounts[rcName] = (rootCauseCounts[rcName] || 0) + 1;
  });

  const topRootCauseName = Object.entries(rootCauseCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Product Rule';

  // Bar Chart Data for Class Concept Mastery Distribution
  const classConceptBarData = filteredConcepts.map(c => {
    let sum = 0;
    let count = 0;
    students.forEach(st => {
      const metric = computeCognitiveDebtMetrics(st, c, concepts);
      sum += metric.decayedConfidenceScore;
      count++;
    });
    const avg = Math.round(sum / (count || 1));
    return {
      name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
      fullName: c.name,
      avgConfidence: avg
    };
  });

  function getHeatmapBg(score: number) {
    if (score >= 80) return 'bg-emerald-600/80 text-white font-bold hover:bg-emerald-500';
    if (score >= 60) return 'bg-amber-600/80 text-white font-bold hover:bg-amber-500';
    return 'bg-red-600/90 text-white font-extrabold hover:bg-red-500 animate-pulse';
  }

  return (
    <div className="space-y-8 pb-12">
      
      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-[#151518] border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Class Avg Mastery</span>
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BarChart3 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-black text-white">{classAvgConfidence}%</span>
            <span className="text-xs text-slate-400">weighted signals</span>
          </div>
        </div>

        <div className="bg-[#151518] border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Students At Risk</span>
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-black text-rose-400">{atRiskCount}</span>
            <span className="text-xs text-slate-400">of {students.length} students (&lt;60%)</span>
          </div>
        </div>

        <div className="bg-[#151518] border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Top Root-Cause Gap</span>
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Zap className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-base font-bold text-indigo-300 block line-clamp-1">
              {topRootCauseName}
            </span>
            <span className="text-xs text-slate-400 mt-0.5 block">Blocking downstream topics</span>
          </div>
        </div>

        <div className="bg-[#151518] border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Silence Signal Alerts</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-black text-amber-400">{silenceAlertCount}</span>
            <span className="text-xs text-slate-400">high avoidance / zero Q&A</span>
          </div>
        </div>

      </div>

      {/* Class Concept Heatmap Grid Component */}
      <div className="bg-[#151518] border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white">
                Class-Wide Concept Heatmap Grid (Students &times; Concepts)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant visual matrix showing individual confidence across all subject topics. Click any cell to inspect and trigger interventions.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded bg-emerald-600" />
              <span className="text-slate-300">&ge;80%</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded bg-amber-600" />
              <span className="text-slate-300">60-79%</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded bg-red-600 animate-pulse" />
              <span className="text-red-400 font-bold">&lt;60% (Risk)</span>
            </span>
          </div>
        </div>

        {/* Heatmap Table Grid */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <th className="p-3">Student Name</th>
                {filteredConcepts.map(c => (
                  <th key={c.id} className="p-3 text-center max-w-[120px]">
                    <span className="block truncate">{c.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {students.map(st => {
                const metrics = studentMetricsMap.get(st.id) || [];
                return (
                  <tr key={st.id} className="hover:bg-slate-800/40 transition-all">
                    <td className="p-3 font-semibold text-white flex items-center space-x-2.5">
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700"
                      />
                      <span>{st.name}</span>
                    </td>

                    {filteredConcepts.map(c => {
                      const metric = metrics.find(m => m.conceptId === c.id);
                      const score = metric?.decayedConfidenceScore || 0;

                      return (
                        <td key={c.id} className="p-2 text-center">
                          <button
                            onClick={() => metric && setSelectedHeatmapCell({ student: st, concept: c, metric })}
                            className={`w-full py-2 px-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer shadow-sm ${getHeatmapBg(
                              score
                            )}`}
                            title={`${st.name} on ${c.name}: ${score}% Confidence. Click to inspect!`}
                          >
                            {score}%
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Heatmap Cell Inspection Drawer / Modal */}
      {selectedHeatmapCell && (
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 relative animate-fade-in shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <img
                src={selectedHeatmapCell.student.avatar}
                alt={selectedHeatmapCell.student.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-500/40"
              />
              <div>
                <h3 className="text-sm font-bold text-white">
                  {selectedHeatmapCell.student.name} &bull; {selectedHeatmapCell.concept.name}
                </h3>
                <span className="text-xs text-slate-400">
                  Decayed Confidence Score:{' '}
                  <strong className="text-cyan-300 font-mono">
                    {selectedHeatmapCell.metric.decayedConfidenceScore}%
                  </strong>
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedHeatmapCell(null)}
              className="text-slate-400 hover:text-white text-xs font-mono px-3 py-1 bg-slate-900 rounded-lg border border-slate-800"
            >
              Close Inspector
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Attendance</span>
              <span className="text-sm font-bold text-white font-mono">{selectedHeatmapCell.metric.attendancePct}%</span>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Assessment Score</span>
              <span className="text-sm font-bold text-white font-mono">{selectedHeatmapCell.metric.assessmentScore}%</span>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Behavior Score</span>
              <span className="text-sm font-bold text-white font-mono">{selectedHeatmapCell.metric.behaviorScore}%</span>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">True Root Cause</span>
              <span className="text-xs font-bold text-red-400 block truncate">
                {selectedHeatmapCell.metric.rootCauseConceptName}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => {
                onTriggerIntervention(selectedHeatmapCell.student, selectedHeatmapCell.concept);
                setSelectedHeatmapCell(null);
              }}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white text-xs font-bold rounded-xl flex items-center space-x-2 hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-cyan-600/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Gemini Micro-Lesson</span>
            </button>
          </div>
        </div>
      )}

      {/* Class Concept Average Bar Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">
              Class Concept Mastery Distribution
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Average confidence across all enrolled students per concept topic.
            </p>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={classConceptBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Bar dataKey="avgConfidence" radius={[6, 6, 0, 0]}>
                {classConceptBarData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.avgConfidence >= 80 ? '#10b981' : entry.avgConfidence >= 60 ? '#f59e0b' : '#ef4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* "Students At Risk" Prioritized Action Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="text-base font-bold text-white">
                Prioritized "Students At Risk" List
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Sorted by Compounding Cognitive Debt Risk (Downstream concept impact &times; decay rate).
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-1.5 border border-slate-800 focus:outline-none focus:border-cyan-500 w-44"
              />
            </div>

            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value as any)}
              className="bg-slate-950 text-slate-200 text-xs rounded-xl px-3 py-1.5 border border-slate-800 focus:outline-none focus:border-cyan-500 font-medium"
            >
              <option value="all">All Enrolled</option>
              <option value="at_risk">At Risk (&lt;60%)</option>
              <option value="silence_alert">Silence Alerts</option>
            </select>
          </div>
        </div>

        {/* Action Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <th className="p-3">Student</th>
                <th className="p-3">Surface Gap</th>
                <th className="p-3">True Root Cause</th>
                <th className="p-3 text-center">Confidence</th>
                <th className="p-3 text-center">Compounding Risk</th>
                <th className="p-3 text-center">Signals</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredAtRiskStudents.map((item) => {
                const { student: st, weakestMetric: wm, weakestConcept: wc } = item;
                const isCritical = wm.decayedConfidenceScore < 60;

                return (
                  <tr key={st.id} className="hover:bg-slate-800/40 transition-all">
                    <td className="p-3 font-semibold text-white">
                      <div className="flex items-center space-x-3">
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-700"
                        />
                        <div>
                          <span className="block font-bold">{st.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{st.grade}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="font-medium text-slate-200 block">{wc.name}</span>
                    </td>

                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-lg bg-red-950/80 border border-red-800/80 text-red-300 font-bold text-[11px] flex items-center space-x-1.5 w-max">
                        <Zap className="w-3 h-3 text-red-400 fill-current" />
                        <span>{wm.rootCauseConceptName}</span>
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-extrabold ${
                        isCritical
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {wm.decayedConfidenceScore}%
                      </span>
                    </td>

                    <td className="p-3 text-center font-mono font-bold text-red-400 text-sm">
                      {wm.compoundingRiskScore}
                    </td>

                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        {wm.silenceAlert && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30" title="Silence signal: Avoidance > 6d without Q&A">
                            Silence Alert
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-slate-400">
                          {wm.attendancePct}% Att &bull; {wm.assessmentScore}% Quiz
                        </span>
                      </div>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onTriggerIntervention(st, wc)}
                          className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-lg font-bold text-xs flex items-center space-x-1 transition-all cursor-pointer shadow-md shadow-cyan-600/20"
                          title="Generate AI micro-lesson"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Lesson</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
