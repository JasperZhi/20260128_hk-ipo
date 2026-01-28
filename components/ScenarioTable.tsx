
import React from 'react';
import { ScenarioResult, ScenarioType } from '../types';

interface Props {
  scenarios: ScenarioResult[];
}

const ScenarioTable: React.FC<Props> = ({ scenarios }) => {
  const scenarioItems = scenarios || [];
  
  const getHeaderColor = (type: ScenarioType) => {
    switch (type) {
      case ScenarioType.CONSERVATIVE: return 'border-t-4 border-gray-400 bg-gray-50';
      case ScenarioType.BASE: return 'border-t-4 border-blue-500 bg-blue-50';
      case ScenarioType.OPTIMISTIC: return 'border-t-4 border-green-500 bg-green-50';
    }
  };

  const getScenarioLabel = (type: ScenarioType) => {
    switch (type) {
        case ScenarioType.CONSERVATIVE: return '保守情景';
        case ScenarioType.BASE: return '基准情景';
        case ScenarioType.OPTIMISTIC: return '乐观情景';
        default: return type;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">不确定性情景分析 (Uncertainty Scenarios)</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        {scenarioItems.map((scenario, idx) => (
           <div key={idx} className={`p-4 ${getHeaderColor(scenario.type)}`}>
              <h4 className="font-bold text-gray-900 mb-3">{getScenarioLabel(scenario.type)}</h4>
              
              <div className="space-y-3 text-sm">
                  <div>
                      <p className="text-xs text-gray-500">认购倍数</p>
                      <p className="font-medium text-gray-800">{scenario.subscriptionMultiple}</p>
                  </div>
                   <div>
                      <p className="text-xs text-gray-500">首日预期收益</p>
                      <p className={`font-bold ${scenario.expectedReturn?.includes('-') ? 'text-red-600' : 'text-green-600'}`}>{scenario.expectedReturn}</p>
                  </div>
                  <div>
                      <p className="text-xs text-gray-500">流动性</p>
                      <p className="font-medium text-gray-800">{scenario.liquidity}</p>
                  </div>
                   <div className="pt-2 border-t border-gray-200/50">
                      <p className="text-xs text-gray-500">对策 (Action)</p>
                      <p className="font-medium text-gray-900 italic">"{scenario.action}"</p>
                  </div>
              </div>
           </div>
        ))}
      </div>
    </div>
  );
};

export default ScenarioTable;
