import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, ArrowUpRight, ArrowDownRight, Clock, Server, Globe, Shield } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ThreatMap from '../../components/ui/Threatmap';
const weeklyData = [
  { day: 'Mon', detected: 4, mitigated: 4 }, { day: 'Tue', detected: 7, mitigated: 6 },
  { day: 'Wed', detected: 2, mitigated: 2 }, { day: 'Thu', detected: 12, mitigated: 11 },
  { day: 'Fri', detected: 5, mitigated: 5 }, { day: 'Sat', detected: 3, mitigated: 3 },
  { day: 'Sun', detected: 8, mitigated: 7 },
];

const threatsPerApi = [
  { api: '/api/auth/login', threats: 34, severity: 'critical' },
  { api: '/api/payments', threats: 21, severity: 'critical' },
  { api: '/api/users', threats: 18, severity: 'high' },
  { api: '/api/uploads', threats: 14, severity: 'high' },
  { api: '/api/admin', threats: 11, severity: 'medium' },
  { api: '/api/search', threats: 7, severity: 'medium' },
  { api: '/api/reports', threats: 4, severity: 'low' },
];

const apiSevColor = { critical: '#ff4057', high: '#f97316', medium: '#f59e0b', low: '#00e87b' };
const tooltipStyle = { backgroundColor: '#111', borderColor: '#222', borderRadius: '8px', color: '#fff', fontSize: '12px' };

const sevConfig = {
  Low: 'bg-emerald-500',
  Medium: 'bg-yellow-500',
  High: 'bg-orange-500',
  Critical: 'bg-red-500',
};

/* ═══ Attack Origins Data (900x450 viewBox) ═══ */
const attackOrigins = [
  { country: 'Russia', code: 'RU', x: 620, y: 120, attacks: 847, severity: 'critical' },
  { country: 'China', code: 'CN', x: 740, y: 220, attacks: 623, severity: 'critical' },
  { country: 'Iran', code: 'IR', x: 580, y: 230, attacks: 312, severity: 'high' },
  { country: 'Brazil', code: 'BR', x: 280, y: 370, attacks: 198, severity: 'medium' },
  { country: 'Nigeria', code: 'NG', x: 440, y: 310, attacks: 156, severity: 'medium' },
  { country: 'USA', code: 'US', x: 170, y: 190, attacks: 89, severity: 'low' },
  { country: 'India', code: 'IN', x: 660, y: 260, attacks: 234, severity: 'high' },
  { country: 'N. Korea', code: 'KP', x: 770, y: 190, attacks: 445, severity: 'critical' },
];
const TARGET = { x: 460, y: 210 };

const sevDotColor = {
  critical: { dot: '#ff4057' },
  high: { dot: '#f97316' },
  medium: { dot: '#f59e0b' },
  low: { dot: '#00e87b' },
};

const arcPath = (ox, oy) => {
  const mx = (ox + TARGET.x) / 2;
  const my = Math.min(oy, TARGET.y) - 50 - Math.abs(ox - TARGET.x) * 0.07;
  return `M${ox},${oy} Q${mx},${my} ${TARGET.x},${TARGET.y}`;
};

/* ═══ World Map Component ═══ */
<ThreatMap />

