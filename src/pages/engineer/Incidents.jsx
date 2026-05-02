import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Crosshair, ShieldAlert, ArrowRightLeft, DatabaseZap, ChevronLeft, ChevronRight, Clock, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Link } from 'react-router-dom';

const sevColor = { Low: 'text-brand-primary', Medium: 'text-brand-warning', High: 'text-orange-400', Critical: 'text-brand-danger' };
const statColor = { Open: 'bg-yellow-400/15 text-yellow-400', 'In Progress': 'bg-brand-info/15 text-brand-info', Resolved: 'bg-brand-primary/15 text-brand-primary' };

/* ═══ Attack Kill-Chain Timeline Data ═══ */
const killChainPhases = [
  {
    id: 'T0',
    label: 'Intrusion',
    icon: Crosshair,
    color: '#f59e0b',
    time: '08:15:22',
    description: 'Initial access gained via spear-phishing email containing a weaponized PDF attachment. Payload executed on target workstation WS-HR-042.',
    indicators: ['Malicious email from spoofed domain', 'Payload hash: 7f3a...c92d', 'Initial C2 beacon detected'],
    affectedAssets: ['WS-HR-042', 'user: j.martin@cameleon.dz'],
    mitreTactic: 'TA0001 — Initial Access',
  },
  {
    id: 'T1',
    label: 'Privilege Escalation',
    icon: ShieldAlert,
    color: '#f97316',
    time: '08:32:47',
    description: 'Attacker exploited CVE-2026-1234 (local privilege escalation) to gain SYSTEM-level access. Credential dumping initiated via modified Mimikatz.',
    indicators: ['CVE-2026-1234 exploit detected', 'LSASS memory access', 'New admin account created: svc_backup$'],
    affectedAssets: ['WS-HR-042', 'AD Domain Controller DC-01'],
    mitreTactic: 'TA0004 — Privilege Escalation',
  },
  {
    id: 'T2',
    label: 'Lateral Movement',
    icon: ArrowRightLeft,
    color: '#ff4057',
    time: '09:01:15',
    description: 'Using harvested credentials, attacker moved laterally via RDP and SMB to file servers in the finance segment. PsExec usage detected across 4 hosts.',
    indicators: ['Unusual RDP sessions from WS-HR-042', 'PsExec execution on FS-FIN-01', 'SMB admin share access ($ADMIN)'],
    affectedAssets: ['FS-FIN-01', 'FS-FIN-02', 'WS-ACC-019', 'WS-ACC-023'],
    mitreTactic: 'TA0008 — Lateral Movement',
  },
  {
    id: 'T3',
    label: 'Exfiltration',
    icon: DatabaseZap,
    color: '#dc2626',
    time: '09:28:03',
    description: 'Sensitive financial data (2.4 GB) staged and compressed. Exfiltration attempted via HTTPS to external IP 185.220.101.xx. Blocked by DLP policy at 68% completion.',
    indicators: ['Large archive creation (data.7z — 2.4 GB)', 'DNS tunneling attempt', 'Outbound HTTPS to 185.220.101.xx'],
    affectedAssets: ['FS-FIN-01', 'Firewall FW-EDGE-01'],
    mitreTactic: 'TA0010 — Exfiltration',
  },
];

