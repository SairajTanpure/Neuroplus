import React, { useState } from 'react';
import { ShieldAlert, Lock, KeyRound, X, CheckCircle2 } from 'lucide-react';

interface TeacherUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: () => void;
}

export const TeacherUnlockModal: React.FC<TeacherUnlockModalProps> = ({
  isOpen,
  onClose,
  onUnlockSuccess
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234' || pin === 'admin123') {
      setError(null);
      setPin('');
      onUnlockSuccess();
    } else {
      setError('Invalid Teacher Access PIN! Try PIN: 1234');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#151518] border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Security Shield Icon */}
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Protected Portal Gate
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Teacher Credentials Required
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          You are currently logged in with a <strong>Student Account</strong>. Accessing the Teacher Workspace (Gradebook & Class Heatmap) requires Teacher Access PIN authorization.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-mono uppercase text-slate-400 block">
                Enter Teacher PIN
              </label>
              <span className="text-[10px] font-mono text-indigo-400">PIN: 1234</span>
            </div>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="e.g. 1234"
              autoFocus
              className="w-full bg-[#0A0A0B] text-slate-200 text-sm rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-indigo-500 font-mono tracking-widest text-center"
            />
          </div>

          {error && (
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center space-x-2 font-medium">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 bg-[#0A0A0B] hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl border border-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Verify PIN</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
