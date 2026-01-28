
import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  username: string;
}

const PaymentModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, username }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    // Simulate payment gateway delay
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white text-center relative">
          <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="inline-flex items-center justify-center p-3 bg-amber-500 rounded-2xl mb-4 shadow-lg shadow-amber-500/20">
            <svg className="w-8 h-8 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">升级专业投研账户</h2>
          <p className="text-slate-400 text-sm mt-1">账户: {username}</p>
        </div>

        <div className="p-8">
          {/* Plan Selection */}
          <div className="space-y-4 mb-8">
            <div className="relative p-5 border-2 border-amber-500 bg-amber-50 rounded-2xl flex justify-between items-center group cursor-pointer">
              <div className="absolute -top-3 right-6 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">最受欢迎</div>
              <div>
                <h4 className="font-bold text-slate-900">专业版 (PRO) · 终身</h4>
                <p className="text-xs text-slate-500">解锁所有 IPO 深度报告及 AI 助手高级模式</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">¥1,999</span>
                <p className="text-[10px] text-slate-400">一次性买断</p>
              </div>
            </div>

            <div className="p-5 border border-slate-200 rounded-2xl flex justify-between items-center hover:border-slate-300 transition-all cursor-pointer">
              <div>
                <h4 className="font-bold text-slate-800">单篇报告解锁</h4>
                <p className="text-xs text-slate-500">仅解锁当前所选标的的全部深度数据</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-slate-800">¥199</span>
                <p className="text-[10px] text-slate-400">/ 每篇</p>
              </div>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-6 mb-8 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              机构级估值对标
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              实时国配博弈透视
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              离场/止损点位计算
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              AI 助手深度问答
            </div>
          </div>

          {/* Action */}
          <button 
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                正在连接支付网关...
              </>
            ) : (
              '确认支付并立即解锁'
            )}
          </button>

          <div className="mt-6 flex justify-center items-center gap-4 grayscale opacity-40">
            <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-6" alt="Visa" />
            <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-6" alt="Mastercard" />
            <img src="https://img.icons8.com/color/48/000000/wechat-pay.png" className="h-6" alt="Wechat" />
            <img src="https://img.icons8.com/color/48/000000/alipay.png" className="h-6" alt="Alipay" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
