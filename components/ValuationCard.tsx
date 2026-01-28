
import React from 'react';
import { ValuationData } from '../types';

interface Props {
  data: ValuationData;
}

const ValuationCard: React.FC<Props> = ({ data }) => {
  const peers = data?.peers || [];
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-green-50 px-4 py-3 border-b border-green-100">
        <h3 className="text-sm font-semibold text-green-900 uppercase tracking-wider">估值锚定 (Valuation Anchoring)</h3>
      </div>
      
      <div className="p-5">
        <div className="mb-4">
             <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 gap-2">
                 <h4 className="text-xs font-bold text-gray-500 uppercase">可比公司对标 (Peer Comparison)</h4>
                 <div className="text-right space-y-1">
                    <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-gray-400">合理市值:</span>
                        <span className="text-sm font-bold text-gray-900 bg-yellow-100 px-2 py-0.5 rounded">{data.fairValueRange}</span>
                    </div>
                    {data.fairPrice && (
                         <div className="flex items-center justify-end gap-2">
                            <span className="text-xs text-gray-400">合理定价:</span>
                            <span className="text-sm font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100">{data.fairPrice}</span>
                        </div>
                    )}
                 </div>
             </div>
             
             <div className="overflow-x-auto border border-gray-100 rounded-lg mb-3">
                 <table className="min-w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="px-3 py-2 font-medium">公司名称</th>
                            <th className="px-3 py-2 font-medium">代码</th>
                            <th className="px-3 py-2 font-medium">PE (TTM)</th>
                            <th className="px-3 py-2 font-medium">PB (MRQ)</th>
                            <th className="px-3 py-2 font-medium">市值</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {peers.map((peer, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-3 py-2 font-medium text-gray-900">{peer.name}</td>
                                <td className="px-3 py-2 text-gray-500">{peer.ticker}</td>
                                <td className="px-3 py-2 text-gray-700">{peer.pe || '-'}</td>
                                <td className="px-3 py-2 text-gray-700">{peer.pb || '-'}</td>
                                <td className="px-3 py-2 text-gray-700">{peer.marketCap || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
             </div>
             
             <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded border border-gray-100 italic">
                💡 {data.valuationComment}
             </p>
        </div>
      </div>
    </div>
  );
};

export default ValuationCard;
