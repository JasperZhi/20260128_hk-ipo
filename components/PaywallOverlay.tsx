
import React from 'react';

interface Props {
  onUpgrade: () => void;
}

const PaywallOverlay: React.FC<Props> = ({ onUpgrade }) => {
  return (
    <div className="relative group">
      {/* Blurred Placeholder content would be behind this if wrapped, but here we provide a static teaser-like blur overlay */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[6px] z-10 rounded-xl border border-slate-200 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-amber-100 p-8 text-center animate-fade-in">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">解锁深度投研细节</h3>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            当前章节包含流动性穿透、财务底稿细节及机构退出路线图，仅限 <b>专业版 (PRO)</b> 用户查阅。
          </p>
          <button 
            onClick={onUpgrade}
            className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all transform active:scale-[0.98]"
          >
            立即解锁专业版报告 (70%)
          </button>
          <p className="mt-4 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            One-time Payment · Institutional Access
          </p>
        </div>
      </div>
      
      {/* Visual background filler to make the blur look like it's covering something real */}
      <div className="space-y-4 opacity-5 pointer-events-none select-none">
        <div className="h-4 bg-slate-300 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded w-full"></div>
        <div className="h-24 bg-slate-100 rounded w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
      </div>
    </div>
  );
};

export default PaywallOverlay;
