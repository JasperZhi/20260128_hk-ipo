
import { User } from "../types";

const API_BASE = '/api/auth';

export const authService = {
  getCurrentUser: async (): Promise<User | null> => {
    const token = localStorage.getItem('ipo_token');
    if (!token) return null;

    try {
      const resp = await fetch(`${API_BASE}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!resp.ok) throw new Error();
      return await resp.json();
    } catch (e) {
      localStorage.removeItem('ipo_token');
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('ipo_token');
    window.location.reload();
  },

  register: async (username: string, password: string): Promise<{ user: User, token: string }> => {
    const resp = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(err.message || 'Registration failed');
    }
    const data = await resp.json();
    localStorage.setItem('ipo_token', data.token);
    return data;
  },

  login: async (username: string, password: string): Promise<{ user: User, token: string }> => {
    const resp = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(err.message || 'Login failed');
    }
    const data = await resp.json();
    localStorage.setItem('ipo_token', data.token);
    return data;
  },

  upgradeToPremium: async (username: string): Promise<User> => {
    // In a real app, this would be an API call after payment success
    return { username, isPremium: true, usageCount: 0, createdAt: new Date().toISOString() };
  }
};

