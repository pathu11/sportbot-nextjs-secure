"use client";
import { Trophy, Activity, Link as LinkIcon, Square, Loader2, Play, KeyRound } from 'lucide-react';

const Sidebar = ({ 
  isRecording, 
  agentStatus, 
  handleToggle, 
  canvasRef, 
  transcriptLength, 
  sessions, 
  saveCurrentSession, 
  deleteSession, 
  loadSession,
//   apiKey // Passing apiKey down to show warning if needed
}) => {
  return (
    <div className="w-80 bg-gray-800 border-r border-gray-700 p-6 flex flex-col h-screen shadow-xl z-10">
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-center space-x-2 text-green-400 mb-2">
          <Trophy className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-tight">SportBot Live</h1>
        </div>
        
        <div className="flex items-center space-x-1.5 mt-2 text-xs text-gray-400 bg-gray-900/50 p-2.5 rounded-lg border border-gray-700/50">
           <Activity size={12} className="text-yellow-400" />
           <span>Mode: </span>
           <span className="text-yellow-400 font-bold">Sports Analyst</span>
        </div>
      </div>

      {/* Visualizer */}
      <div className="flex-shrink-0 bg-black rounded-xl border border-gray-700 h-32 mb-6 overflow-hidden relative shadow-inner">
         <canvas ref={canvasRef} width="250" height="128" className="w-full h-full opacity-80" />
         {!isRecording && <p className="absolute inset-0 flex items-center justify-center text-xs text-gray-500 font-medium uppercase tracking-wider">Microphone Standby</p>}
      </div>

      {/* Control Button */}
      <button
        onClick={handleToggle}
        disabled={agentStatus && agentStatus !== 'listening'}
        className={`flex-shrink-0 w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg mb-6 transform active:scale-95 ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 shadow-red-900/20 text-white' 
            : (agentStatus && agentStatus !== 'listening')
              ? 'bg-gray-700 cursor-not-allowed opacity-70 text-gray-300'
              : 'bg-green-600 hover:bg-green-500 shadow-green-900/20 text-white'
        }`}
      >
        {isRecording ? <Square size={18} className="fill-current" /> : (agentStatus ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} className="fill-current" />)}
        <span>
          {isRecording ? 'Stop & Get Score' : agentStatus ? 'Checking Stats...' : 'Ask for Stats'}
        </span>
      </button>

      {/* History Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  Match History
              </h3>
              {transcriptLength > 0 && (
                  <button onClick={saveCurrentSession} className="text-xs bg-green-900/30 text-green-400 hover:bg-green-900/50 px-2 py-1 rounded transition-colors flex items-center gap-1">
                      <LinkIcon size={12} /> Save
                  </button>
              )}
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {sessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-600 text-xs italic border-2 border-dashed border-gray-700 rounded-lg">
                      <span className="mb-1">No matches saved</span>
                  </div>
              ) : (
                  sessions.map((session) => (
                      <div 
                          key={session.id} 
                          onClick={() => loadSession(session.data)}
                          className="bg-gray-900/40 border border-gray-700/50 p-3 rounded-lg hover:bg-gray-700/50 hover:border-gray-600 transition-all cursor-pointer group"
                      >
                          <div className="flex justify-between items-start mb-1">
                              <div className="flex items-center gap-2 text-[10px] text-green-400 font-mono">
                                  <span>{session.date}</span>
                                  <span className="text-gray-600">|</span>
                                  <span>{session.time}</span>
                              </div>
                              <button 
                                  onClick={(e) => deleteSession(e, session.id)}
                                  className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                              >
                                  <Square size={10} className="fill-current" />
                              </button>
                          </div>
                          <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                              {session.preview || "Empty match"}
                          </p>
                      </div>
                  ))
              )}
          </div>
      </div>

      {/* {!apiKey && (
          <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg flex items-start space-x-2 text-yellow-500 text-xs">
              <KeyRound size={16} className="mt-0.5 flex-shrink-0" />
              <p>Missing API Key. Check code configuration.</p>
          </div>
      )} */}
    </div>
  );
};

export default Sidebar;