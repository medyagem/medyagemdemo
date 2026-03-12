"use client";

import { useState, useEffect, useRef } from "react";
import { Shield, Activity, Ban, ActivitySquare } from "lucide-react";

interface LogEntry {
  id: number;
  time: string;
  ip: string;
  device: string;
  location: string;
  risk_score: number;
  status: "valid" | "bot";
  action?: string;
}

const TEMPLATE_LOGS = [
  { ip: "151.135.29.147", device: "Android", location: "Ankara", risk_score: 14, status: "valid" },
  { ip: "188.58.119.100", device: "Masaüstü", location: "Bilinmiyor", risk_score: 92, status: "bot", action: "IP ENGELLENDİ" },
  { ip: "84.17.83.154", device: "iPhone", location: "İstanbul", risk_score: 9, status: "valid" },
  { ip: "31.206.211.154", device: "Masaüstü", location: "Adana", risk_score: 87, status: "bot", action: "IP ENGELLENDİ" },
  { ip: "176.237.72.33", device: "Android", location: "Bursa", risk_score: 18, status: "valid" }
];

import gsap from "gsap";

export default function AdsProtectionDashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState({
    realClicks: 142,
    blockedBots: 37,
    savedBudget: 2940,
  });
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let index = 0;
    let logId = 0;

    const generateTime = () => {
      const now = new Date();
      return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
    };

    // Initial load filler
    const initialLogs: LogEntry[] = [];
    for (let i = 0; i < 4; i++) {
        const item = TEMPLATE_LOGS[i % TEMPLATE_LOGS.length] as any;
        initialLogs.push({ ...item, id: logId++, time: generateTime() });
    }
    setLogs(initialLogs);

    const interval = setInterval(() => {
      const template = TEMPLATE_LOGS[index % TEMPLATE_LOGS.length] as any;
      const newLog: LogEntry = {
        ...template,
        id: logId++,
        time: generateTime()
      };

      setLogs(prev => {
        // Keep max 50 visible to prevent jumping when top elements are removed
        const updated = [...prev, newLog];
        if (updated.length > 50) return updated.slice(updated.length - 50);
        return updated;
      });

      // Update counters based on spec
      if (newLog.status === "valid") {
        setStats(s => ({ ...s, realClicks: s.realClicks + 1 }));
      } else if (newLog.status === "bot") {
        setStats(s => ({ 
          ...s, 
          blockedBots: s.blockedBots + 1,
          savedBudget: s.savedBudget + 12 
        }));
      }

      index++;
    }, 900);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (logContainerRef.current) {
      // Use GSAP for Lenis-style buttery smooth scrolling
      gsap.to(logContainerRef.current, {
        scrollTop: logContainerRef.current.scrollHeight,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  }, [logs]);

  return (
    <div className="w-full h-full bg-[#0b0f1c] border border-[#1f2a44] flex flex-col font-mono text-sm overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.1)] rounded-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0b0f1c] border-b border-[#1f2a44]">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#22c55e]" />
          <span className="font-bold text-white tracking-widest text-xs uppercase">Sahte Tıklama Monitörü</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]"></span>
          </span>
          <span className="text-[#22c55e] text-xs font-bold tracking-widest uppercase">Aktİf</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 p-4 border-b border-[#1f2a44] bg-[#0b0f1c]/50">
        <div className="flex flex-col">
          <span className="text-[#60a5fa] text-[10px] uppercase tracking-wider mb-1">Gerçek Tıklamalar</span>
          <span className="text-2xl font-black text-[#22c55e]">{stats.realClicks}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[#60a5fa] text-[10px] uppercase tracking-wider mb-1">Engellenen Botlar</span>
          <span className="text-2xl font-black text-[#ef4444] animate-[pulse_1s_ease-in-out_infinite]">{stats.blockedBots}</span>
        </div>
        <div className="flex flex-col col-span-2 mt-1">
          <span className="text-[#60a5fa] text-[10px] uppercase tracking-wider mb-1">Kurtarılan Bütçe (Tahmini)</span>
          <span className="text-xl font-black text-[#60a5fa]">{stats.savedBudget.toLocaleString("tr-TR")} ₺</span>
        </div>
      </div>

      <div 
        ref={logContainerRef}
        className="flex-1 p-4 overflow-hidden space-y-2 bg-[#05070a] relative"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(11,15,28,0)_50%,rgba(11,15,28,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />
        {logs.map((log) => (
          <div 
             key={log.id} 
             className={`flex flex-wrap md:flex-nowrap items-center gap-x-2 gap-y-1 py-1 px-2 border-l-2 transition-all duration-300 animate-[fade-in-up_0.3s_ease-out] relative z-20 ${
               log.status === "bot" ? "border-[#ef4444] bg-[#ef4444]/5 text-[#ef4444]" : "border-[#22c55e] bg-transparent text-[#22c55e]/80"
             }`}
          >
             <span className="text-[#60a5fa]/50">[{log.time}]</span>
             <span className="font-semibold">{log.ip}</span>
             <span className="text-white/40 max-w-[80px] truncate">({log.device})</span>
             <span className="text-white/60 mx-1">{log.location}</span>
             
             <span className={`ml-auto ${log.status === "bot" ? "text-[#ef4444] font-bold" : "text-[#22c55e] font-medium"}`}>
               {log.status === "bot" ? `[BOT] ${log.action}` : "[GEÇERLİ]"}
             </span>
          </div>
        ))}
        <div ref={bottomRef} className="h-4" />
      </div>
      
    </div>
  );
}