/* ═══ Interactive Timeline Component ═══ */
const AttackTimeline = () => {
  const [activePhase, setActivePhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play through phases
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActivePhase(prev => {
        if (prev >= killChainPhases.length - 1) { setIsPlaying(false); return prev; }
        return prev + 1;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const phase = killChainPhases[activePhase];
  const PhaseIcon = phase.icon;
  const progress = ((activePhase) / (killChainPhases.length - 1)) * 100;

  return (
    <div className="bg-brand-bg-card border border-brand-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-brand-border bg-brand-bg-surface">
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} className="text-red-400" />
          <h2 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Attack Kill-Chain Timeline</h2>
          <span className="ml-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-red-500/10 text-red-400 border border-red-500/20">INC-2026-002</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setActivePhase(0); setIsPlaying(true); }}
            className={`px-3 py-1.5 text-[11px] font-medium rounded-lg border transition-all ${isPlaying ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-brand-bg-card border-brand-border text-neutral-400 hover:text-white'}`}
          >
            {isPlaying ? '● Replaying...' : '▶ Replay Attack'}
          </button>
        </div>
      </div>

      {/* Timeline Slider Track */}
      <div className="px-5 pt-5 pb-3">
        {/* Phase nodes */}
        <div className="relative">
          {/* Background track */}
          <div className="absolute top-4 left-0 right-0 h-[2px] bg-neutral-800 rounded-full" />
          {/* Active track */}
          <motion.div
            className="absolute top-4 left-0 h-[2px] rounded-full"
            style={{ background: `linear-gradient(90deg, #f59e0b, #f97316, #ff4057, #dc2626)` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />

          {/* Phase Nodes */}
          <div className="relative flex justify-between">
            {killChainPhases.map((p, i) => {
              const Icon = p.icon;
              const isActive = i === activePhase;
              const isPast = i < activePhase;
              return (
                <button
                  key={p.id}
                  onClick={() => { setActivePhase(i); setIsPlaying(false); }}
                  className="flex flex-col items-center group relative z-10"
                >
                  {/* Node circle */}
                  <motion.div
                    animate={{
                      scale: isActive ? 1.15 : 1,
                      boxShadow: isActive ? `0 0 20px ${p.color}40, 0 0 40px ${p.color}15` : '0 0 0 transparent',
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isActive
                        ? 'border-current bg-current/20'
                        : isPast
                          ? 'border-current/50 bg-current/10'
                          : 'border-neutral-700 bg-brand-bg-surface'
                    }`}
                    style={{ color: isPast || isActive ? p.color : '#525252' }}
                  >
                    <Icon size={14} />
                  </motion.div>

                  {/* Label */}
                  <span className={`mt-2 text-[11px] font-semibold transition-colors ${isActive ? 'text-white' : isPast ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {p.id}
                  </span>
                  <span className={`text-[10px] transition-colors ${isActive ? 'text-neutral-300' : 'text-neutral-600'}`}>
                    {p.label}
                  </span>

                  {/* Active indicator ring */}
                  {isActive && (
                    <motion.div
                      className="absolute top-0 w-8 h-8 rounded-full border-2"
                      style={{ borderColor: p.color }}
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{ scale: 1.8, opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Slider input */}
        <div className="mt-4 px-1">
          <input
            type="range"
            min={0}
            max={killChainPhases.length - 1}
            value={activePhase}
            onChange={e => { setActivePhase(Number(e.target.value)); setIsPlaying(false); }}
            className="w-full h-1 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #f59e0b 0%, #dc2626 ${progress}%, #262626 ${progress}%, #262626 100%)`,
              accentColor: phase.color,
            }}
          />
        </div>
      </div>

      {/* Phase Detail Panel */}
      <div className="px-5 pb-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-brand-bg-surface rounded-xl border border-brand-border/50 p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${phase.color}15`, color: phase.color }}>
                  <PhaseIcon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{phase.id}: {phase.label}</h3>
                  <p className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                    <Clock size={10} /> {phase.time} · {phase.mitreTactic}
                  </p>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => { if (activePhase > 0) setActivePhase(activePhase - 1); }} disabled={activePhase === 0} className="w-7 h-7 rounded-lg bg-brand-bg-card border border-brand-border flex items-center justify-center text-neutral-500 hover:text-white disabled:opacity-30 transition-all">
                  <ChevronLeft size={14} />
                </button>
                <button onClick={() => { if (activePhase < killChainPhases.length - 1) setActivePhase(activePhase + 1); }} disabled={activePhase === killChainPhases.length - 1} className="w-7 h-7 rounded-lg bg-brand-bg-card border border-brand-border flex items-center justify-center text-neutral-500 hover:text-white disabled:opacity-30 transition-all">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed mb-4">{phase.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Indicators */}
              <div className="bg-brand-bg-card rounded-lg p-3 border border-brand-border/50">
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold mb-2">Indicators of Compromise</p>
                <div className="space-y-1.5">
                  {phase.indicators.map((ind, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-neutral-400">
                      <span className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: phase.color }} />
                      <span className="font-mono">{ind}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Affected Assets */}
              <div className="bg-brand-bg-card rounded-lg p-3 border border-brand-border/50">
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold mb-2">Affected Assets</p>
                <div className="flex flex-wrap gap-1.5">
                  {phase.affectedAssets.map((asset, i) => (
                    <span key={i} className="px-2 py-1 text-[11px] font-mono rounded-md bg-brand-bg-surface border border-brand-border text-neutral-300">
                      {asset}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ═══ MAIN COMPONENT ═══ */
export const Incidents = () => {
  const { incidents, fetchIncidents, isLoadingIncidents } = useAppStore();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchIncidents(); }, [fetchIncidents]);

  const filtered = incidents
    .filter(i => filter === 'All' || i.status === filter)
    .filter(i => !search || i.id.toLowerCase().includes(search.toLowerCase()) || (i.attackType || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Incidents</h1>
          <p className="text-neutral-500 text-sm mt-0.5">{incidents.length} total incidents tracked</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" className="bg-brand-bg-card border border-brand-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-brand-primary/50 outline-none w-48" />
          </div>
          <div className="flex bg-brand-bg-card border border-brand-border rounded-lg p-0.5">
            {['All', 'Open', 'In Progress', 'Resolved'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs rounded-md transition-all font-medium ${filter === f ? 'bg-brand-bg-elevated text-white' : 'text-neutral-500 hover:text-white'}`}>{f}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Attack Kill-Chain Timeline */}
      <AttackTimeline />

      {/* Incidents Table */}
      <div className="bg-brand-bg-card border border-brand-border rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-brand-border text-[11px] uppercase tracking-wider text-neutral-600">
              <th className="p-4 font-medium">Incident</th>
              <th className="p-4 font-medium">Severity</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Assigned</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingIncidents && incidents.length === 0 ? (
              [...Array(4)].map((_, i) => <tr key={i}><td colSpan={6} className="p-4"><div className="h-10 bg-brand-bg-elevated rounded-lg animate-shimmer" /></td></tr>)
            ) : filtered.map((inc, idx) => (
              <motion.tr key={inc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.04 }} className="border-b border-brand-border/50 hover:bg-white/[0.015] transition-colors group">
                <td className="p-4">
                  <p className="text-sm text-white font-medium">{inc.description?.slice(0, 50) || inc.attackType}</p>
                  <p className="text-[11px] font-mono text-neutral-600 mt-0.5">{inc.id}</p>
                </td>
                <td className="p-4">
                  <span className={`font-semibold text-sm flex items-center gap-1.5 ${sevColor[inc.severity]}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />{inc.severity}
                  </span>
                </td>
                <td className="p-4 text-sm text-neutral-400">{inc.attackType}</td>
                <td className="p-4 text-sm text-neutral-400">{inc.assignedTo}</td>
                <td className="p-4"><span className={`px-2 py-0.5 text-[11px] font-medium rounded-full ${statColor[inc.status]}`}>{inc.status}</span></td>
                <td className="p-4 text-right">
                  <Link to={`/engineer/incidents/${inc.id}`} className="px-3 py-1.5 text-xs bg-brand-bg-elevated border border-brand-border text-neutral-300 rounded-lg opacity-0 group-hover:opacity-100 hover:border-brand-primary/30 hover:text-brand-primary transition-all">
                    View
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {!isLoadingIncidents && filtered.length === 0 && <p className="p-8 text-center text-neutral-600 text-sm">No incidents match your filter.</p>}
      </div>
    </div>
  );
};
