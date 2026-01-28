import React from 'react';

interface Props {
  progressMessage: string;
}

const SkeletonDashboard: React.FC<Props> = ({ progressMessage }) => {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Progress Status Bar */}
      <div className="mb-8 bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col items-center justify-center shadow-sm">
         <div className="flex items-center space-x-3 mb-3">
             <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
             <span className="text-blue-800 font-bold text-lg">{progressMessage}</span>
         </div>
         <div className="w-full max-w-md bg-blue-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-600 h-1.5 rounded-full animate-progress-indeterminate"></div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         {/* Left Sidebar Skeleton */}
         <aside className="hidden lg:block lg:col-span-2 space-y-4 sticky top-24">
             <div className="h-4 bg-slate-200 rounded w-24 mb-6"></div>
             {[...Array(8)].map((_, i) => (
                 <div key={i} className="h-8 bg-slate-100 rounded w-full"></div>
             ))}
             <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="h-4 bg-slate-200 rounded w-16 mb-4"></div>
                <div className="h-8 bg-slate-100 rounded w-full mb-2"></div>
                <div className="h-8 bg-slate-100 rounded w-full"></div>
             </div>
         </aside>

         {/* Center Content Skeleton */}
         <div className="lg:col-span-7 space-y-8">
             {/* Header Card */}
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
                 <div className="flex justify-between items-start">
                     <div className="space-y-4 w-2/3">
                         <div className="h-8 bg-slate-200 rounded w-3/4"></div>
                         <div className="flex gap-2">
                            <div className="h-6 bg-slate-100 rounded w-20"></div>
                            <div className="h-6 bg-slate-100 rounded w-20"></div>
                         </div>
                         <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                     </div>
                     <div className="h-8 bg-slate-200 rounded w-24"></div>
                 </div>
             </div>

             {/* Radar Skeleton */}
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <div className="flex justify-between mb-6">
                    <div className="h-6 bg-slate-200 rounded w-48"></div>
                    <div className="h-4 bg-slate-100 rounded w-24"></div>
                 </div>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-64">
                     <div className="bg-slate-50 rounded-lg border border-slate-100"></div>
                     <div className="bg-slate-50 rounded-lg border border-slate-100"></div>
                 </div>
             </div>

             {/* Liquidity Skeleton */}
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="h-6 bg-slate-200 rounded w-40 mb-6"></div>
                  <div className="grid grid-cols-3 gap-6 h-40">
                      <div className="bg-slate-50 rounded-lg border border-slate-100 col-span-1"></div>
                      <div className="bg-slate-50 rounded-lg border border-slate-100 col-span-1"></div>
                      <div className="bg-slate-50 rounded-lg border border-slate-100 col-span-1"></div>
                  </div>
             </div>

             {/* Financials Skeleton */}
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <div className="flex justify-between mb-6">
                    <div className="h-6 bg-slate-200 rounded w-32"></div>
                    <div className="h-4 bg-slate-100 rounded w-16"></div>
                 </div>
                 <div className="space-y-4">
                     <div className="h-10 bg-slate-100 rounded w-full"></div>
                     <div className="h-8 bg-slate-50 rounded w-full"></div>
                     <div className="h-8 bg-slate-50 rounded w-full"></div>
                     <div className="h-8 bg-slate-50 rounded w-full"></div>
                 </div>
                 <div className="mt-6 h-24 bg-yellow-50 rounded border border-yellow-100"></div>
             </div>
         </div>

         {/* Right Panel Skeleton */}
         <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24">
             {/* Score Card */}
             <div className="bg-white rounded-xl shadow-lg border border-indigo-50 h-72 p-6 flex flex-col items-center justify-center space-y-4">
                 <div className="h-4 bg-slate-200 rounded w-20"></div>
                 <div className="h-16 bg-slate-200 rounded w-32"></div>
                 <div className="w-full h-px bg-slate-100"></div>
                 <div className="h-20 bg-slate-50 rounded w-full"></div>
             </div>

             {/* Health Check */}
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-64 p-4 space-y-3">
                 <div className="h-5 bg-slate-200 rounded w-32 mb-2"></div>
                 <div className="h-8 bg-red-50 rounded w-full"></div>
                 <div className="h-8 bg-red-50 rounded w-full"></div>
                 <div className="h-8 bg-green-50 rounded w-full"></div>
             </div>
         </aside>
      </div>
      <style>{`
        @keyframes progress-indeterminate {
          0% { margin-left: -50%; width: 50%; }
          100% { margin-left: 100%; width: 50%; }
        }
        .animate-progress-indeterminate {
          animation: progress-indeterminate 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default SkeletonDashboard;