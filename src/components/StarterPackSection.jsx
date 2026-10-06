import React, { useState } from 'react';
import { FolderArchive, Download, Code2, ChevronRight, Check, Sparkles, Terminal } from 'lucide-react';
import { STARTER_PACKS } from '../data/starterPacksData';
import CodeBlock from './CodeBlock';

export default function StarterPackSection() {
  const [selectedPackId, setSelectedPackId] = useState('roblox-obby');
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  const selectedPack = STARTER_PACKS.find(p => p.id === selectedPackId) || STARTER_PACKS[0];
  const activeFile = selectedPack.files[selectedFileIndex] || selectedPack.files[0];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Üst Başlık & İndirme Butonu */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <FolderArchive className="w-4 h-4" />
            <span>Hazır Proje Şablonları & Kod Kütüphanesi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Starter Pack Kütüphanesi
          </h1>
          <p className="text-xs text-slate-400 mt-2 max-w-xl leading-relaxed">
            Dijital Oyun Tasarımı stüdyo projeleri ve game jam'ler için test edilmiş hazır oyun mekanikleri: Roblox Starter Pack, Unity Kurumsal İskelet ve Godot Bileşenleri.
          </p>
        </div>

        {/* Direkt İndirme Kartı */}
        <a
          href="/downloads/Roblox_Starter_Pack.zip"
          download="Roblox_Starter_Pack.zip"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3.5 rounded-2xl shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2.5 transition shrink-0 text-xs sm:text-sm"
        >
          <Download className="w-4 h-4" />
          <span>Roblox Starter Pack (.ZIP İndir)</span>
        </a>
      </div>

      {/* Şablon Seçici & Kod İnceleyici */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Sütun: Şablon Listesi */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Kütüphanedeki Mekanikler ({STARTER_PACKS.length})
          </h3>

          <div className="space-y-2">
            {STARTER_PACKS.map(pack => {
              const isSelected = selectedPackId === pack.id;

              return (
                <div
                  key={pack.id}
                  onClick={() => {
                    setSelectedPackId(pack.id);
                    setSelectedFileIndex(0);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500 shadow-lg ring-1 ring-indigo-500/30'
                      : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {pack.genre}
                    </span>
                    <span className="text-[10px] text-indigo-400 font-mono">
                      {pack.engine.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{pack.title}</h4>
                  <p className="text-xs text-slate-400 leading-snug line-clamp-2">{pack.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sağ Sütun: Seçili Şablonun Kod ve Detay İnceleyicisi */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold mb-1">
              <Terminal className="w-4 h-4" />
              <span>{selectedPack.genre} — {selectedPack.engine.toUpperCase()}</span>
            </div>
            <h2 className="text-xl font-bold text-white">{selectedPack.title}</h2>
            <p className="text-xs text-slate-300 mt-1">{selectedPack.description}</p>
          </div>

          {/* Dosya Sekmeleri (Eğer pakette birden fazla script varsa) */}
          {selectedPack.files.length > 1 && (
            <div className="flex gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
              {selectedPack.files.map((file, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition ${
                    selectedFileIndex === idx
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {file.path.split('/').pop()}
                </button>
              ))}
            </div>
          )}

          {/* Dosya Açıklaması */}
          {activeFile && (
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
              <span className="text-indigo-400 font-bold font-mono">Konum:</span>
              <span className="font-mono text-slate-400">{activeFile.path}</span>
            </div>
          )}

          {/* Kod Bloğu */}
          {activeFile && (
            <CodeBlock
              code={activeFile.code}
              language={selectedPack.engine}
              title={activeFile.path}
            />
          )}

          <div className="text-xs text-slate-400 leading-relaxed bg-indigo-950/20 p-4 rounded-2xl border border-indigo-900/30">
            💡 <strong className="text-indigo-300">Tasarımcı Kullanım Tavsiyesi:</strong> Bu scripti projenize entegre ederken doğrudan kopyalamak yerine, değişken değerlerini oyununuzun temposuna (pacing) göre editörden parametrik olarak ayarlayın.
          </div>
        </div>
      </div>
    </div>
  );
}
