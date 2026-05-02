import { create } from 'zustand';
import { api } from '../services/api';

export const useAppStore = create((set, get) => ({
  // ── User ───────────────────────────
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),

  // ── Incidents ──────────────────────
  incidents: [],
  isLoadingIncidents: true,
  fetchIncidents: async () => {
    set({ isLoadingIncidents: true });
    try {
      const data = await api.getIncidents();
      set({ incidents: data, isLoadingIncidents: false });
    } catch {
      set({ isLoadingIncidents: false });
    }
  },

  // ── Logs ───────────────────────────
  logs: [],
  isLoadingLogs: true,
  fetchLogs: async () => {
    set({ isLoadingLogs: true });
    try {
      const data = await api.getLogs();
      set({ logs: data, isLoadingLogs: false });
    } catch {
      set({ isLoadingLogs: false });
    }
  },

  // ── Notifications ──────────────────
  notifications: [
    { id: 'notif-1', title: 'Critical Ransomware Alert', message: 'Multiple file servers showing encrypted extensions.', unread: true, timestamp: new Date(Date.now() - 3600000).toISOString(), severity: 'critical' },
    { id: 'notif-2', title: 'Workflow Step Overdue', message: 'Isolate Affected Users is overdue for INC-2026-001.', unread: true, timestamp: new Date(Date.now() - 18000000).toISOString(), severity: 'warning' },
    { id: 'notif-3', title: 'Pentester Report Submitted', message: 'Yassine K. submitted findings for INC-2026-003.', unread: false, timestamp: new Date(Date.now() - 86400000).toISOString(), severity: 'info' },
  ],

  addNotification: (notification) => set(state => ({
    notifications: [notification, ...state.notifications]
  })),

  markNotificationRead: (id) => set(state => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, unread: false } : n)
  })),

  clearNotifications: () => set({ notifications: [] }),

  // ── Sidebar ────────────────────────
  sidebarCollapsed: false,
  toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
