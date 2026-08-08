import React, { useState, useEffect } from 'react';
import { SubjectId, Student, Concept, PeerMatch, GeneratedIntervention, AuthUser } from './types';
import { SEEDED_CONCEPTS, SEEDED_STUDENTS, DEMO_PEER_MATCHES, DEMO_INTERVENTIONS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ConceptGraphVisualizer } from './components/ConceptGraphVisualizer';
import { PeerMarketModal } from './components/PeerMarketModal';
import { SimulationControls } from './components/SimulationControls';
import { LoginPage } from './components/LoginPage';
import { TeacherUnlockModal } from './components/TeacherUnlockModal';
import { Brain, Sparkles, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isTeacherUnlockOpen, setIsTeacherUnlockOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'student' | 'teacher' | 'peer_market' | 'graph_explorer'>('student');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('calculus');
  const [students, setStudents] = useState<Student[]>(SEEDED_STUDENTS);
  const [concepts, setConcepts] = useState<Concept[]>(SEEDED_CONCEPTS);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(SEEDED_STUDENTS[0].id);
  const [peerMatches, setPeerMatches] = useState<PeerMatch[]>(DEMO_PEER_MATCHES);
  const [interventions, setInterventions] = useState<GeneratedIntervention[]>(DEMO_INTERVENTIONS);
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [aiConfigured, setAiConfigured] = useState(false);
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check server AI status
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setAiConfigured(!!data.aiConfigured);
      })
      .catch(() => {
        setAiConfigured(false);
      });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    if (user.role === 'teacher') {
      setViewMode('teacher');
      showToast(`Welcome Dr. Eleanor Vance! Teacher Workspace Unlocked.`);
    } else {
      setViewMode('student');
      setSelectedStudentId(user.id);
      showToast(`Welcome ${user.name}! Student Portal Unlocked.`);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Portal Locked & Encrypted Session Revoked.');
  };

  const handleUnlockTeacherSuccess = () => {
    setIsTeacherUnlockOpen(false);
    setViewMode('teacher');
    showToast('Teacher Workspace Authorized via PIN Verification!');
  };

  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];


  // Handler for Gemini AI Intervention Generation
  const handleGenerateIntervention = async (studentToTarget: Student, conceptToTarget: Concept) => {
    setIsGeneratingLesson(true);
    showToast(`Generating Gemini AI Micro-Lesson for ${studentToTarget.name}...`);

    try {
      const response = await fetch('/api/gemini/generate-intervention', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: studentToTarget.name,
          conceptName: conceptToTarget.name,
          rootCauseConceptName: conceptToTarget.name,
          qnaStyle: studentToTarget.performances[conceptToTarget.id]?.qaLogs?.[0]?.questionText || 'Need step-by-step clarity',
          confidenceScore: studentToTarget.performances[conceptToTarget.id]?.assessmentScore || 50,
          learningStyle: studentToTarget.learningStyle
        })
      });

      if (!response.ok) throw new Error('Failed to fetch intervention');
      const data = await response.json();

      const newIntervention: GeneratedIntervention = {
        studentId: studentToTarget.id,
        studentName: studentToTarget.name,
        conceptId: conceptToTarget.id,
        conceptName: conceptToTarget.name,
        rootCauseConceptId: conceptToTarget.id,
        rootCauseConceptName: conceptToTarget.name,
        title: data.title || `Root-Cause Remediation: ${conceptToTarget.name}`,
        summary: data.summary || `Personalized micro-lesson targeting ${conceptToTarget.name}`,
        keyAnalogy: data.keyAnalogy || 'Think of this concept as a foundation layer.',
        stepByStep: data.stepByStep || ['Step 1', 'Step 2'],
        practiceQuestions: data.practiceQuestions || [],
        peerCoachingStarter: data.peerCoachingStarter || 'Connect with a peer mentor!',
        generatedAt: new Date().toISOString()
      };

      setInterventions(prev => [newIntervention, ...prev]);
      showToast(`AI Micro-Lesson generated for ${conceptToTarget.name}!`);
      setViewMode('student');
      setSelectedStudentId(studentToTarget.id);
    } catch (err) {
      console.error(err);
      showToast('Error calling AI model. Used smart fallback lesson.');
    } finally {
      setIsGeneratingLesson(false);
    }
  };

  // Handler to connect a peer match
  const handleConnectPeerMatch = (matchId: string) => {
    setPeerMatches(prev =>
      prev.map(pm => (pm.id === matchId ? { ...pm, status: 'connected' } : pm))
    );
    showToast('Peer Coaching Session Connected! Chat starter sent.');
  };

  // Handler to add Q&A phrasing log
  const handleAddQALog = (studentId: string, conceptId: string, questionText: string) => {
    const isConfused = questionText.toLowerCase().includes('confused') ||
      questionText.toLowerCase().includes('lost') ||
      questionText.toLowerCase().includes('why') ||
      questionText.toLowerCase().includes('dont know');

    const sentimentScore = isConfused ? 0.25 : 0.85;
    const phrasingSentiment = isConfused ? 'confused' : 'confident';

    setStudents(prev =>
      prev.map(st => {
        if (st.id !== studentId) return st;
        const currentPerf = st.performances[conceptId] || {
          conceptId,
          attendancePct: 80,
          assessmentScore: 70,
          behavior: { quizRetries: 1, avgTimeOnTaskMin: 20, hesitationClicks: 2, avoidanceDays: 0 },
          qaLogs: [],
          lastStudiedDaysAgo: 1
        };

        const newLog = {
          id: `q-${Date.now()}`,
          timestamp: new Date().toISOString(),
          conceptId,
          questionText,
          phrasingSentiment: phrasingSentiment as any,
          sentimentScore,
          detectedKeywords: questionText.split(' ').slice(0, 3)
        };

        return {
          ...st,
          performances: {
            ...st.performances,
            [conceptId]: {
              ...currentPerf,
              qaLogs: [newLog, ...(currentPerf.qaLogs || [])]
            }
          }
        };
      })
    );

    showToast(`Logged Q&A. NLP Phrasing Sentiment: ${phrasingSentiment.toUpperCase()}`);
  };

  // Simulation Trigger: Time Lapse Decay
  const handleSimulateDecay = () => {
    setStudents(prev =>
      prev.map(st => {
        const updatedPerf: Record<string, any> = {};
        Object.entries(st.performances).forEach(([cId, perfData]) => {
          const perf = perfData as any;
          updatedPerf[cId] = {
            ...perf,
            lastStudiedDaysAgo: (perf.lastStudiedDaysAgo || 1) + 7,
            behavior: {
              ...perf.behavior,
              avoidanceDays: (perf.behavior?.avoidanceDays || 0) + 7
            }
          };
        });
        return { ...st, performances: updatedPerf };
      })
    );
    showToast('Fast-Forwarded +7 Days. Forgetting curves updated!');
  };

  // Simulation Trigger: Inject Confused Q&A
  const handleSimulateConfusedQA = () => {
    handleAddQALog('std-1', 'calc-2', 'I get completely confused whenever setting up Product Rule derivative terms in step 2!');
  };

  // Simulation Trigger: Inject Quiz Retries
  const handleSimulateFailedQuizzes = () => {
    setStudents(prev =>
      prev.map(st => {
        if (st.id !== 'std-1') return st;
        const perf = st.performances['calc-2'];
        if (!perf) return st;

        return {
          ...st,
          performances: {
            ...st.performances,
            'calc-2': {
              ...perf,
              assessmentScore: 42,
              behavior: {
                ...perf.behavior,
                quizRetries: 6,
                hesitationClicks: 18,
                avgTimeOnTaskMin: 55
              }
            }
          }
        };
      })
    );
    showToast('Injected quiz retries & hesitation clicks for Alex Chen on Product Rule.');
  };

  // Simulation Trigger: Reset Baseline
  const handleResetBaseline = () => {
    setStudents(SEEDED_STUDENTS);
    setPeerMatches(DEMO_PEER_MATCHES);
    setInterventions(DEMO_INTERVENTIONS);
    showToast('Reset dataset to initial seeded baseline.');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-100 font-sans selection:bg-indigo-500 selection:text-slate-950">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#151518] border border-indigo-500/50 text-indigo-200 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center space-x-3 text-xs font-semibold animate-bounce">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        students={students}
        selectedStudentId={selectedStudentId}
        setSelectedStudentId={setSelectedStudentId}
        onSimulateDecay={handleSimulateDecay}
        onOpenSimulationDrawer={() => setIsSimulationOpen(true)}
        aiConfigured={aiConfigured}
        currentUser={currentUser}
        onLogout={handleLogout}
        onRequestTeacherAccess={() => setIsTeacherUnlockOpen(true)}
      />

      {/* Render Login Page if Not Authenticated */}
      {!currentUser ? (
        <LoginPage
          students={students}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        /* Authenticated Portal Content */
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
          
          {/* Simple Explanation & Interface Mode Banner */}
          <div className="bg-[#151518] border border-indigo-500/30 rounded-3xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              
              <div className="flex items-start space-x-3">
                <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30 flex-shrink-0">
                  <Brain className="w-6 h-6 animate-pulse" />
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base font-bold text-white">
                      {(viewMode === 'student' || viewMode === 'peer_market') ? '🎓 Student Portal' : '👩‍🏫 Teacher Workspace'}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Simplified & Protected View
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {(viewMode === 'student' || viewMode === 'peer_market') ? (
                      <>
                        <strong>How NeuroPulse helps you learn:</strong> Instead of re-testing what you already know, NeuroPulse traces back to find the <em>exact foundational concept</em> you missed earlier, providing instant 3-step AI micro-lessons and peer tutor matches.
                      </>
                    ) : (
                      <>
                        <strong>How NeuroPulse helps you teach:</strong> View class-wide concept mastery heatmaps, catch students accumulating hidden topic gaps before exams, and dispatch 1-click AI interventions or peer mentoring pairs.
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Sub-Navigation Tabs */}
              <div className="flex items-center space-x-1.5 bg-[#0A0A0B] p-1.5 rounded-2xl border border-slate-800 self-stretch md:self-auto justify-center">
                {(viewMode === 'student' || viewMode === 'peer_market') ? (
                  <>
                    <button
                      onClick={() => setViewMode('student')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        viewMode === 'student'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      📖 My Health & Lessons
                    </button>
                    <button
                      onClick={() => setViewMode('peer_market')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        viewMode === 'peer_market'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🤝 Peer Buddies
                    </button>
                    <button
                      onClick={() => setViewMode('graph_explorer')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        viewMode === 'graph_explorer'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🕸️ Prerequisite Map
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setViewMode('teacher')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        viewMode === 'teacher'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      📊 Class Heatmap & At-Risk
                    </button>
                    <button
                      onClick={() => setViewMode('graph_explorer')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        viewMode === 'graph_explorer'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🕸️ Prerequisite Map
                    </button>
                    <button
                      onClick={() => setViewMode('peer_market')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        viewMode === 'peer_market'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🤝 Peer Market
                    </button>
                  </>
                )}
              </div>

            </div>
          </div>
        
        {viewMode === 'student' && (
          <StudentDashboard
            student={selectedStudent}
            concepts={concepts}
            allStudents={students}
            selectedSubject={selectedSubject}
            peerMatches={peerMatches}
            interventions={interventions}
            onGenerateIntervention={handleGenerateIntervention}
            onConnectPeerMatch={handleConnectPeerMatch}
            onAddQALog={handleAddQALog}
          />
        )}

        {viewMode === 'teacher' && (
          <TeacherDashboard
            students={students}
            concepts={concepts}
            selectedSubject={selectedSubject}
            peerMatches={peerMatches}
            onTriggerIntervention={handleGenerateIntervention}
            onCreatePeerMatch={(m) => setPeerMatches(prev => [m, ...prev])}
          />
        )}

        {viewMode === 'graph_explorer' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h1 className="text-xl font-bold text-white">Full Concept Prerequisite DAG Explorer</h1>
              <p className="text-xs text-slate-400 mt-1">
                Explore topic dependency relationships across {selectedSubject.toUpperCase()}. Evaluate root causes and prerequisite chains.
              </p>
            </div>
            <ConceptGraphVisualizer
              concepts={concepts}
              selectedSubject={selectedSubject}
              student={selectedStudent}
              allStudents={students}
              onSelectConceptForIntervention={(c) => handleGenerateIntervention(selectedStudent, c)}
            />
          </div>
        )}

        {viewMode === 'peer_market' && (
          <PeerMarketModal
            peerMatches={peerMatches}
            students={students}
            concepts={concepts}
            onConnectPeerMatch={handleConnectPeerMatch}
          />
        )}

        {/* Bento Grid System Footer */}
        <footer className="mt-12 py-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          <div>NeuroPulse v1.2.4-stable // Cognitive Debt Protocol Enabled</div>
          <div>Class UUID: EDU-4092-BRAVO-GRID</div>
        </footer>

      </main>
      )}

      {/* Teacher PIN Security Verification Modal */}
      <TeacherUnlockModal
        isOpen={isTeacherUnlockOpen}
        onClose={() => setIsTeacherUnlockOpen(false)}
        onUnlockSuccess={handleUnlockTeacherSuccess}
      />

      {/* Simulation Drawer Modal */}
      <SimulationControls
        isOpen={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
        onSimulateDecay={handleSimulateDecay}
        onSimulateConfusedQA={handleSimulateConfusedQA}
        onSimulateFailedQuizzes={handleSimulateFailedQuizzes}
        onResetBaseline={handleResetBaseline}
      />

    </div>
  );
}

