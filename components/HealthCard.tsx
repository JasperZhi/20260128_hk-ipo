
import React from 'react';
import { HealthCheckItem, HealthStatus } from '../types';

interface Props {
  items: HealthCheckItem[];
}

const HealthCard: React.FC<Props> = ({ items }) => {
  const checkItems = items || [];
  
  const getStatusIcon = (status: HealthStatus) => {
    switch (status) {
      case HealthStatus.GREEN: 
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case HealthStatus.YELLOW:
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case HealthStatus.RED:
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">项目健康度检查 (Health Check)</h3>
        <span className="text-xs text-gray-500">自动核验</span>
      </div>
      <div className="divide-y divide-gray-100">
        {checkItems.map((item) => (
          <div key={item.id} className="px-4 py-3 flex items-start space-x-3 hover:bg-gray-50 transition-colors">
            <div className="mt-0.5 flex-shrink-0">
               {getStatusIcon(item.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    item.status === HealthStatus.RED ? 'bg-red-100 text-red-800' : 
                    item.status === HealthStatus.YELLOW ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {item.value}
                </span>
              </div>
              {item.issue && (
                <p className="mt-1 text-xs text-red-600">
                   ⚠ {item.issue}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthCard;
