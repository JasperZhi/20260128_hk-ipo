import React, { useState, useEffect, useRef } from 'react';
import { analyzeIPO, getIPOVsHistory } from './services/geminiService';
import { IPOAnalysis, Language, Theme, User } from './types';
import { authService } from './services/authService';
import { logService } from './services/logService';
import HealthCard from './components/HealthCard';
import ScoringCard from './components/ScoringCard';
import DecisionCard from './components/DecisionCard';
import TradingPlanCard from './components/TradingPlanCard';
import ScenarioTable from './components/ScenarioTable';
import LiquidityRiskCard from './components/LiquidityRiskCard';
import ValuationCard from './components/ValuationCard';
import IPORadar from './components/IPORadar';
import CapitalStructureCard from './components/CapitalStructureCard';
import ResearchAssistant from './components/ResearchAssistant';
import AuthModal from './components/AuthModal';
import PaymentModal from './components/PaymentModal';
import AdminLogPanel from './components/AdminLogPanel';
import PaywallOverlay from './components/PaywallOverlay';

const i18n = {
  zh: {
    appTitle: 'IPO Lens',
    newAnalysis: '新搜索',
    recentResearch: '投研历史',
    landingTitle: '全球 IPO 投研同步',
    landingSub: '聚合交易所公告与全网终端数据，生成机构级深度合成报告。',
    placeholder: '公司名称或代码...',
    multiplePlaceholder: '认购倍数...',
    analyze: '生成报告',
    sources: '数据源溯源',
    sentimentTitle: '情绪与定价对标',
    institutionalInsights: '机构核心逻辑',
    suggested: '进一步追问',
    theme: '主题',
    executiveSummary: '执行摘要',
    validated: '数据已核验',
    historyEmpty: '暂无投研记录'
  },
  en: {
    appTitle: 'IPO Lens',
    newAnalysis: 'New Research',
    recentResearch: 'History',
    landingTitle: 'Real-time IPO Research',
    landingSub: 'Synthesize institutional intelligence from global exchange filings.',
    placeholder: 'Company or code...',
    multiplePlaceholder: 'Sub multiple...',
    analyze: 'Synthesize',
    sources: 'Source Verification',
    sentimentTitle: 'Sentiment & Benchmarking',
    institutionalInsights: 'Institutional Logic',
    suggested: 'Suggested Deep Dives',
    theme: 'Theme',
    executiveSummary: 'Executive Summary',
    validated: 'Data Validated',
    historyEmpty: 'No research history'
  }
};

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [subMultiple, setSubMultiple] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [data, setData] = useState<IPOAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<IPOAnalysis[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAdminLogOpen, setIsAdminLogOpen] = useState(false);

  const [lang, setLang] = useState<Language>((localStorage.getItem('ipo_lang') as Language) || 'zh');
  const [theme, setTheme] = useState<Theme>((localStorage.getItem('ipo_theme') as Theme) || 'dark');

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const u = await authService.getCurrentUser();
      setUser(u);
      if (u) {
        const serverHistory = await getIPOVsHistory(u.username);
        if (serverHistory.length > 0) setHistory(serverHistory);
      }
    };
    init();
  }, []);


  useEffect(() => {
    const saved = localStorage.getItem('ipo_history_local');
    if (saved) try { setHistory(JSON.parse(saved)); } catch (e) { }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('ipo_theme', theme);
  }, [theme]);


  const t = i18n[lang];

  const handleSearch = async (e?: React.FormEvent, customQuery?: string, customSub?: string) => {
    e?.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const activeQuery = customQuery || query;
    const activeSub = customSub || subMultiple;
    if (!activeQuery.trim()) return;

    if (!user.isPremium && user.usageCount >= 3) {
      setIsPaymentModalOpen(true);
      return;
    }

    setLoading(true);
    setError(null);
    setIsSidebarOpen(false);
    setLoadingMessage(lang === 'zh' ? "正在核算并同步机构终端..." : "Synchronizing institutional terminals...");

    try {
      const result = await analyzeIPO(activeQuery, activeSub, undefined, undefined, (msg) => {
        setLoadingMessage(msg);
      }, lang);

      setData(result);
      if (activeQuery !== query) setQuery(activeQuery);
      if (activeSub !== subMultiple) setSubMultiple(activeSub);

      const newHistory = [result, ...history.filter(h => h.companyName !== result.companyName)].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem('ipo_history_local', JSON.stringify(newHistory));

      // Log Success
      if (user) {
        logService.addLog(user.username, 'SEARCH_SUCCESS', `Successfully analyzed ${result.companyName}`, { code: result.stockCode, sub: activeSub });
      }

      contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err?.message || "Synthesis disrupted.");
      if (user) {
        logService.addLog(user.username, 'SEARCH_FAILURE', `Analysis failed for ${activeQuery}: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };



  const hasResultOrLoading = !!(data || loading || error);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 selection:bg-indigo-500/30 transition-colors duration-500">

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-[60] w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-white/5 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10 cursor-pointer group" onClick={() => { setData(null); setQuery(''); setSubMultiple(''); setError(null); }}>
            <div className="w-10 h-10 ask-gradient rounded-xl flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-all">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white">{t.appTitle}</span>
          </div>

          <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl mb-6">
            <button onClick={() => setLang('zh')} className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${lang === 'zh' ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500'}`}>CN</button>
            <button onClick={() => setLang('en')} className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${lang === 'en' ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500'}`}>EN</button>
          </div>

          <button onClick={() => { setData(null); setQuery(''); setSubMultiple(''); setError(null); setIsSidebarOpen(false); }} className="flex items-center gap-3 w-full px-5 py-3.5 mb-8 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl text-sm font-black shadow-lg hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            {t.newAnalysis}
          </button>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-1">
            <p className="px-4 section-label mb-4 opacity-50">{t.recentResearch}</p>
            {history.length === 0 ? (
              <p className="px-4 text-[10px] text-slate-400 italic py-2">{t.historyEmpty}</p>
            ) : (
              history.map((item, idx) => (
                <button key={idx} onClick={() => { setData(item); setError(null); setIsSidebarOpen(false); setQuery(item.companyName); }} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold truncate transition-all ${data?.companyName === item.companyName ? 'bg-indigo-500/10 text-indigo-500 dark:bg-white/5' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}>
                  {item.companyName}
                </button>
              ))
            )}
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-white/5 space-y-4">
            {user && (
              <div className="px-4 mb-4">
                <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-white/5 rounded-2xl">
                  <div className="w-8 h-8 rounded-lg ask-gradient flex items-center justify-center text-white font-black text-xs shadow-lg">
                    {user.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black text-slate-900 dark:text-white truncate">{user.username}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{user.isPremium ? '💎 Premium VIP' : 'Free Research'}</p>
                  </div>
                  <button onClick={() => authService.logout()} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  </button>
                </div>
              </div>
            )}

            {!user && (
              <button onClick={() => setIsAuthModalOpen(true)} className="mx-4 flex items-center justify-center gap-2 py-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-black hover:bg-indigo-500/20 transition-all border border-indigo-500/10 mb-6">
                Unlock Premium Intelligence
              </button>
            )}

            {user?.isAdmin && (
              <button onClick={() => setIsAdminLogOpen(true)} className="mx-4 flex items-center gap-3 px-4 py-3 bg-amber-500/10 text-amber-600 rounded-xl text-xs font-black hover:bg-amber-500/20 transition-all border border-amber-500/10 mb-4">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                System Audit
              </button>
            )}

            <div className="flex items-center justify-between px-4 text-xs font-bold text-slate-500">
              <span>{t.theme}</span>
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                {theme === 'dark' ? '🌙' : '☀️'}
              </button>
            </div>
            <p className="px-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-40">IPO Internal Decision Terminal</p>
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen relative overflow-hidden">
        <header className="lg:hidden h-14 px-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl z-50">
          <span className="font-black text-sm tracking-tighter text-slate-900 dark:text-white">{t.appTitle}</span>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>
        </header>

        <div ref={contentRef} className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
          <div className={`max-w-4xl mx-auto w-full px-6 transition-all duration-700 ${hasResultOrLoading ? 'pt-12 pb-40' : 'h-full flex items-center'}`}>

            <div className="w-full">
              {/* Search Interface */}
              <div className={`w-full transition-all duration-500 ${hasResultOrLoading ? 'mb-16' : 'max-w-2xl mx-auto'}`}>
                {!hasResultOrLoading && (
                  <div className="text-center mb-10 animate-slide-up">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-950 dark:text-white mb-6">
                      {t.landingTitle}
                    </h1>
                    <p className="text-base font-medium text-slate-600 dark:text-slate-400">
                      {t.landingSub}
                    </p>
                  </div>
                )}

                <form onSubmit={handleSearch} className="w-full flex flex-col md:flex-row gap-3 animate-slide-up">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder={t.placeholder}
                      className={`w-full transition-all duration-300 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 font-bold shadow-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none text-slate-950 dark:text-white ${hasResultOrLoading ? 'h-14 px-6 pr-12' : 'h-16 px-6 pr-12 text-lg'}`}
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-1"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    )}
                  </div>
                  <div className="w-full md:w-36">
                    <input
                      type="number"
                      value={subMultiple}
                      onChange={e => setSubMultiple(e.target.value)}
                      placeholder={t.multiplePlaceholder}
                      className={`w-full transition-all duration-300 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 font-bold shadow-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none text-slate-950 dark:text-white ${hasResultOrLoading ? 'h-14 px-6 text-center' : 'h-16 px-6 text-lg text-center'}`}
                    />
                  </div>
                  <button type="submit" className={`bg-slate-900 dark:bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 ${hasResultOrLoading ? 'h-14 px-8' : 'h-16 px-10'}`}>
                    {t.analyze}
                  </button>
                </form>
              </div>

              {/* Status & Results */}
              {loading && (
                <div className="py-20 flex flex-col items-center gap-6 animate-slide-up">
                  <div className="w-12 h-12 rounded-xl border-2 border-indigo-500/20 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-xl border-t-2 border-indigo-500 animate-spin"></div>
                    <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <h2 className="text-xs font-black tracking-widest uppercase animate-pulse text-slate-400">{loadingMessage}</h2>
                </div>
              )}

              {error && (
                <div className="py-20 text-center animate-slide-up">
                  <div className="text-red-500 font-bold mb-4">{error}</div>
                  <button onClick={() => setError(null)} className="text-sm font-black text-indigo-500 uppercase">Try Again</button>
                </div>
              )}

              {data && !loading && (
                <div className="animate-slide-up space-y-16">
                  {/* Sources Verification */}
                  <section>
                    <h3 className="section-label mb-6">{t.sources}</h3>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
                      {(data.dataSources || []).slice(0, 8).map((src, i) => {
                        const host = hostFromUrl(src);
                        return host && (
                          <a key={i} href={src} target="_blank" rel="noreferrer" className="flex-shrink-0 w-44 p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:border-indigo-500/50 transition-all group shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <img src={`https://www.google.com/s2/favicons?domain=${host}`} className="w-3 h-3 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="" />
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">{host}</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 line-clamp-1 truncate">{src}</p>
                          </a>
                        );
                      })}
                    </div>
                  </section>

                  {/* Summary Section */}
                  <section className="ask-card p-10 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 flex flex-col items-end gap-2">
                      <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[8px] font-black uppercase tracking-widest rounded-lg border border-indigo-500/20">Institutional Synthesis</span>
                      <span className="flex items-center gap-1.5 text-[8px] font-bold text-green-500 dark:text-green-400 uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        {t.validated}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-12">
                      <h3 className="section-label opacity-40">{t.executiveSummary}</h3>
                    </div>

                    <div className="prose dark:prose-invert max-w-none">
                      <h2 className="text-5xl font-black tracking-tighter mb-8 text-slate-950 dark:text-white leading-none">
                        {data.companyName} <span className="text-2xl text-slate-400 font-medium">({data.stockCode})</span>
                      </h2>

                      <div className="border-l-4 border-indigo-500/30 pl-8 my-10">
                        <p className="text-xl leading-relaxed text-slate-600 dark:text-slate-400 font-medium tracking-tight">
                          {data.business.description} <span className="citation-tag">1</span>
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Quantitative Analysis Grid */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <ScoringCard model={data.scoring} />
                    <DecisionCard advice={data.positionAdvice} />
                  </div>

                  {/* Visualization Sections */}
                  <section className="space-y-12">
                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-slate-200 dark:bg-white/5"></div>
                      <span className="section-label opacity-40">{t.sentimentTitle}</span>
                      <div className="h-px flex-1 bg-slate-200 dark:bg-white/5"></div>
                    </div>
                    <IPORadar data={data.ipoRadar} />
                  </section>

                  <section className="pt-10 space-y-24">
                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-slate-200 dark:bg-white/5"></div>
                      <span className="section-label opacity-40">{t.institutionalInsights}</span>
                      <div className="h-px flex-1 bg-slate-200 dark:bg-white/5"></div>
                    </div>

                    <LiquidityRiskCard data={data.liquidityAnalysis} />
                    <CapitalStructureCard data={data} />
                    <ValuationCard data={data.valuation} />
                    <ScenarioTable scenarios={data.scenarios} />
                    <TradingPlanCard strategies={data.exitStrategies} />
                    <HealthCard items={data.healthCheck} />
                  </section>

                  {/* Follow-ups */}
                  <section className="bg-white dark:bg-white/5 p-12 rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-xl transition-colors">
                    <h3 className="section-label mb-10 flex items-center gap-3">
                      <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      {t.suggested}
                    </h3>
                    <div className="flex flex-col gap-4">
                      {(data.suggestedFollowUps || []).map((fup, i) => (
                        <button key={i} onClick={() => { setQuery(fup); handleSearch(undefined, fup); }} className="text-left px-8 py-5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex justify-between items-center group shadow-sm">
                          {fup}
                          <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {data && <ResearchAssistant data={data} language={lang} />}

      {/* Modals & Overlays */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(u) => { setUser(u); setIsAuthModalOpen(false); }}
      />

      {user && !user.isPremium && data && (
        <PaywallOverlay onUpgrade={() => setIsPaymentModalOpen(true)} />
      )}

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={() => {
          if (user) {
            const updated = { ...user, isPremium: true };
            setUser(updated);
            logService.addLog(user.username, 'UPGRADE_SUCCESS', 'Upgraded to Premium Research License');
          }
          setIsPaymentModalOpen(false);
        }}
      />

      {isAdminLogOpen && (
        <AdminLogPanel
          onClose={() => setIsAdminLogOpen(false)}
          onAction={(q, s) => { handleSearch(undefined, q, s); setIsAdminLogOpen(false); }}
        />
      )}
    </div>

  );
};

function hostFromUrl(urlStr: string) {
  try {
    return new URL(urlStr).hostname.replace('www.', '');
  } catch (e) { return null; }
}

export default App;
