import React, { useState } from 'react';
import { logService } from '../services/logService';
import { SystemLog } from '../types';

interface Props {
    onClose: () => void;
    onAction?: (query: string, sub?: string) => void;
}


const AdminLogPanel: React.FC<Props> = ({ onClose, onAction }) => {
    const [logs, setLogs] = useState<SystemLog[]>([]);

    React.useEffect(() => {
        logService.getLogs().then(setLogs);
    }, []);


    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl h-[85vh] flex flex-col overflow-hidden animate-slide-up border border-white/10">

                {/* Header */}
                <div className="bg-slate-900 dark:bg-slate-950 p-8 text-white flex justify-between items-center border-b border-white/5">
                    <div>
                        <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                            <div className="p-2 bg-amber-500 rounded-xl text-slate-950">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            系统审计终端 <span className="text-amber-500/50 text-sm font-bold uppercase tracking-widest ml-2">Internal Admin Control</span>
                        </h2>
                        <p className="text-xs text-slate-400 font-bold mt-2 uppercase tracking-widest opacity-60">Real-time system behavior logs & user synthesis audit</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-all group">
                        <svg className="w-6 h-6 text-slate-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Content Table */}
                <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950/40 p-8">
                    <div className="bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-slate-100 dark:bg-white/5 sticky top-0 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]">
                                <tr>
                                    <th className="px-6 py-4 border-b border-slate-200 dark:border-white/5">时间 / Timestamp</th>
                                    <th className="px-6 py-4 border-b border-slate-200 dark:border-white/5">用户 / Entity</th>
                                    <th className="px-6 py-4 border-b border-slate-200 dark:border-white/5">行为 / Event</th>
                                    <th className="px-6 py-4 border-b border-slate-200 dark:border-white/5">详情 / Meta</th>
                                    <th className="px-6 py-4 border-b border-slate-200 dark:border-white/5">操作 / Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-600 dark:text-slate-300">
                                {logs.length === 0 ? (
                                    <tr><td colSpan={5} className="p-20 text-center italic text-slate-400 font-bold uppercase tracking-widest">No behavioral data currently archived</td></tr>
                                ) : (
                                    logs.map(log => (
                                        <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-5 font-mono text-[10px] whitespace-nowrap opacity-60">
                                                {new Date(log.timestamp).toLocaleTimeString([], { hour12: false })} · {new Date(log.timestamp).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-[10px] border border-indigo-500/20">
                                                        {log.username[0].toUpperCase()}
                                                    </div>
                                                    <span className="font-black text-slate-900 dark:text-white truncate max-w-[100px]">{log.username}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${log.action === 'SEARCH_SUCCESS' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                                                        log.action === 'SEARCH_FAILURE' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                                                            log.action === 'UPGRADE_SUCCESS' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                                                                log.action === 'SEARCH_ATTEMPT' ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' :
                                                                    'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10'
                                                    }`}>
                                                    {log.action.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-[11px] font-bold leading-relaxed text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                                    {log.details}
                                                </p>
                                                {log.metadata && (
                                                    <div className="mt-2 text-[9px] font-mono opacity-40 truncate">
                                                        {JSON.stringify(log.metadata)}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-5">
                                                {log.action === 'SEARCH_SUCCESS' && log.metadata?.code && onAction && (
                                                    <button
                                                        onClick={() => {
                                                            const parts = log.details.split(': ');
                                                            const query = parts.length > 1 ? parts[1] : '';
                                                            onAction(query || log.metadata.code, log.metadata.sub);
                                                        }}
                                                        className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:underline uppercase tracking-widest"
                                                    >
                                                        Inspect Result
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Archive contains {logs.length} entries</span>
                    <button
                        onClick={() => { logService.clearLogs(); window.location.reload(); }}
                        className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors"
                    >
                        Purge All Audit Logs
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogPanel;