"use client";

const ChatHeader = ({ isRecording, transcriptLength }) => (
  <header className="h-16 bg-gray-900/95 backdrop-blur border-b border-gray-800 flex items-center justify-between px-8 sticky top-0 z-20 shadow-sm">
     <div className="flex items-center gap-3">
         <h2 className="font-semibold text-gray-100 text-lg">Live Commentary</h2>
         {transcriptLength > 0 && (
           <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
             {transcriptLength} UPDATES
           </span>
         )}
     </div>
     {isRecording && (
       <div className="flex items-center space-x-2 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
         <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
         </span>
         <span className="text-xs font-bold text-red-400 tracking-wider">ON AIR</span>
       </div>
     )}
  </header>
);

export default ChatHeader;