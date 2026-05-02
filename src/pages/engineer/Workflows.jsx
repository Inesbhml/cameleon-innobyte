import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Check, Clock, Circle } from 'lucide-react';
import { mockWorkflows } from '../../mockData';

export const Workflows = () => {
  const types = Object.keys(mockWorkflows);
  const [selected, setSelected] = useState(types[0]);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    setSteps(mockWorkflows[selected].map(s => ({ ...s })));
  }, [selected]);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-5">
      <div className="w-72 shrink-0 bg-brand-bg-card border border-brand-border rounded-md flex flex-col overflow-hidden">
        <div className="p-4 border-b border-brand-border">
          <h3 className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">Threat Vectors</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {types.map(type => (
            <button key={type} onClick={() => setSelected(type)}
              className={`w-full text-left px-4 py-3 rounded flex items-center justify-between transition-all text-sm ${
                selected === type ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' : 'text-neutral-400 hover:bg-white/[0.03] hover:text-white border border-transparent'
              }`}>
              <span className="font-medium">{type}</span>
              {selected === type && <ArrowRight size={14} />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-brand-bg-card border border-brand-border rounded-md overflow-hidden flex flex-col relative">
        <div className="p-5 border-b border-brand-border relative z-10">
          <h2 className="text-lg font-semibold text-white">{selected} Response Protocol</h2>
          <p className="text-sm text-brand-info mt-1 flex items-center gap-1.5"><ShieldCheck size={13} /> ISO 27035 &amp; Law 18-07 Compliant</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5 relative z-10">
          {steps.map((step, idx) => {
            const isDone = step.status === 'Done';
            const isActive = step.status === 'In Progress';
            return (
              <motion.div key={step.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 shrink-0 ${
                    isDone ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' :
                    isActive ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500 animate-pulse' :
                    'bg-brand-bg-surface border-neutral-700 text-neutral-600'
                  }`}>
                    {isDone ? <Check size={16} /> : isActive ? <Clock size={16} /> : <Circle size={12} />}
                  </div>
                  {idx < steps.length - 1 && <div className={`w-0.5 flex-1 mt-1 ${isDone ? 'bg-emerald-500/30' : 'bg-neutral-800'}`} />}
                </div>

                <div className={`flex-1 pb-4 ${isDone ? 'opacity-70' : isActive ? '' : 'opacity-40'}`}>
                  <h4 className={`font-medium ${isDone ? 'text-white' : isActive ? 'text-yellow-500' : 'text-neutral-400'}`}>
                    {idx + 1}. {step.title}
                  </h4>
                  <p className="text-sm text-neutral-500 mt-1">{step.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-[11px] bg-brand-bg-surface px-2 py-0.5 rounded border border-brand-border text-neutral-400">
                      Role: <span className="text-brand-primary font-mono">{step.role}</span>
                    </span>
                    <span className="text-[11px] bg-brand-bg-surface px-2 py-0.5 rounded border border-brand-border text-neutral-400">
                      SLA: <span className="text-brand-info">{step.sla}</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
