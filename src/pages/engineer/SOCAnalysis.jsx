import React, { useState } from 'react';
import {
  Terminal,
  BrainCircuit,
  Download,
  Copy,
  Check,
  ShieldAlert,
  Search,
  Wrench,
  FileText,
  RotateCcw,
  BookOpen,   // ✅ ADD THIS
  ChevronRight,
  AlertTriangle,
  Info, ChevronDown, ChevronUp
} from 'lucide-react';
import { mockIncidents } from '../../mockData';


const ISO_PHASES = [
  {
    id: 1,
    code: 'ISO-27035-1',
    label: 'Plan & Prepare',
    icon: BookOpen,
    color: 'text-blue-400',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
    description: 'Establish incident response policy, roles, and communication plan.',
    playbook: [
      'Confirm IR policy version is current (review every 6 months)',
      'Verify CSIRT team roster and on-call contacts are up to date',
      'Ensure log sources (SIEM, EDR, firewall) are feeding correctly',
      'Confirm escalation matrix and legal/compliance contacts are accessible',
      'Validate secure communication channel (out-of-band) is operational',
    ],
  },
  {
    id: 2,
    code: 'ISO-27035-2',
    label: 'Detect & Report',
    icon: Search,
    color: 'text-yellow-400',
    border: 'border-yellow-500/30',
    bg: 'bg-yellow-500/10',
    description: 'Identify potential incidents through monitoring and user reports.',
    playbook: [
      'Ingest and triage raw log data from SIEM / EDR / network sensors',
      'Classify alert by source: automated detection, user report, or external tip',
      'Apply initial severity scoring: P1 Critical / P2 High / P3 Medium / P4 Low',
      'Extract IOCs: IPs, hashes, domains, user accounts, process names',
      'Open incident ticket and assign unique incident ID (INC-YYYYMMDD-XXX)',
      'Notify SOC lead within 15 min for P1/P2; 1 hour for P3/P4',
    ],
  },
  {
    id: 3,
    code: 'ISO-27035-3',
    label: 'Assess & Decide',
    icon: ShieldAlert,
    color: 'text-orange-400',
    border: 'border-orange-500/30',
    bg: 'bg-orange-500/10',
    description: 'Evaluate incident scope, impact and decide on response path.',
    playbook: [
      'Determine affected assets: endpoints, servers, cloud resources, data stores',
      'Assess business impact: data confidentiality, integrity, availability',
      'Confirm whether incident is a false positive — document rationale',
      'Identify threat actor TTPs against MITRE ATT&CK framework',
      'Decide response path: contain immediately vs. monitor for attribution',
      'Trigger GDPR/NIS2 breach notification assessment if PII involved (72h clock)',
      'Escalate to management if financial, legal, or reputational risk identified',
    ],
  },
  {
    id: 4,
    code: 'ISO-27035-4',
    label: 'Respond',
    icon: Wrench,
    color: 'text-red-400',
    border: 'border-red-500/30',
    bg: 'bg-red-500/10',
    description: 'Execute containment, eradication, and recovery actions.',
    playbook: [
      'CONTAIN: Isolate affected host(s) from network — preserve forensic state first',
      'CONTAIN: Block IOC IPs/domains at firewall, proxy, and DNS sinkholes',
      'CONTAIN: Disable or reset compromised credentials immediately',
      'ERADICATE: Remove malware, unauthorized accounts, and persistence mechanisms',
      'ERADICATE: Patch or mitigate exploited vulnerability (virtual patch if needed)',
      'RECOVER: Restore from last known-good backup — verify integrity before restore',
      'RECOVER: Re-image endpoints where rootkit or firmware compromise is suspected',
      'VERIFY: Confirm threat is eliminated before returning system to production',
    ],
  },
  {
    id: 5,
    code: 'ISO-27035-5',
    label: 'Lessons Learned',
    icon: RotateCcw,
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    description: 'Document findings and improve defenses post-incident.',
    playbook: [
      'Conduct post-incident review within 5 business days of closure',
      'Complete full incident report: timeline, root cause, impact, response actions',
      'Identify detection gaps — update SIEM rules, signatures, and playbooks',
      'Review whether existing controls failed or were absent',
      'Update risk register and asset inventory based on findings',
      'Share sanitized threat intelligence with ISAC / trusted partners if applicable',
      'Archive all evidence per retention policy (minimum 1 year for ISO compliance)',
    ],
  },
  {
    id: 6,
    code: 'ISO-27035-6',
    label: 'Close & Report',
    icon: FileText,
    color: 'text-purple-400',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
    description: 'Formally close the incident and report to stakeholders.',
    playbook: [
      'Confirm all recovery actions are complete and verified',
      'Submit final incident report to CISO, legal, and compliance teams',
      'File regulatory notifications if required (GDPR, NIS2, sector-specific)',
      'Close incident ticket with root cause category and closure timestamp',
      'Update incident metrics dashboard (MTTD, MTTR, incident count)',
      'Brief executive stakeholders for P1/P2 incidents within 48h of closure',
    ],
  },
];
export const SOCAnalysis = () => {
  const [openIncident, setOpenIncident] = useState(null);
  const [activePhase, setActivePhase] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});

  const toggleIncident = (id) => {
    setOpenIncident(prev => (prev === id ? null : id));
  };

  const toggleStep = (incidentId, phaseId, stepIdx) => {
    const key = `${incidentId}-${phaseId}-${stepIdx}`;
    setCompletedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold text-white">Incident Response Playbook</h1>

      {mockIncidents.map((incident) => {
        const isOpen = openIncident === incident.id;
        const currentPhase = activePhase[incident.id] || 1;
        const phaseData = ISO_PHASES.find(p => p.id === currentPhase);

        return (
          <div key={incident.id} className="bg-brand-bg-card border border-brand-border rounded-md">

            {/* 🔥 INCIDENT HEADER */}
            <button
              onClick={() => toggleIncident(incident.id)}
              className="w-full p-4 flex justify-between items-center text-left"
            >
              <div>
                <h2 className="text-white font-semibold">{incident.id}</h2>
                <p className="text-xs text-neutral-400">{incident.description}</p>
              </div>

              {isOpen ? <ChevronUp /> : <ChevronDown />}
            </button>

            {/* 🔥 EXPANDED CONTENT */}
            {isOpen && (
              <div className="border-t border-brand-border p-4 space-y-4">

                {/* incident info */}
                <div className="text-xs text-neutral-400 flex flex-wrap gap-3">
                  <span>{incident.attackType}</span>
                  <span>{incident.detectedAt}</span>
                  <span>{incident.assignedTo}</span>
                  <span>{incident.status}</span>
                  <span className="text-red-400">{incident.severity}</span>
                </div>

                {/* phase selector */}
                <div className="flex gap-2 flex-wrap">
                  {ISO_PHASES.map(p => (
                    <button
                      key={p.id}
                      onClick={() =>
                        setActivePhase(prev => ({ ...prev, [incident.id]: p.id }))
                      }
                      className={`px-3 py-1 text-xs rounded ${currentPhase === p.id
                        ? 'bg-brand-primary text-black'
                        : 'bg-brand-bg-surface text-neutral-400'
                        }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* steps */}
                <div className="space-y-2">
                  {phaseData.playbook.map((step, idx) => {
                    const key = `${incident.id}-${currentPhase}-${idx}`;
                    const done = completedSteps[key];

                    return (
                      <div
                        key={idx}
                        onClick={() => toggleStep(incident.id, currentPhase, idx)}
                        className={`p-3 border rounded cursor-pointer ${done
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-brand-bg-surface border-brand-border'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          {done && <Check size={14} />}
                          <p className={done ? 'line-through text-neutral-500' : 'text-white'}>
                            {step}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};