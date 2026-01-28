
import React from 'react';
import { IPORadar as IPORadarType } from '../types';

interface Props {
  data: IPORadarType;
}

const IPORadar: React.FC<Props> = ({ data }) => {
  const { marketSentiment, screeningMetrics } = data;
  const keyTags = screeningMetrics?.keyTags || [];
  
  const sentimentColor = 
    marketSentiment.sentimentTrend === 'Bullish' ? 'text-green-600' :
    marketSentiment.sentimentTrend === 'Bearish' ? 'text-red-600' : 
    marketSentiment.sentimentTrend === 'Pending' ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="bg-slate-100/50 dark:bg-slate-50/5 rounded-3xl border border-slate-200 dark:border-slate-100/10 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left: Sentiment */}
        <div className="p-8 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-100/10">
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 block mb-6">Market Sentiment</span>
           
           <div className="flex items-center gap-8 mb-8">
              <div className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                {marketSentiment.sentimentTrend === 'Pending' ? 'N/A' : marketSentiment.sentimentScore}
              </div>
              <div>
                 <span className={`text-xs font-black uppercase tracking-widest px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${sentimentColor}`}>
                    {marketSentiment.sentimentTrend}
                 </span>
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-slate-200 dark:border-slate-100/10 pb-2">
                 <span className="text-slate-500">International Tranche</span>
                 <span className="font-bold text-slate-900 dark:text-white">{marketSentiment.internationalSubscription}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-200 dark:border-slate-100/10 pb-2">
                 <span className="text-slate-500">Public Tranche</span>
                 <span className="font-bold text-slate-900 dark:text-white">{marketSentiment.publicSubscription}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic mt-4">
                 “{marketSentiment.analystConsensus}”
              </p>
           </div>
        </div>

        {/* Right: Metrics */}
        <div className="p-8 bg-white/20 dark:bg-white/5">
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 block mb-6">Screening Metrics</span>
           
           <div className="flex flex-wrap gap-2 mb-8">
              {keyTags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 shadow-sm">
                   #{tag}
                </span>
              ))}
           </div>

           <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm">
              <div className="flex flex-col">
                 <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">Growth</span>
                 <span className="font-bold text-slate-900 dark:text-white">{screeningMetrics.revenueGrowth}</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">Gross Margin</span>
                 <span className="font-bold text-slate-900 dark:text-white">{screeningMetrics.grossMargin}</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">Valuation Band</span>
                 <span className="font-bold text-slate-900 dark:text-white truncate" title={screeningMetrics.valuationBand}>{screeningMetrics.valuationBand}</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">Listing Rule</span>
                 <span className="font-bold text-indigo-600 dark:text-indigo-400">{screeningMetrics.listingRule}</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default IPORadar;
