import React from 'react';
import {
  Sparkles,
  Clock,
  MessageSquare,
  RefreshCw,
  X,
  Play,
  Zap,
  Check
} from 'lucide-react';

interface SimulationControlsProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateDecay: () => void;
  onSimulateConfusedQA: () => void;
  onSimulateFailedQuizzes: () => void;
  onResetBaseline: () => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  isOpen,
  onClose,
  onSimulateDecay,
  onSimulateConfusedQA,
  onSimulateFailedQuizzes,
  onResetBaseline
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-6 shadow-2xl relative">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white">
                Hackathon Demo Simulation Controls
              </h2>
              <p className="text-xs text-slate-400">
                Trigger live cognitive signals to watch the analytics engine adapt instantly!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          
          {/* Action 1: Time Lapse Decay */}
          <button
            onClick={() => {
              onSimulateDecay();
              onClose();
            }}
            className="w-full text-left p-4 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition-all cursor-pointer group flex items-start space-x-3"
          >
            <Clock className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="text-xs font-bold text-white group-hover:text-cyan-300">
                1. Fast-Forward Time (+7 Days Forgetting Curve)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Applies exponential decay factor e^(-λt) across untouched concepts. Watch scores degrade and critical risk alerts fire!
              </p>
            </div>
          </button>

          {/* Action 2: Confused Q&A Phrasing Injection */}
          <button
            onClick={() => {
              onSimulateConfusedQA();
              onClose();
            }}
            className="w-full text-left p-4 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition-all cursor-pointer group flex items-start space-x-3"
          >
            <MessageSquare className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="text-xs font-bold text-white group-hover:text-purple-300">
                2. Inject Confused Q&A Phrasing
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Simulates student asking a question with hesitant wording. NLP sentiment analyzer lowers phrasing score, flagging hidden gaps.
              </p>
            </div>
          </button>

          {/* Action 3: Quiz Friction & Hesitation Clicks */}
          <button
            onClick={() => {
              onSimulateFailedQuizzes();
              onClose();
            }}
            className="w-full text-left p-4 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition-all cursor-pointer group flex items-start space-x-3"
          >
            <Zap className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="text-xs font-bold text-white group-hover:text-amber-300">
                3. Inject Quiz Retries & Hesitation Clicks
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Simulates 5 quiz retries and high hesitation clicks on Product Rule, triggering root-cause traceback in Integration by Parts.
              </p>
            </div>
          </button>

          {/* Action 4: Reset Baseline */}
          <button
            onClick={() => {
              onResetBaseline();
              onClose();
            }}
            className="w-full text-left p-4 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition-all cursor-pointer group flex items-start space-x-3"
          >
            <RefreshCw className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="text-xs font-bold text-white group-hover:text-emerald-300">
                4. Reset to Clean Seeded Baseline
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Restores original student performance dataset and resets simulation counters.
              </p>
            </div>
          </button>

        </div>

      </div>
    </div>
  );
};
