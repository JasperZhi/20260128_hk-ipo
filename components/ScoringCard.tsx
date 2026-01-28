
import React from 'react';
import { ScoringModel } from '../types';

interface Props {
  model: ScoringModel;
}

const ScoringCard: React.FC<Props> = ({ model }) => {
  const scoreColor = model.totalScore >= 70 ? 'text-cyan-500' : model.totalScore >= 50 ? 'text-amber-500' : 'text-red-500';
  const barColor = model.totalScore >= 70 ? 'bg-cyan-500' : model.totalScore >= 50 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="ask-card p-8 rounded-[2.5rem] flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-8">
           <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2">Quant Rating</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Scoring Model</h3>
           </div>
           <div className="text-5xl font-black tracking-tighter transition-all duration-700">
              <span className={scoreColor}>{model.totalScore}</span>
              <span className="text-xl text-slate-400 dark:text-slate-600 ml-1">/100</span>
           </div>
        </div>

        <div className="space-y-6">
          {model.dimensions.map((dim, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-[11px] font-black uppercase tracking-wider mb-2">
                <span className="text-slate-500 dark:text-slate-400">{dim.name}</span>
                <span className="text-slate-900 dark:text-white">{dim.score}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${barColor}`}
                  style={{ width: `${dim.score}%`, boxShadow: `0 0 10px ${barColor}50` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/5">
        <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
          “{model.summary}”
        </p>
      </div>
    </div>
  );
};

export default ScoringCard;
