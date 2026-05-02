import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, AlertTriangle, Shield, Clock, CheckCircle2, ChevronRight, X, ArrowRight, ArrowLeft, Download, Printer } from 'lucide-react';

const incidents = [
  { id: 'INC-2026-001', type: 'Phishing', detected: '2026-05-02T08:15', priority: 'High', status: 'In Progress', description: 'Spear phishing campaign targeting HR department with 23 malicious emails. 4 employees clicked the link.', affected: 'HR Department — 4 endpoints', itActions: ['Malicious domains blocked at firewall', 'Affected endpoints isolated and scanned', 'Email gateway rules updated'], severity: 'High' },
  { id: 'INC-2026-002', type: 'Ransomware', detected: '2026-05-01T23:40', priority: 'Critical', status: 'Open', description: 'Multiple file servers showing encrypted extensions. Ransom note dropped on 3 servers.', affected: 'File Server 1, 2, 3 — Finance Dept', itActions: ['Network segments isolated immediately', 'Affected servers identified and powered down', 'Backup integrity verification initiated'], severity: 'Critical' },
  { id: 'INC-2026-003', type: 'Data Breach', detected: '2026-04-25T11:05', priority: 'Critical', status: 'Resolved', description: 'Customer PII found on dark web forum. 1,200 records potentially exposed.', affected: 'Customer Database — 1,200 records', itActions: ['Third-party vendor access revoked', 'Affected customers notified', 'Enhanced monitoring deployed'], severity: 'Critical' },
  { id: 'INC-2026-004', type: 'Lost Device', detected: '2026-04-20T08:45', priority: 'Medium', status: 'Resolved', description: 'Sales executive lost company laptop at airport. Device contained client proposals.', affected: 'Sales Dept — 1 laptop', itActions: ['Remote wipe initiated', 'Device reported to authorities', 'Access credentials rotated'], severity: 'Medium' },
  { id: 'INC-2026-005', type: 'Malware', detected: '2026-04-24T16:30', priority: 'Low', status: 'Resolved', description: 'Adware detected on receptionist workstation during routine scan.', affected: 'Reception — 1 workstation', itActions: ['Workstation isolated and cleaned', 'Full AV scan completed', 'User awareness briefing conducted'], severity: 'Low' },
  { id: 'INC-2026-006', type: 'Insider Threat', detected: '2026-04-28T09:10', priority: 'High', status: 'In Progress', description: 'Large data exfiltration detected from internal financial database by authorized user.', affected: 'Finance Database — Unknown volume', itActions: ['User account suspended', 'Database access logs preserved', 'Forensic investigation initiated'], severity: 'High' },
];

const priorityStyle = {
  Critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-500' },
  High: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', dot: 'bg-orange-500' },
  Medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-500' },
  Low: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-500' },
};

