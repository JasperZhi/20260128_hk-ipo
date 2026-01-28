import React from 'react';
import { IPOAnalysis } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface Props {
  data: IPOAnalysis;
}

const CapitalStructureCard: React.FC<Props> = ({ data }) => {
  const { issuanceInfo, cornerstones, preIpo } = data;

  const parsePct = (str: string | undefined) => {
    if (!str) return 0;
    return parseFloat(str.replace('%', '')) || 0;
  };
  
  const publicPct = parsePct(issuanceInfo?.publicTranchePct) || 10;
  const internationalPct = parsePct(issuanceInfo?.internationalTranchePct) || 90;
  
  const allocationData = [
    { name: '公开发售 (Public)', value: publicPct, color: '#3B82F6' },
    { name: '国际配售 (Intl)', value: internationalPct, color: '#6366F1' },
  ];

  return (
    <div className="bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden mb-8 transition-colors">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-transparent">
        <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-widest flex items-center gap-2">
           <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
           </svg>
           Capital Structure
        </h3>
        <span className="text-[10px] font-bold text-slate-600 bg-white dark:bg-white/5 px-2 py-1 rounded-lg uppercase tracking-widest border border-slate-100 dark:border-white/5">Ownership Matrix</span>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 space-y-6">
             <div className="grid grid-cols-2 gap-3">
                 <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black block mb-2">Total Shares</span>
                    <span className="text-xs font-bold text-slate-950 dark:text-white truncate block" title={issuanceInfo?.totalShares}>
                        {issuanceInfo?.totalShares || 'N/A'}
                    </span>
                 </div>
                 <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black block mb-2">Greenshoe</span>
                    <span className="text-xs font-bold text-slate-950 dark:text-white truncate block" title={issuanceInfo?.greenshoeOption}>
                        {issuanceInfo?.greenshoeOption || 'N/A'}
                    </span>
                 </div>
             </div>

             <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-white/5 p-4 relative">
                 <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase text-center mb-4 tracking-widest">Offering Allocation</h4>
                 <div className="h-32 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={allocationData}
                                cx="50%"
                                cy="50%"
                                innerRadius={35}
                                outerRadius={50}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                            >
                                {allocationData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                                    border: 'none', 
                                    borderRadius: '12px', 
                                    color: '#fff',
                                    fontSize: '10px'
                                }} 
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                        <span className="text-[8px] text-slate-600 dark:text-slate-400 font-black uppercase">Cornerstone</span>
                        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{issuanceInfo?.cornerstonePctOfOffer || 'N/A'}</span>
                    </div>
                 </div>
                 <div className="flex flex-col gap-2 mt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase">Public</span>
                        </div>
                        <span className="text-[10px] text-slate-950 dark:text-white font-black">{issuanceInfo?.publicTranchePct || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase">International</span>
                        </div>
                        <span className="text-[10px] text-slate-950 dark:text-white font-black">{issuanceInfo?.internationalTranchePct || 'N/A'}</span>
                    </div>
                 </div>
            </div>
        </div>

        <div className="col-span-1 lg:col-span-2 space-y-8">
            <div>
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-white/5 pb-2">
                    <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Cornerstone Matrix</h4>
                    <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400">{(cornerstones || []).length} Anchors</span>
                </div>
                {cornerstones && cornerstones.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {cornerstones.map((c, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-4 border border-slate-100 dark:border-white/5 flex justify-between items-start group hover:border-indigo-500/30 transition-all shadow-sm">
                                <div className="min-w-0 pr-2">
                                    <span className="text-xs font-black text-slate-950 dark:text-white block mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">{c.name}</span>
                                    <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold block leading-tight">{c.details}</span>
                                </div>
                                <span className="text-[8px] font-black bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 px-2 py-1 rounded-lg text-slate-700 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap shadow-xs">
                                    {c.lockup || '6M'}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-slate-50 dark:bg-slate-900/20 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                        Pending Cornerstone Disclosures
                    </div>
                )}
            </div>

            <div>
                <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/5 pb-2">Pre-IPO Funding History</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {preIpo?.financingRounds && preIpo.financingRounds.length > 0 ? (
                        preIpo.financingRounds.map((round, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-4 border border-slate-100 dark:border-white/5 hover:border-indigo-500/30 transition-all group shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-500/20 px-2 py-1 rounded-lg uppercase tracking-widest">{round.round}</span>
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-black">{round.date}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <span className="text-[8px] text-slate-600 dark:text-slate-400 font-black uppercase">Post-Valuation</span>
                                        <span className="text-[10px] font-bold text-slate-950 dark:text-white block">{round.valuation}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[8px] text-slate-600 dark:text-slate-400 font-black uppercase">Discount</span>
                                        <span className={`text-[10px] font-bold block ${round.discount ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>{round.discount || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-8 bg-slate-50 dark:bg-slate-900/20 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 text-slate-500 text-[10px] font-black uppercase tracking-widest">No public financing records found</div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CapitalStructureCard;
