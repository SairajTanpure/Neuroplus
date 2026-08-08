import React from 'react';
import { PeerMatch, Student, Concept } from '../types';
import { Zap, MessageSquare, CheckCircle2, Users, Award, Sparkles } from 'lucide-react';

interface PeerMarketModalProps {
  peerMatches: PeerMatch[];
  students: Student[];
  concepts: Concept[];
  onConnectPeerMatch: (matchId: string) => void;
}

export const PeerMarketModal: React.FC<PeerMarketModalProps> = ({
  peerMatches,
  students,
  concepts,
  onConnectPeerMatch
}) => {
  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="bg-[#151518] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Zap className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Peer Knowledge Market
              </h1>
            </div>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Instead of relying strictly on AI generators, NeuroPulse operates a live matching engine. When a student hits a root-cause gap, it matches them with a classmate who mastered that concept within the last 48 hours—boosting both the student's comprehension and the peer tutor's retention (the <strong className="text-emerald-400">Protégé Effect</strong>).
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-[#0A0A0B] p-4 rounded-2xl border border-slate-800">
            <Award className="w-8 h-8 text-emerald-400" />
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider block">Protégé Bonus</span>
              <span className="text-lg font-bold text-emerald-400">+15% Retention Boost</span>
            </div>
          </div>
        </div>
      </div>

      {/* Available Peer Matches Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Users className="w-5 h-5 text-emerald-400" />
          <span>Active Peer Knowledge Matches</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {peerMatches.map((pm) => (
            <div
              key={pm.id}
              className="bg-[#151518] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 relative overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={pm.mentorStudentAvatar}
                      alt={pm.mentorStudentName}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-teal-500/40"
                    />
                    <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-teal-500 text-slate-950 font-bold text-[9px]">
                      Tutor
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{pm.mentorStudentName}</h3>
                    <span className="text-xs text-teal-400 font-mono">
                      Mastered {pm.conceptName} ({pm.masteredDaysAgo}d ago)
                    </span>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold border ${
                  pm.status === 'connected'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}>
                  {pm.status}
                </span>
              </div>

              {/* Struggling Student Match Context */}
              <div className="flex items-center space-x-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <img
                  src={pm.strugglingStudentAvatar}
                  alt={pm.strugglingStudentName}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700"
                />
                <p className="text-slate-300">
                  Matched with <strong className="text-white">{pm.strugglingStudentName}</strong> (Root-cause gap in {pm.conceptName}).
                </p>
              </div>

              {/* Icebreaker Prompt */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1">
                <span className="text-[10px] font-mono text-teal-400 uppercase font-bold block">
                  AI-Generated Icebreaker Prompt:
                </span>
                <p className="text-slate-300 italic">"{pm.icebreakerPrompt}"</p>
              </div>

              {/* Practice Challenge */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1">
                <span className="text-[10px] font-mono text-purple-400 uppercase font-bold block">
                  2-Person Practice Challenge:
                </span>
                <p className="text-slate-300">{pm.practiceChallenge}</p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onConnectPeerMatch(pm.id)}
                className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-600/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>
                  {pm.status === 'connected' ? 'Session Connected — Continue Discussion' : 'Accept Match & Send Invitation'}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
