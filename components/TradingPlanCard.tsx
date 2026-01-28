import React from 'react';
import { ExitStrategy } from '../types';

// Support both old TradingPlan (for backward compatibility if needed) and new ExitStrategy
interface Props {
  strategies?: ExitStrategy[];
}

const TradingPlanCard: React.FC<Props> = ({ strategies }) => {
  
  if (strategies) {
      return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-blue-900 px-4 py-3 border-b border-blue-800 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">多元化退出策略 (Exit Strategy Matrix)</h3>
            <span className="text-xs text-blue-200">Decision Matrix</span>
          </div>
          <div className="divide-y divide-gray-200">
             {strategies.map((strat, idx) => (
                 <div key={idx} className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide ${
                            strat.investorType.includes('Anchor') 
                            ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                            : 'bg-purple-100 text-purple-800 border border-purple-200'
                        }`}>
                            {strat.investorType}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">周期: {strat.horizon}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">核心操作建议</h4>
                            <p className="text-sm font-medium text-gray-900 leading-relaxed bg-gray-50 p-3 rounded border border-gray-100">
                                {strat.primaryAction}
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                             <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">关键观察节点 (KPIs)</h4>
                                <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                                    {strat.keyObservationPoints.map((pt, i) => (
                                        <li key={i}>{pt}</li>
                                    ))}
                                </ul>
                             </div>
                             <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">风控 / 对冲 (Risk Control)</h4>
                                <p className="text-xs font-bold text-red-600">{strat.stopLossOrHedge}</p>
                             </div>
                        </div>
                    </div>
                 </div>
             ))}
          </div>
        </div>
      )
  }

  // Fallback for old data structure if needed
  return null;
};

export default TradingPlanCard;