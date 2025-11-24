"use client";
import { Trophy } from 'lucide-react';

const Footer = () => (
  <footer className="bg-gray-900 border-t border-gray-800 py-3 px-8 text-center">
    <p className="text-[10px] text-gray-600 flex items-center justify-center gap-1">
      Powered by <span className="text-gray-500 font-semibold">Gemini 2.5</span> & <span className="text-gray-500 font-semibold">Web Speech API</span>
      <span className="mx-2 text-gray-700">|</span>
      Built for <span className="text-green-500/70 flex items-center gap-0.5"><Trophy size={8}/> Sports Fans</span>
    </p>
  </footer>
);

export default Footer;