const statusStyle = {
  Open: 'text-red-400 bg-red-500/10 border-red-500/20',
  'In Progress': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Resolved: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

/* ═══ Step-Based Modal ═══ */
const IncidentModal = ({ incident, onClose }) => {
  const [step, setStep] = useState(0);
  const [legalForm, setLegalForm] = useState({ dataType: 'Personal', impact: 'Medium', violation: 'No', notes: '' });
  const [reportGenerated, setReportGenerated] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);

  if (!incident) return null;
  const dt = new Date(incident.detected);
  const ps = priorityStyle[incident.priority];

  const timeline = [
    { label: 'Incident Detected', time: dt.toLocaleString(), status: 'done' },
    { label: 'IT Response Initiated', time: new Date(dt.getTime() + 900000).toLocaleString(), status: 'done' },
    ...incident.itActions.map((a, i) => ({ label: a, time: new Date(dt.getTime() + (i + 2) * 1800000).toLocaleString(), status: i < 2 ? 'done' : 'active' })),
    { label: 'Legal Assessment', time: step >= 1 ? 'In Progress' : 'Pending', status: step >= 1 ? 'active' : 'pending' },
    { label: 'Legal Report Generated', time: step >= 2 && reportGenerated ? 'Completed' : 'Pending', status: step >= 2 && reportGenerated ? 'done' : 'pending' },
  ];

  const generateReport = () => {
    setGeneratedReport({
      title: `Legal Incident Report — ${incident.id}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      sections: [
        { heading: 'Incident Summary', content: `${incident.type} incident (${incident.id}) detected on ${dt.toLocaleDateString()} at ${dt.toLocaleTimeString()}. ${incident.description}` },
        { heading: 'Affected Systems / Users', content: incident.affected },
        { heading: 'IT Response Actions', content: incident.itActions.join('; ') },
        { heading: 'Legal Classification', content: `Data involved: ${legalForm.dataType}. Impact level: ${legalForm.impact}. Legal violation: ${legalForm.violation}. ${legalForm.notes ? `Notes: ${legalForm.notes}` : ''}` },
        { heading: 'Compliance Decision', content: legalForm.violation === 'Yes' ? 'Regulatory notification required within 72 hours per Law 18-07.' : 'No regulatory notification required. Incident documented for audit purposes.' },
      ],
    });
    setReportGenerated(true);
  };

  const steps = ['Incident Details', 'Legal Assessment', 'Generate Report'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} onClick={e => e.stopPropagation()} className="bg-brand-bg-card border border-brand-border rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-brand-border bg-brand-bg-surface shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-white">{incident.id} — {incident.type}</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Guided Analysis Workflow</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"><X size={18} /></button>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center px-5 py-3 border-b border-brand-border/50 bg-brand-bg-surface/50 shrink-0">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => { if (i <= step || (i === 2 && step === 1)) setStep(i); }}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${i < step ? 'bg-brand-primary/20 border-brand-primary text-brand-primary' : i === step ? 'bg-brand-info/20 border-brand-info text-brand-info' : 'bg-brand-bg-surface border-neutral-700 text-neutral-500'}`}>
                  {i < step ? <CheckCircle2 size={14} /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:inline ${i === step ? 'text-white' : 'text-neutral-500'}`}>{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-px mx-3 ${i < step ? 'bg-brand-primary/40' : 'bg-neutral-800'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {/* STEP 1: Incident Details */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <span className={`px-2.5 py-1 text-[11px] font-medium rounded-full border ${ps.bg} ${ps.text} ${ps.border}`}>{incident.priority}</span>
                  <span className={`px-2.5 py-1 text-[11px] font-medium rounded-full border ${statusStyle[incident.status]}`}>{incident.status}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-brand-bg-surface rounded-xl p-4 border border-brand-border/50">
                    <p className="text-[11px] text-neutral-500 uppercase tracking-wider mb-1">Detected At</p>
                    <p className="text-sm text-white font-medium">{dt.toLocaleDateString()} {dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="bg-brand-bg-surface rounded-xl p-4 border border-brand-border/50">
                    <p className="text-[11px] text-neutral-500 uppercase tracking-wider mb-1">Type</p>
                    <p className="text-sm text-white font-medium">{incident.type}</p>
                  </div>
                </div>
                <div className="bg-brand-bg-surface rounded-xl p-4 border border-brand-border/50">
                  <p className="text-[11px] text-neutral-500 uppercase tracking-wider mb-2">Description</p>
                  <p className="text-sm text-neutral-300 leading-relaxed">{incident.description}</p>
                </div>
                <div className="bg-brand-bg-surface rounded-xl p-4 border border-brand-border/50">
                  <p className="text-[11px] text-neutral-500 uppercase tracking-wider mb-2">Affected Systems / Users</p>
                  <p className="text-sm text-neutral-300">{incident.affected}</p>
                </div>
                <div className="bg-brand-bg-surface rounded-xl p-4 border border-brand-border/50">
                  <p className="text-[11px] text-neutral-500 uppercase tracking-wider mb-2">IT Actions Taken</p>
                  <div className="space-y-2">
                    {incident.itActions.map((a, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-neutral-300"><CheckCircle2 size={14} className="text-brand-primary shrink-0 mt-0.5" />{a}</div>
                    ))}
                  </div>
                </div>
                {/* Timeline */}
                <div className="bg-brand-bg-surface rounded-xl p-4 border border-brand-border/50">
                  <p className="text-[11px] text-neutral-500 uppercase tracking-wider mb-3">Timeline</p>
                  <div className="space-y-3">
                    {timeline.map((t, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full shrink-0 ${t.status === 'done' ? 'bg-brand-primary' : t.status === 'active' ? 'bg-amber-500 animate-pulse' : 'bg-neutral-700'}`} />
                          {i < timeline.length - 1 && <div className={`w-px h-6 ${t.status === 'done' ? 'bg-brand-primary/30' : 'bg-neutral-800'}`} />}
                        </div>
                        <div className="-mt-0.5">
                          <p className={`text-xs font-medium ${t.status === 'pending' ? 'text-neutral-500' : 'text-white'}`}>{t.label}</p>
                          <p className="text-[11px] text-neutral-600">{t.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Legal Assessment */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <p className="text-sm text-neutral-400">Complete the legal assessment for this incident.</p>
                <div>
                  <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Type of Data Involved</label>
                  <select value={legalForm.dataType} onChange={e => setLegalForm(p => ({ ...p, dataType: e.target.value }))} className="w-full bg-brand-bg-surface border border-brand-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary/50 appearance-none">
                    <option value="Personal">Personal Data</option>
                    <option value="Sensitive">Sensitive Data</option>
                    <option value="None">No Personal Data</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Estimated Impact Level</label>
                  <div className="flex gap-3">
                    {['Low', 'Medium', 'High'].map(lvl => (
                      <button key={lvl} onClick={() => setLegalForm(p => ({ ...p, impact: lvl }))} className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all ${legalForm.impact === lvl ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary' : 'bg-brand-bg-surface border-brand-border text-neutral-400 hover:text-white'}`}>{lvl}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Legal Violation Occurred?</label>
                  <div className="flex gap-3">
                    {['Yes', 'No'].map(opt => (
                      <button key={opt} onClick={() => setLegalForm(p => ({ ...p, violation: opt }))} className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all ${legalForm.violation === opt ? (opt === 'Yes' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400') : 'bg-brand-bg-surface border-brand-border text-neutral-400 hover:text-white'}`}>{opt}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Legal Notes (Optional)</label>
                  <textarea value={legalForm.notes} onChange={e => setLegalForm(p => ({ ...p, notes: e.target.value }))} placeholder="Add any legal observations or notes..." className="w-full h-24 bg-brand-bg-surface border border-brand-border rounded-xl p-4 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-brand-primary/50 resize-none" />
                </div>
              </motion.div>
            )}

            {/* STEP 3: Generate Report */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                {!reportGenerated ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-5">
                      <FileText size={28} className="text-brand-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Ready to Generate Report</h3>
                    <p className="text-sm text-neutral-400 max-w-md mx-auto mb-8">All incident details and legal assessment data will be compiled into a structured legal document.</p>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={generateReport} className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-primary text-black font-semibold rounded-xl hover:bg-brand-secondary transition-all">
                      <FileText size={18} /> Generate Legal Report
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-white flex items-center gap-2"><CheckCircle2 size={18} className="text-brand-primary" /> Report Generated</h3>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1.5 px-3 py-2 bg-brand-bg-surface border border-brand-border rounded-lg text-xs text-neutral-300 hover:bg-white/5 transition-all"><Download size={14} /> PDF</button>
                        <button className="flex items-center gap-1.5 px-3 py-2 bg-brand-bg-surface border border-brand-border rounded-lg text-xs text-neutral-300 hover:bg-white/5 transition-all"><Printer size={14} /> Print</button>
                      </div>
                    </div>
                    <div className="bg-brand-bg-surface rounded-2xl border border-brand-border/50 p-6 space-y-5">
                      <div className="text-center border-b border-brand-border/50 pb-4">
                        <p className="text-xs text-brand-primary uppercase tracking-wider mb-1">Cameleon Security</p>
                        <h4 className="text-lg font-bold text-white">{generatedReport.title}</h4>
                        <p className="text-xs text-neutral-500 mt-1">Generated: {generatedReport.date}</p>
                      </div>
                      {generatedReport.sections.map((s, i) => (
                        <div key={i}>
                          <h5 className="text-xs text-neutral-500 uppercase tracking-wider mb-2">{s.heading}</h5>
                          <p className="text-sm text-neutral-300 leading-relaxed">{s.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between p-5 border-t border-brand-border bg-brand-bg-surface shrink-0">
          <button onClick={() => step > 0 ? setStep(step - 1) : onClose()} className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-400 hover:text-white transition-colors"><ArrowLeft size={16} /> {step > 0 ? 'Back' : 'Close'}</button>
          {step < 2 && (
            <button onClick={() => setStep(step + 1)} className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-xl text-sm font-medium hover:bg-brand-primary/20 transition-all">Next <ArrowRight size={16} /></button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ═══ MAIN COMPONENT ═══ */
export const LegalDashboard = () => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = incidents.filter(i => filterStatus === 'All' || i.status === filterStatus);

  return (
    <div className="h-full flex flex-col font-sans text-neutral-300">
      <div className="flex items-center justify-between pb-6 border-b border-brand-border">
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2"><Shield size={20} className="text-brand-info" /> Incident Reports</h1>
          <p className="text-xs text-neutral-500 mt-1">Click on any incident to begin the legal analysis workflow.</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
        {[
          { label: 'Total Incidents', value: incidents.length, accent: 'text-brand-info' },
          { label: 'Open', value: incidents.filter(i => i.status === 'Open').length, accent: 'text-red-400' },
          { label: 'In Progress', value: incidents.filter(i => i.status === 'In Progress').length, accent: 'text-amber-400' },
          { label: 'Resolved', value: incidents.filter(i => i.status === 'Resolved').length, accent: 'text-emerald-400' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-brand-bg-card border border-brand-border rounded-xl p-4">
            <p className="text-[11px] text-neutral-500 uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.accent}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 pt-5">
        {['All', 'Open', 'In Progress', 'Resolved'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all ${filterStatus === s ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary' : 'bg-brand-bg-card border-brand-border text-neutral-400 hover:text-white'}`}>{s}</button>
        ))}
      </div>

      {/* Incidents List */}
      <div className="mt-4 bg-brand-bg-card border border-brand-border rounded-2xl overflow-hidden flex-1">
        <div className="px-5 py-3 border-b border-brand-border bg-brand-bg-surface grid grid-cols-12 gap-4 text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">
          <span className="col-span-1">ID</span>
          <span className="col-span-2">Type</span>
          <span className="col-span-3">Description</span>
          <span className="col-span-2">Detected</span>
          <span className="col-span-1">Priority</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-1"></span>
        </div>
        <div className="divide-y divide-brand-border/50">
          {filtered.map((inc, i) => {
            const ps = priorityStyle[inc.priority];
            return (
              <motion.div key={inc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="grid grid-cols-12 gap-4 items-center px-5 py-4 hover:bg-white/[0.015] transition-colors cursor-pointer group" onClick={() => setSelectedIncident(inc)}>
                <span className="col-span-1 text-xs font-mono text-neutral-400">{inc.id.split('-').pop()}</span>
                <span className="col-span-2 text-sm text-white font-medium">{inc.type}</span>
                <span className="col-span-3 text-xs text-neutral-500 truncate">{inc.description}</span>
                <span className="col-span-2 text-xs text-neutral-500">{new Date(inc.detected).toLocaleDateString()}</span>
                <span className="col-span-1"><span className={`px-2 py-0.5 text-[11px] font-medium rounded-full border ${ps.bg} ${ps.text} ${ps.border}`}>{inc.priority}</span></span>
                <span className="col-span-2"><span className={`px-2.5 py-1 text-[11px] font-medium rounded-full border ${statusStyle[inc.status]}`}>{inc.status}</span></span>
                <span className="col-span-1 flex justify-end"><ChevronRight size={16} className="text-neutral-600 group-hover:text-brand-primary transition-colors" /></span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedIncident && <IncidentModal incident={selectedIncident} onClose={() => setSelectedIncident(null)} />}
      </AnimatePresence>
    </div>
  );
};
