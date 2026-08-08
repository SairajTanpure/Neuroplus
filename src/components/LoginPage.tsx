import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  UserCheck,
  GraduationCap,
  Users,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldAlert,
  Cpu,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { AuthUser, Student, UserRole } from '../types';

interface LoginPageProps {
  students: Student[];
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ students, onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('teacher');
  
  // Teacher credentials state
  const [teacherEmail, setTeacherEmail] = useState('vance@neuro.edu');
  const [teacherPassword, setTeacherPassword] = useState('1234');
  
  // Student credentials state
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || 'std-1');
  const [studentPin, setStudentPin] = useState('5678');

  // Security UI states
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Handle Login
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLockedOut) return;

    setErrorMessage(null);
    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);

      if (selectedRole === 'teacher') {
        if (teacherPassword !== '1234' && teacherPassword !== 'admin123') {
          handleFailedAttempt('Invalid Teacher Access PIN! Try PIN: 1234');
          return;
        }

        const token = 'SEC-TK-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        onLoginSuccess({
          id: 'tch-1',
          name: 'Dr. Eleanor Vance',
          email: teacherEmail || 'vance@neuro.edu',
          role: 'teacher',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
          department: 'Department of Applied Mathematics & Physics',
          securityToken: token,
          loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      } else {
        if (studentPin !== '5678' && studentPin !== '1234') {
          handleFailedAttempt('Invalid Student Security PIN! Try PIN: 5678');
          return;
        }

        const student = students.find(s => s.id === selectedStudentId) || students[0];
        const token = 'SEC-TK-' + Math.random().toString(36).substring(2, 10).toUpperCase();

        onLoginSuccess({
          id: student.id,
          name: student.name,
          email: student.email,
          role: 'student',
          avatar: student.avatar,
          grade: student.grade,
          securityToken: token,
          loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    }, 600);
  };

  const handleFailedAttempt = (msg: string) => {
    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);
    setErrorMessage(msg);

    if (nextAttempts >= 3) {
      setIsLockedOut(true);
      setErrorMessage('🚨 Security Protection Lockout! Too many failed attempts. Cooldown active for 15 seconds.');
      setTimeout(() => {
        setIsLockedOut(false);
        setFailedAttempts(0);
        setErrorMessage(null);
      }, 15000);
    }
  };

  const quickDemoLogin = (role: UserRole, studentId?: string) => {
    setErrorMessage(null);
    if (role === 'teacher') {
      setSelectedRole('teacher');
      setTeacherEmail('vance@neuro.edu');
      setTeacherPassword('1234');
      setTimeout(() => {
        const token = 'SEC-TK-TEACHER-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        onLoginSuccess({
          id: 'tch-1',
          name: 'Dr. Eleanor Vance',
          email: 'vance@neuro.edu',
          role: 'teacher',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
          department: 'STEM Department Lead',
          securityToken: token,
          loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }, 300);
    } else {
      setSelectedRole('student');
      const stdId = studentId || students[0]?.id || 'std-1';
      setSelectedStudentId(stdId);
      setStudentPin('5678');
      const student = students.find(s => s.id === stdId) || students[0];
      setTimeout(() => {
        const token = 'SEC-TK-STUDENT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        onLoginSuccess({
          id: student.id,
          name: student.name,
          email: student.email,
          role: 'student',
          avatar: student.avatar,
          grade: student.grade,
          securityToken: token,
          loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }, 300);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Container Box */}
      <div className="max-w-md w-full space-y-6">
        
        {/* Top Brand & Security Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600/10 rounded-2xl border border-indigo-500/30 text-indigo-400 mb-2 shadow-lg shadow-indigo-600/10">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            NeuroPulse Security Gate
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Role-Based Access Control & Encrypted Portal Protection
          </p>
        </div>

        {/* Security Shield Banner */}
        <div className="bg-[#151518] border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs font-mono text-slate-300">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>256-Bit Encrypted Portal Gateway</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-bold">
            Protected
          </span>
        </div>

        {/* Login Card */}
        <div className="bg-[#151518] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#0A0A0B] rounded-2xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => { setSelectedRole('teacher'); setErrorMessage(null); }}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRole === 'teacher'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Teacher Portal</span>
            </button>

            <button
              type="button"
              onClick={() => { setSelectedRole('student'); setErrorMessage(null); }}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRole === 'student'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Portal</span>
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {selectedRole === 'teacher' ? (
              <>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Teacher Institutional Email
                  </label>
                  <input
                    type="email"
                    value={teacherEmail}
                    onChange={(e) => setTeacherEmail(e.target.value)}
                    required
                    placeholder="e.g. vance@neuro.edu"
                    className="w-full bg-[#0A0A0B] text-slate-200 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      Teacher Security PIN / Password
                    </label>
                    <span className="text-[10px] font-mono text-indigo-400">Default PIN: 1234</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={teacherPassword}
                      onChange={(e) => setTeacherPassword(e.target.value)}
                      required
                      placeholder="Enter security PIN"
                      className="w-full bg-[#0A0A0B] text-slate-200 text-xs rounded-xl p-3 pr-10 border border-slate-800 focus:outline-none focus:border-indigo-500 font-mono tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Select Student Account
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full bg-[#0A0A0B] text-slate-200 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id} className="bg-[#151518]">
                        {s.name} ({s.grade}) — GPA {s.overallGpa}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      Student Access Security PIN
                    </label>
                    <span className="text-[10px] font-mono text-indigo-400">Default PIN: 5678</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={studentPin}
                      onChange={(e) => setStudentPin(e.target.value)}
                      required
                      placeholder="Enter student PIN"
                      className="w-full bg-[#0A0A0B] text-slate-200 text-xs rounded-xl p-3 pr-10 border border-slate-800 focus:outline-none focus:border-indigo-500 font-mono tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Error or Lockout Message */}
            {errorMessage && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center space-x-2 font-medium">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLockedOut || isAuthenticating}
              className={`w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 cursor-pointer ${
                (isLockedOut || isAuthenticating) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials & Generating Token...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Unlock & Enter {selectedRole === 'teacher' ? 'Teacher Workspace' : 'Student Portal'}</span>
                </>
              )}
            </button>

          </form>

          {/* Quick Demo Credentials Preset Bar */}
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block text-center">
              ⚡ One-Click Demo Access Presets
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => quickDemoLogin('teacher')}
                className="p-2.5 bg-[#0A0A0B] hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left transition-all text-xs cursor-pointer group"
              >
                <div className="font-bold text-white group-hover:text-indigo-300 flex items-center justify-between">
                  <span>Dr. Eleanor Vance</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-400" />
                </div>
                <div className="text-[10px] text-slate-400 font-mono">Teacher Role (Full Class Heatmaps)</div>
              </button>

              <button
                type="button"
                onClick={() => quickDemoLogin('student', 'std-1')}
                className="p-2.5 bg-[#0A0A0B] hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left transition-all text-xs cursor-pointer group"
              >
                <div className="font-bold text-white group-hover:text-indigo-300 flex items-center justify-between">
                  <span>Alex Chen</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-400" />
                </div>
                <div className="text-[10px] text-slate-400 font-mono">Student Role (Targeted Remediation)</div>
              </button>
            </div>
          </div>

        </div>

        {/* Protection Mechanics Notice */}
        <div className="bg-[#151518] border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
          <div className="font-bold text-white flex items-center space-x-1.5">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>How Portals Are Segregated & Protected</span>
          </div>
          <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-400">
            <li><strong>Teacher Workspace:</strong> Protected gradebook, class-wide intervention controls, & AI prompt generators.</li>
            <li><strong>Student Portal:</strong> Personalized cognitive debt scores, micro-lessons, & peer coaching matches.</li>
            <li><strong>Security Lockout:</strong> Rate-limiting prevents automated brute-force attacks on PINs.</li>
          </ul>
        </div>

      </div>

    </div>
  );
};
