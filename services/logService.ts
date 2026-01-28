

import { SystemLog } from "../types";

const API_BASE = '/api/logs';

export const logService = {
  addLog: async (username: string, action: SystemLog['action'], details: string, metadata?: any) => {
    try {
      await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, action, details, metadata })
      });
      console.debug(`[Remote Log] ${action}: ${details}`);
    } catch (e) {
      console.error('Failed to save log to backend', e);
    }
  },

  getLogs: async (): Promise<SystemLog[]> => {
    try {
      const resp = await fetch(API_BASE);
      return await resp.json();
    } catch (e) {
      return [];
    }
  },

  clearLogs: async () => {
    try {
      await fetch(API_BASE, { method: 'DELETE' });
    } catch (e) { }
  }
};

