
import React from 'react';
import { PositionAdvice, Recommendation } from '../types';

interface Props {
  advice?: PositionAdvice;
}

const DecisionCard: React.FC<Props> = ({ advice }) => {
  if (!advice) return null;
  
  const isGo = advice.recommendation === Recommendation.GO;

  return (
    <div className={`rounded-3xl border shadow-sm p-8 flex flex-col justify-between h-full transition-all hover:shadow-lg ${isGo ? 'border-green-500/20 bg-green-50/50 dark:bg-green-500/5' : 'border-red-500/20 bg-red-50/50 dark:bg-red-500/5'}`}>
      <div>
          <div className="flex justify-between items-start mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">决策结论 / Decision</span>
            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${isGo ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/30' : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30'}`}>
                {advice.recommendation}
            </span>
          </div>
          <p className="text-xl font-bold text-slate-800 dark:text-slate-200 leading-snug mb-6 tracking-tight">
             {advice.rationale}
          </p>
      </div>
      
      <div className="bg-white/80 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/50 dark:border-white/5 flex justify-between items-center shadow-sm">
         <div>
             <span className="text-[10px] text-slate-400 font-black block uppercase tracking-widest mb-1">Risk Tolerance</span>
             <span className="text-sm font-extrabold text-slate-900 dark:text-white">{advice.maxDrawdownTolerance || '---'}</span>
         </div>
         <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
         </div>
      </div>
    </div>
  );
};

export default DecisionCard;
