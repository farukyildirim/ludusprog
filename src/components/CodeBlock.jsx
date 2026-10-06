import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CodeBlock({ code, language = 'csharp', title = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguageLabel = (lang) => {
    switch (lang.toLowerCase()) {
      case 'csharp':
      case 'cs':
      case 'unity':
        return 'Unity C#';
      case 'gdscript':
      case 'godot':
        return 'Godot GDScript';
      case 'cpp':
      case 'unreal':
        return 'Unreal C++ / BP';
      case 'lua':
      case 'luau':
      case 'roblox':
        return 'Roblox Luau';
      default:
        return lang.toUpperCase();
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0d1117] shadow-xl my-4 text-xs font-mono">
      {/* Kod Başlığı & Dil Çubuğu */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
          </div>
          <span className="ml-2 font-medium text-slate-300">{title || getLanguageLabel(language)}</span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-[11px] transition"
          title="Kodu Kopyala"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Kopyalandı</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Kopyala</span>
            </>
          )}
        </button>
      </div>

      {/* Kod İçeriği */}
      <div className="p-4 overflow-x-auto text-slate-200 leading-relaxed font-mono">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
