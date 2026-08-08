import React from 'react';
import {
  Brain,
  GraduationCap,
  Users,
  Network,
  Clock,
  Sparkles,
  Zap,
  Activity,
  Layers,
  ChevronDown,
  ShieldCheck,
  LogOut,
  Lock
} from 'lucide-react';
import { SubjectId, Student, AuthUser } from '../types';

interface NavbarProps {
  viewMode: 'student' | 'teacher' | 'peer_market' | 'graph_explorer';
  setViewMode: (mode: 'student' | 'teacher' | 'peer_market' | 'graph_explorer') => void;
  selectedSubject: SubjectId;
  setSelectedSubject: (subject: SubjectId) => void;
  students: Student[];
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  onSimulateDecay: () => void;
  onOpenSimulationDrawer: () => void;
  aiConfigured: boolean;
  currentUser: AuthUser | null;
  onLogout: () => void;
  onRequestTeacherAccess: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  selectedSubject,
  setSelectedSubject,
  students,
  selectedStudentId,
  setSelectedStudentId,
  onSimulateDecay,
  onOpenSimulationDrawer,
  aiConfigured,
  currentUser,
  onLogout,
  onRequestTeacherAccess
}) => {
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleRoleClick = (targetRole: 'student' | 'teacher') => {
    if (targetRole === 'teacher' && currentUser?.role === 'student') {
      // Prompt PIN verification if student tries to access teacher workspace
      onRequestTeacherAccess();
      return;
    }

    if (targetRole === 'teacher') {
      setViewMode('teacher');
    } else {
      setViewMode('student');
    }
  };

  return (
    <header className="bg-[#0A0A0B]/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-indigo-600/30">
              N
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                NeuroPulse <span className="text-indigo-400 font-mono text-sm font-semibold">// Cognitive Engine</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-mono uppercase tracking-widest hidden sm:block">
                Intelligence-Led Remediation
              </p>
            </div>
          </div>

          {/* Main Role Switcher: Teacher vs Student */}
          <div className="flex items-center space-x-1.5 bg-[#151518] p-1.5 rounded-2xl border border-slate-800 shadow-inner">
            <button
              onClick={() => handleRoleClick('student')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'student' || viewMode === 'peer_market'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-indigo-200" />
              <span>Student Portal</span>
            </button>

            <button
              onClick={() => handleRoleClick('teacher')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'teacher' || viewMode === 'graph_explorer'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Users className="w-4 h-4 text-indigo-200" />
              <span>Teacher Workspace</span>
              {currentUser?.role === 'student' && (
                <Lock className="w-3 h-3 text-amber-400 ml-0.5" title="Protected: PIN required for student user" />
              )}
            </button>
          </div>

          {/* Right Controls: User Profile, Subject Selector, Student Switcher, Logout */}
          <div className="flex items-center space-x-3">
            
            {/* Active Authenticated User Badge */}
            {currentUser && (
              <div className="hidden lg:flex items-center space-x-2.5 bg-[#151518] border border-slate-800 rounded-2xl px-3 py-1.5">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/40"
                />
                <div className="text-left">
                  <div className="text-xs font-bold text-white flex items-center space-x-1">
                    <span>{currentUser.name}</span>
                    <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[9px] uppercase">
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>256-Bit SSL Protected</span>
                  </div>
                </div>
              </div>
            )}

            {/* Subject Selector */}
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as SubjectId)}
                className="bg-[#151518] text-slate-200 text-xs rounded-xl px-3 py-1.5 border border-slate-800 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
              >
                <option value="calculus">Calculus I & II</option>
                <option value="physics">Physics: Mechanics</option>
              </select>
            </div>

            {/* Active Student Selector (When in Student View & logged in as Teacher) */}
            {viewMode === 'student' && (
              <div className="relative flex items-center bg-[#151518] rounded-xl px-2.5 py-1 border border-slate-800">
                <img
                  src={selectedStudent?.avatar}
                  alt={selectedStudent?.name}
                  className="w-5 h-5 rounded-full object-cover mr-2 ring-1 ring-indigo-500/40"
                />
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id} className="bg-[#151518] text-slate-200">
                      {s.name} ({s.grade})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Simulation Trigger Button */}
            <button
              onClick={onOpenSimulationDrawer}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
              title="Open Hackathon Demo Simulation Controls"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span className="hidden sm:inline">Simulate Signals</span>
            </button>

            {/* Logout / Lock Portal Button */}
            <button
              onClick={onLogout}
              className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1 cursor-pointer"
              title="Lock Portal / Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden xl:inline text-[11px] font-mono uppercase">Lock Portal</span>
            </button>

          </div>

        </div>

        {/* Mobile View Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/60 text-xs">
          <button
            onClick={() => handleRoleClick('student')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md ${viewMode === 'student' ? 'text-cyan-400 font-bold bg-slate-800' : 'text-slate-400'}`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>
          <button
            onClick={() => handleRoleClick('teacher')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md ${viewMode === 'teacher' ? 'text-indigo-400 font-bold bg-slate-800' : 'text-slate-400'}`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Teacher</span>
          </button>
          <button
            onClick={() => setViewMode('graph_explorer')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md ${viewMode === 'graph_explorer' ? 'text-purple-400 font-bold bg-slate-800' : 'text-slate-400'}`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>DAG</span>
          </button>
          <button
            onClick={() => setViewMode('peer_market')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md ${viewMode === 'peer_market' ? 'text-emerald-400 font-bold bg-slate-800' : 'text-slate-400'}`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Peer</span>
          </button>
        </div>

      </div>
    </header>
  );
};

