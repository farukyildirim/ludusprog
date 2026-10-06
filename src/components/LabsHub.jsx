import React, { useState } from 'react';
import { Compass, Sparkles, GitCommit, Gauge } from 'lucide-react';
import VectorLab from './labs/VectorLab';
import JuiceLab from './labs/JuiceLab';
import FsmLab from './labs/FsmLab';
import GameLoopLab from './labs/GameLoopLab';

export default function LabsHub() {
  const [activeLab, setActiveLab] = useState('vector');

  const labs = [
    {
      id: 'vector',
      title: 'Vektör & Görüş Açısı (FOV)',
      tagline: 'Dot Product, mesafe ve normalize yön vektörleri',
      icon: Compass,
      color: 'text-indigo-400'
    },
    {
      id: 'juice',
      title: "Game Feel & 'Juice' Simülatörü",
      tagline: 'Screen Shake, Hit Stop, Squash & Stretch ve anlık görsel geri bildirim',
      icon: Sparkles,
      color: 'text-amber-400'
    },
    {
      id: 'fsm',
      title: 'Sonlu Durum Makinesi (FSM)',
      tagline: 'Karakter durumları, geçiş koşulları ve animasyon olayları',
      icon: GitCommit,
      color: 'text-blue-400'
    },
    {
      id: 'gameloop',
      title: 'Kare Hızı & Delta Time',
      tagline: 'FPS dalgalanmasında kare bağımsız hareketin canlı testi',
      icon: Gauge,
      color: 'text-teal-400'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Başlık */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4" />
          <span>İnteraktif Oyun Laboratuvarları</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Görsel Simülatörler & Mekanik Laboratuvarı
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
          Oyun programlama teorilerini doğrudan tarayıcınızda deneyimleyin. Parametreleri değiştirin, mekanikleri test edin ve oyun tasarım hissiyatını kavrayın.
        </p>
      </div>

      {/* Laboratuvar Seçici Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {labs.map(lab => {
          const Icon = lab.icon;
          const isActive = activeLab === lab.id;

          return (
            <div
              key={lab.id}
              onClick={() => setActiveLab(lab.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                isActive
                  ? 'bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/30'
                  : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 ${lab.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{lab.title}</h3>
              <p className="text-[11px] text-slate-400 leading-snug">{lab.tagline}</p>
            </div>
          );
        })}
      </div>

      {/* Aktif Laboratuvar Görünümü */}
      <div className="transition-all duration-300">
        {activeLab === 'vector' && <VectorLab />}
        {activeLab === 'juice' && <JuiceLab />}
        {activeLab === 'fsm' && <FsmLab />}
        {activeLab === 'gameloop' && <GameLoopLab />}
      </div>
    </div>
  );
}
