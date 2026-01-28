
import React, { useState } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

const AuthModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);


  React.useEffect(() => {
    if (isOpen) {
      setIsLogin(true);
      setUsername('');
      setPassword('');
      setError('');
    }
  }, [isOpen]);


  if (!isOpen) return null;


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {

      let response;
      if (isLogin) {
        response = await authService.login(username, password);
      } else {
        response = await authService.register(username, password);
      }
      onSuccess(response.user);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 animate-slide-up">
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-300 hover:text-slate-600 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 ask-gradient rounded-2xl shadow-lg text-white mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{isLogin ? '欢迎回来' : '创建投研账户'}</h2>
          <p className="text-slate-500 mt-1 text-sm">登录以解锁全网搜索与深度分析</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="ipo-username"
            autoComplete="off"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400 font-medium"
            placeholder="用户名"
          />

          <input
            type="password"
            name="ipo-password"
            autoComplete="off"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400 font-medium"
            placeholder="密码"
          />


          {error && <p className="text-red-500 text-xs font-bold px-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full ask-gradient text-white font-extrabold py-3.5 rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? '处理中...' : (isLogin ? '立即登录' : '注册并开始')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">
            {isLogin ? '还没有账号？创建账户' : '已有账号？立即登录'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
