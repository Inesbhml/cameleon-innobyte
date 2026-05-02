import axios from 'axios';
import { mockIncidents, mockWorkflows, mockLogs, mockPentesters, mockNotifications } from '../mockData';

const BASE_URL = 'http://localhost:5000/api';
const USE_MOCK = true; // Toggle to switch to real API

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getIncidents = async () => {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve({ data: mockIncidents }), 500));
  }
  return api.get('/incidents');
};

export const getIncidentById = async (id) => {
  if (USE_MOCK) {
    const incident = mockIncidents.find(inc => inc.id === id);
    return new Promise((resolve) => setTimeout(() => resolve({ data: incident }), 500));
  }
  return api.get(`/incidents/${id}`);
};

export const getWorkflows = async (attackType) => {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve({ data: mockWorkflows[attackType] || [] }), 500));
  }
  return api.get(`/workflows/${attackType}`);
};

export const getLogs = async (page = 1, filters = {}) => {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve({ data: mockLogs }), 500));
  }
  return api.get('/logs', { params: { page, ...filters } });
};

export const getPentesters = async () => {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve({ data: mockPentesters }), 500));
  }
  return api.get('/pentesters');
};

export const analyzeLogs = async (logsData) => {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve({ 
      data: {
        assessment: "## Threat Assessment\n\n- **Severity**: High\n- **Analysis**: Multiple failed login attempts detected followed by successful connection from unknown IP. Indicates possible brute force attack resulting in credential compromise.\n\n### Recommendations\n1. Reset credentials for affected user immediately.\n2. Enable MFA if not already enforced.\n3. Block source IP at the firewall.",
        iocs: ["10.0.0.50", "192.168.1.5", "malicious-domain.com"]
      } 
    }), 1500));
  }
  return api.post('/soc/analyze', logsData);
};

export const getNotifications = async () => {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve({ data: mockNotifications }), 500));
  }
  return api.get('/notifications');
};

export const grantPentesterAccess = async (data) => {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve({ data: { success: true } }), 500));
  }
  return api.post('/pentester-access/grant', data);
};

export const revokePentesterAccess = async (id) => {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve({ data: { success: true } }), 500));
  }
  return api.delete(`/pentester-access/${id}`);
};

export default api;
