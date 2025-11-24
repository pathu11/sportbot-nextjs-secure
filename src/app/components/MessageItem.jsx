"use client";
import { Bot, User, CheckCircle2, Globe, ExternalLink } from 'lucide-react';

const MessageItem = ({ msg }) => {
  
  // Helper to format bold text (**text**)
  const formatText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-bold text-green-400">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
  };

  return (
    <div className={`flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] md:max-w-[70%] flex flex-col ${msg.speaker === 'user' ? 'items-end' : 'items-start'}`}>
         
         {/* Label */}
         <div className="flex items-center space-x-2 mb-1.5 text-[10px] uppercase font-bold tracking-wider">
            {msg.speaker === 'ai' ? <Bot size={12} className="text-green-400" /> : null}
            <span className={msg.speaker === 'user' ? 'text-blue-400' : 'text-green-400'}>
              {msg.speaker === 'user' ? 'Fan' : 'SportBot'}
            </span>
            {msg.speaker === 'user' ? <User size={12} className="text-blue-400" /> : null}
         </div>

         {/* Bubble */}
         <div className={`px-6 py-4 rounded-2xl text-sm shadow-lg transition-all leading-relaxed relative ${
           msg.speaker === 'user' 
             ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none' 
             : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-none'
         }`}>
           {/* Content */}
           <div>{formatText(msg.text)}</div>
           
           {/* Sources Section */}
           {msg.sources && msg.sources.length > 0 && (
               <div className="mt-4 pt-3 border-t border-gray-700/50">
                   <p className="text-[10px] text-gray-400 mb-2.5 flex items-center uppercase tracking-wider font-bold opacity-70">
                       <CheckCircle2 size={10} className="mr-1.5 text-green-500"/> Verified Sources
                   </p>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                       {msg.sources.map((s, idx) => {
                           let domain = s.uri;
                           try { domain = new URL(s.uri).hostname.replace('www.', ''); } catch(e){}
                           return (
                               <a 
                                  key={idx} 
                                  href={s.uri} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="group flex items-center gap-3 bg-gray-900/40 hover:bg-black/40 border border-gray-700 hover:border-green-500/30 p-2 rounded-lg transition-all duration-200"
                               >
                                   <div className="w-6 h-6 rounded-full bg-gray-700/50 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
                                        <Globe size={12} className="text-gray-400 group-hover:text-green-400"/>
                                   </div>
                                   <div className="flex flex-col overflow-hidden min-w-0">
                                        <span className="text-[11px] font-medium text-gray-300 truncate group-hover:text-green-300 transition-colors">
                                            {s.title || domain}
                                        </span>
                                        <span className="text-[9px] text-gray-500 truncate flex items-center gap-1">
                                            {domain} <ExternalLink size={8} />
                                        </span>
                                   </div>
                               </a>
                           )
                       })}
                   </div>
               </div>
           )}
         </div>
         
         {/* Timestamp */}
         <span className="text-[9px] text-gray-600 mt-1 px-1">{msg.timestamp}</span>
      </div>
    </div>
  );
};

export default MessageItem;