import { mockIncidents, mockLogs, mockWorkflows, mockPentesters } from '../mockData';

/**
 * API service layer — currently backed by mock data with simulated network delay.
 * Replace each method body with a real fetch/axios call when Flask backend is ready.
 *
 * Base URL: process.env.VITE_API_URL || 'http://localhost:5000/api'
 */

const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const api = {
  // GET /api/incidents
  getIncidents: async () => {
    await delay(600);
    return [...mockIncidents];
  },

  // GET /api/incidents/:id
  getIncident: async (id) => {
    await delay(400);
    return mockIncidents.find(i => i.id === id) || null;
  },

  // GET /api/logs
  getLogs: async () => {
    await delay(500);
    return [...mockLogs];
  },

  // GET /api/workflows/:type
  getWorkflow: async (type) => {
    await delay(400);
    return mockWorkflows[type] || [];
  },

  // POST /api/workflows/update
  updateWorkflowStep: async (incidentId, stepId, status) => {
    await delay(500);
    return { success: true, incidentId, stepId, status };
  },

  // GET /api/pentesters
  getPentesters: async () => {
    await delay(400);
    return [...mockPentesters];
  },

  // POST /api/pentesters/grant
  grantPentesterAccess: async (email, permissions) => {
    await delay(1200);
    return { success: true, email, permissions };
  },

  // POST /api/soc/analyze
  analyzeLogs: async (payload) => {
    await delay(1500);
    return {
      data: {
        assessment: "Analysis complete: Detected anomalous access patterns originating from non-standard IP ranges targeting the active directory service. Recommended immediate isolation of the affected host.",
        iocs: ["10.0.0.50", "malicious-domain.com", "admin"]
      }
    };
  },
};
