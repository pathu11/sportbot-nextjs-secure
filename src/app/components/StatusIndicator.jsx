"use client";
import { Loader2, Globe, BarChart3, Radio } from 'lucide-react';

const StatusIndicator = ({ agentStatus }) => {
  if (!agentStatus || agentStatus === 'speaking' || agentStatus === 'listening') return null;
  
  // Internal helper for UI logic
  const getAgentStatusUI = () => {
    switch(agentStatus) {
        case 'researching': 
            return <div className="flex items-center gap-2"><Globe className="animate-spin-slow" size={14} /> <span>The Scout: Checking Scorecards...</span></div>;
        case 'analyzing': 
            return <div className="flex items-center gap-2"><BarChart3 className="animate-bounce" size={14} /> <span>The Stat-Man: Crunching numbers...</span></div>;
        case 'speaking': 
            return <div className="flex items-center gap-2"><Radio className="animate-pulse" size={14} /> <span>Commentator: Live Update...</span></div>;
        default: return null;
    }
  };

  return (
    <div className="flex w-full justify-start animate-in fade-in slide-in-from-bottom-2">
      <div className="bg-gray-800 border border-gray-700 px-5 py-3 rounded-2xl rounded-tl-none flex items-center space-x-3 shadow-lg">
        <div className="relative">
           <Loader2 size={18} className="text-green-400 animate-spin" />
           <span className="absolute inset-0 bg-green-400/20 rounded-full blur-sm animate-pulse"></span>
        </div>
        <div className="text-xs text-gray-300 font-medium">
           {getAgentStatusUI()}
        </div>
      </div>
    </div>
  );
};

export default StatusIndicator;