export const Dashboard = () => {
  const { incidents, fetchIncidents, isLoadingIncidents, logs, fetchLogs } = useAppStore();

  useEffect(() => {
    fetchIncidents();
    fetchLogs();
  }, [fetchIncidents, fetchLogs]);

  const active = incidents.filter(i => i.status !== 'Resolved');
  const critical = incidents.filter(i => i.severity === 'Critical' && i.status !== 'Resolved');
  const resolvedToday = incidents.filter(i => i.status === 'Resolved').length;

  return (
    <div className="h-full flex flex-col font-sans text-neutral-300">
      {/* Header section */}
      <div className="flex items-center justify-between pb-6 border-b border-brand-border">
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight">Overview</h1>
          <p className="text-xs text-neutral-500 mt-1">System status and active threat monitoring.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-brand-border bg-brand-bg-surface rounded-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> API Healthy
          </span>
          <span className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-brand-border bg-brand-bg-surface rounded-md">
            <Server size={12} className="text-neutral-500" /> 14 Nodes Online
          </span>
        </div>
      </div>

      {/* Global Threat Map */}
      <div className="pt-6">
        <ThreatMap />
      </div>

      {/* Main Grid: 12 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 flex-1 items-start">

        {/* LEFT COLUMN: Metrics (3/12) */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">Metrics</h2>

          <div className="border border-brand-border bg-brand-bg-card p-4 rounded-md">
            <p className="text-xs text-neutral-500 mb-1">Active Incidents</p>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-semibold text-white leading-none">{active.length}</span>
              <span className="flex items-center text-xs text-orange-500 font-medium pb-0.5"><ArrowUpRight size={14} /> +2 today</span>
            </div>
          </div>

          <div className="border border-brand-border bg-brand-bg-card p-4 rounded-md">
            <p className="text-xs text-neutral-500 mb-1">Critical Threats</p>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-semibold text-white leading-none">{critical.length}</span>
              <span className="flex items-center text-xs text-red-500 font-medium pb-0.5">Needs Action</span>
            </div>
          </div>

          <div className="border border-brand-border bg-brand-bg-card p-4 rounded-md">
            <p className="text-xs text-neutral-500 mb-1">Resolved (24h)</p>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-semibold text-white leading-none">{resolvedToday}</span>
              <span className="flex items-center text-xs text-emerald-500 font-medium pb-0.5"><ArrowUpRight size={14} /> +12%</span>
            </div>
          </div>

          <div className="border border-brand-border bg-brand-bg-card p-4 rounded-md">
            <p className="text-xs text-neutral-500 mb-1">MTTR</p>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-semibold text-white leading-none">42<span className="text-xl text-neutral-500 ml-0.5">m</span></span>
              <span className="flex items-center text-xs text-emerald-500 font-medium pb-0.5"><ArrowDownRight size={14} /> -4m</span>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Main Incident Queue (6/12) */}
        <div className="lg:col-span-6 flex flex-col h-full border border-brand-border bg-brand-bg-card rounded-md overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border bg-brand-bg-surface">
            <h2 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Active Queue</h2>
            <Link to="/engineer/incidents" className="text-xs text-neutral-500 hover:text-white transition-colors">View All</Link>
          </div>

          <div className="divide-y divide-brand-border overflow-y-auto">
            {isLoadingIncidents ? (
              <div className="p-4 text-xs text-neutral-500">Loading queue...</div>
            ) : active.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500">No active incidents.</div>
            ) : (
              active.slice(0, 8).map(inc => (
                <Link key={inc.id} to={`/engineer/incidents/${inc.id}`} className="flex items-start gap-4 p-4 hover:bg-white/[0.02] transition-colors group">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${sevConfig[inc.severity] || 'bg-neutral-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-white truncate group-hover:text-brand-primary transition-colors">{inc.attackType || inc.title}</h3>
                      <span className="text-[10px] text-neutral-500 font-mono shrink-0 ml-4">{inc.detectedAt?.split(' ')[1] || 'Just now'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-500">
                      <span className="font-mono">{inc.id}</span>
                      <span>•</span>
                      <span>{inc.assignedTo}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Live Activity Stream (3/12) */}
        <div className="lg:col-span-3 flex flex-col h-full border border-brand-border bg-brand-bg-card rounded-md overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-brand-border bg-brand-bg-surface">
            <Activity size={14} className="text-brand-primary" />
            <h2 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Activity Stream</h2>
          </div>

          <div className="divide-y divide-brand-border overflow-y-auto">
            {!logs || logs.length === 0 ? (
              <div className="p-4 text-xs text-neutral-500">Waiting for events...</div>
            ) : (
              logs.slice(0, 10).map((log, i) => (
                <div key={log.id || i} className="p-3 hover:bg-white/[0.02] transition-colors">
                  <p className="text-xs text-neutral-300 leading-snug">{log.description || log.action}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-brand-primary font-medium">{log.actor || log.user}</span>
                    <span className="text-[10px] text-neutral-600 font-mono">{log.timestamp?.split(' ')[1] || log.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
        {/* Threat Volume (Weekly) */}
        <div className="border border-brand-border bg-brand-bg-card rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-brand-border bg-brand-bg-surface">
            <h2 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Threat Volume (Weekly)</h2>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[10px] text-neutral-500"><span className="w-2 h-2 rounded-full bg-[#ff4057]" />Detected</span>
              <span className="flex items-center gap-1.5 text-[10px] text-neutral-500"><span className="w-2 h-2 rounded-full bg-[#00e87b]" />Mitigated</span>
            </div>
          </div>
          <div className="p-5">
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={weeklyData}>
                  <CartesianGrid stroke="#1a1a1a" vertical={false} />
                  <XAxis dataKey="day" stroke="#525252" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis stroke="#525252" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#1a1a1a' }} />
                  <Bar dataKey="detected" fill="#ff4057" radius={[4, 4, 0, 0]} name="Detected" />
                  <Bar dataKey="mitigated" fill="#00e87b" radius={[4, 4, 0, 0]} name="Mitigated" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Threats per API */}
        <div className="border border-brand-border bg-brand-bg-card rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-brand-border bg-brand-bg-surface">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-brand-primary" />
              <h2 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Threats per API</h2>
            </div>
            <span className="text-[10px] text-neutral-500">Last 30 days</span>
          </div>
          <div className="p-5 space-y-3">
            {threatsPerApi.map((item) => (
              <div key={item.api} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono text-neutral-300">{item.api}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">{item.threats}</span>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: apiSevColor[item.severity] }} />
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.threats / threatsPerApi[0].threats) * 100}%`,
                      backgroundColor: apiSevColor[item.severity],
                      opacity: 0.8,
                    }}
                  />
                </div>
              </div>
            ))}
            <div className="flex items-center gap-4 pt-3 border-t border-brand-border">
              {[{ label: 'Critical', color: '#ff4057' }, { label: 'High', color: '#f97316' }, { label: 'Medium', color: '#f59e0b' }, { label: 'Low', color: '#00e87b' }].map(l => (
                <span key={l.label} className="flex items-center gap-1.5 text-[10px] text-neutral-500">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />{l.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
