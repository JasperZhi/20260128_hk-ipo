import React from 'react';
import { LiquidityAnalysis } from '../types';

interface Props {
  data: LiquidityAnalysis;
}

const LiquidityRiskCard: React.FC<Props> = ({ data }) => {
  const isPending = data.anchorHeatIndex.status === 'Pending';
  
  const heatColor = isPending ? 'text-gray-400' : data.anchorHeatIndex.score >= 80 ? 'text-red-600' : data.anchorHeatIndex.score >= 50 ? 'text-orange-500' : 'text-blue-500';
  const heatBg = isPending ? 'bg-gray-50' : data.anchorHeatIndex.score >= 80 ? 'bg-red-50' : data.anchorHeatIndex.score >= 50 ? 'bg-orange-50' : 'bg-blue-50';

  const isRetailPending = (val: string) => {
      const v = val.toLowerCase();
      return v.includes('pending') || v.includes('n/a') || v.includes('待定');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-indigo-900 uppercase tracking-wider">流动性博弈与风险 (Liquidity & Risk)</h3>
        <span className="text-xs text-indigo-400">Smart Core Radar</span>
      </div>
      
      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Anchor Heat Index */}
        <div className={`col-span-1 rounded-lg border border-gray-100 p-4 ${heatBg}`}>
           <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">锚定热度指数 (Anchor Heat)</h4>
           <div className="flex items-end gap-2 mb-2">
             <span className={`text-4xl font-extrabold ${heatColor}`}>
                 {isPending ? 'N/A' : data.anchorHeatIndex.score}
             </span>
             <span className={`text-sm font-medium mb-1 px-2 py-0.5 rounded-full bg-white border border-gray-100 ${heatColor}`}>
                {data.anchorHeatIndex.status === 'Pending' ? '待定' : data.anchorHeatIndex.status}
             </span>
           </div>
           <p className="text-xs text-gray-600 leading-snug">{data.anchorHeatIndex.comment}</p>
        </div>

        {/* Lock-up Risk */}
        <div className="col-span-1 border-l md:border-l border-gray-100 pl-4 md:pl-6">
           <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">锁定期风险 (6-Month Lock-up)</h4>
           <div className="space-y-3">
             <div className="flex justify-between items-center">
               <span className="text-xs text-gray-400">风险等级</span>
               <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                   data.lockUpRisk.riskLevel === 'High' ? 'bg-red-100 text-red-700' : 
                   data.lockUpRisk.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
               }`}>
                 {data.lockUpRisk.riskLevel}
               </span>
             </div>
             <div>
                <span className="text-xs text-gray-400 block mb-1">解禁抛压预测</span>
                <p className="text-xs text-gray-800 font-medium leading-tight">{data.lockUpRisk.sellingPressure}</p>
             </div>
             <div>
                <span className="text-xs text-gray-400 block mb-1">市场波动性预测</span>
                <p className="text-xs text-gray-800 font-medium">{data.lockUpRisk.marketVolatilityPrediction}</p>
             </div>
           </div>
        </div>

        {/* Retail Sentiment / Clawback */}
        <div className="col-span-1 border-l md:border-l border-gray-100 pl-4 md:pl-6">
           <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">散户情绪与回拨 (Retail Sentiment)</h4>
           <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-400 block">实时认购倍数</span>
                {isRetailPending(data.retailSentiment.subscriptionMultiple) ? (
                     <span className="text-sm font-bold text-gray-400 italic">待定 (Pending)</span>
                ) : (
                    <span className="text-sm font-mono font-bold text-gray-900">{data.retailSentiment.subscriptionMultiple}</span>
                )}
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-100">
                <span className="text-xs text-gray-400 block mb-1">回拨机制预判</span>
                <p className="text-xs text-blue-700 font-semibold">{data.retailSentiment.clawbackPrediction}</p>
              </div>
              <p className="text-[10px] text-gray-400 italic">
                 *高回拨比例将挤压国配份额，推高锚定稀缺性。
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidityRiskCard;