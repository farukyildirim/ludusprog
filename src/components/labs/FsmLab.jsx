import React, { useState, useEffect } from 'react';
import { GitCommit, Play, ArrowRight, Activity, Terminal } from 'lucide-react';

const STATES = {
  IDLE: {
    name: 'IDLE',
    color: 'bg-emerald-500',
    borderColor: 'border-emerald-500',
    desc: 'Karakter hareketsiz bekliyor.',
    enterCode: 'player.playAnimation("idle")',
    updateCode: 'if (input.x != 0) changeState("RUN");\nif (input.jump && isGrounded) changeState("JUMP");\nif (input.attack) changeState("ATTACK");'
  },
  RUN: {
    name: 'RUN',
    color: 'bg-blue-500',
    borderColor: 'border-blue-500',
    desc: 'Zeminde yatay hareket halinde.',
    enterCode: 'player.playAnimation("run"); player.stepParticles.play()',
    updateCode: 'move(input.x * speed * dt);\nif (input.x == 0) changeState("IDLE");\nif (!isGrounded) changeState("FALL");\nif (input.jump) changeState("JUMP");'
  },
  JUMP: {
    name: 'JUMP',
    color: 'bg-indigo-500',
    borderColor: 'border-indigo-500',
    desc: 'Yukarı doğru dikey ivmelenme.',
    enterCode: 'velocity.y = jumpForce; player.playAnimation("jump_up")',
    updateCode: 'velocity.y += gravity * dt;\nif (velocity.y <= 0) changeState("FALL");'
  },
  FALL: {
    name: 'FALL',
    color: 'bg-amber-500',
    borderColor: 'border-amber-500',
    desc: 'Yerçekimiyle aşağı düşüş.',
    enterCode: 'player.playAnimation("jump_fall")',
    updateCode: 'velocity.y += gravity * dt;\nif (isGrounded) changeState(input.x != 0 ? "RUN" : "IDLE");'
  },
  ATTACK: {
    name: 'ATTACK',
    color: 'bg-rose-500',
    borderColor: 'border-rose-500',
    desc: 'Saldırı animasyonu kilitli.',
    enterCode: 'player.playAnimation("slash"); velocity.x = 0',
    updateCode: 'if (animationFinished) changeState("IDLE");'
  }
};

export default function FsmLab() {
  const [currentState, setCurrentState] = useState('IDLE');
  const [eventLogs, setEventLogs] = useState([
    { id: 1, text: '[FSM Init] Initial state: IDLE' }
  ]);
  const [posX, setPosX] = useState(250);
  const [posY, setPosY] = useState(0); // 0 = zemin

  const changeState = (nextState) => {
    if (currentState === nextState) return;
    
    // Log state change
    setEventLogs(prev => [
      { 
        id: Date.now(), 
        text: `[State Transition] ${currentState} -> ${nextState} (Exit ${currentState} -> Enter ${nextState})` 
      },
      ...prev.slice(0, 7)
    ]);
    
    setCurrentState(nextState);
  };

  const handleAction = (action) => {
    if (action === 'attack') {
      changeState('ATTACK');
      setTimeout(() => {
        setCurrentState('IDLE');
      }, 700);
    } else if (action === 'jump') {
      if (currentState === 'ATTACK') return;
      changeState('JUMP');
      setPosY(80);
      setTimeout(() => {
        changeState('FALL');
        setTimeout(() => {
          setPosY(0);
          changeState('IDLE');
        }, 500);
      }, 400);
    } else if (action === 'moveRight') {
      if (currentState === 'ATTACK') return;
      changeState('RUN');
      setPosX(prev => Math.min(prev + 30, 480));
    } else if (action === 'moveLeft') {
      if (currentState === 'ATTACK') return;
      changeState('RUN');
      setPosX(prev => Math.max(prev - 30, 20));
    } else if (action === 'stop') {
      if (currentState === 'RUN') changeState('IDLE');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-1">
            <GitCommit className="w-5 h-5" />
            <span>İnteraktif Laboratuvar: Sonlu Durum Makinesi (FSM) Simülatörü</span>
          </div>
          <p className="text-sm text-slate-400">
            Karakter eylemlerini tetikleyin, durum grafiğindeki aktif düğümü ve çalışan durum kodlarını canlı izleyin.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-slate-400">Aktif Durum:</span>
          <span className="font-bold text-white font-mono">{currentState}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FSM Düğüm Grafiği & Karakter Sahnesi */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Mini Oyun Dünyası */}
          <div className="relative h-44 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-end p-4">
            {/* Zemin çizgisi */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-slate-800 border-t border-slate-700"></div>

            {/* Karakter Nesnesi */}
            <div 
              style={{ 
                left: `${posX}px`,
                bottom: `${posY + 16}px`
              }}
              className="absolute w-12 h-16 rounded-xl bg-gradient-to-t from-indigo-600 to-indigo-400 border-2 border-white shadow-lg flex flex-col items-center justify-center text-xs font-bold text-white transition-all duration-150"
            >
              {currentState === 'ATTACK' ? '⚔️' : currentState === 'JUMP' ? '🚀' : currentState === 'RUN' ? '🏃' : '🧍'}
              <span className="text-[10px] mt-1 font-mono">{currentState}</span>
            </div>

            <div className="absolute top-3 left-3 text-xs text-slate-500 font-mono">
              Konum: X:{posX} Y:{posY}
            </div>
          </div>

          {/* FSM Düğümleri Görsel Akışı */}
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800">
            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">Durum Geçiş Grafiği (State Nodes)</h4>
            
            <div className="grid grid-cols-5 gap-2">
              {Object.keys(STATES).map(key => {
                const isCurrent = currentState === key;
                return (
                  <div
                    key={key}
                    onClick={() => changeState(key)}
                    className={`p-3 rounded-xl border text-center cursor-pointer transition-all duration-200 ${
                      isCurrent 
                        ? `${STATES[key].borderColor} bg-slate-900 shadow-lg scale-105 ring-2 ring-indigo-500/50` 
                        : 'border-slate-800/80 bg-slate-900/40 hover:bg-slate-800/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-1">
                      <span className={`w-2.5 h-2.5 rounded-full ${STATES[key].color} ${isCurrent ? 'animate-ping' : ''}`}></span>
                    </div>
                    <div className="font-bold text-xs font-mono text-white">{key}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Etkileşim Kontrol Butonları */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleAction('moveLeft')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
            >
              ◀ Sola Koş
            </button>
            <button
              onClick={() => handleAction('moveRight')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
            >
              Sağa Koş ▶
            </button>
            <button
              onClick={() => handleAction('stop')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
            >
              Dur (Idle)
            </button>
            <button
              onClick={() => handleAction('jump')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow"
            >
              Zıpla (Jump)
            </button>
            <button
              onClick={() => handleAction('attack')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition shadow"
            >
              Saldır (Attack)
            </button>
          </div>
        </div>

        {/* FSM Kod & Terminal Günlüğü */}
        <div className="flex flex-col gap-4">
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 flex-1">
            <div className="flex items-center gap-2 text-slate-400 font-mono text-xs mb-2">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Aktif Durum Kod Bloğu: {currentState}</span>
            </div>

            <div className="space-y-3 font-mono text-[11px]">
              <div>
                <span className="text-slate-500 text-[10px]"># Enter() Eylemi:</span>
                <pre className="p-2 bg-slate-900 rounded-lg text-emerald-400 overflow-x-auto mt-1">
                  {STATES[currentState].enterCode}
                </pre>
              </div>

              <div>
                <span className="text-slate-500 text-[10px]"># Update() Döngüsü:</span>
                <pre className="p-2 bg-slate-900 rounded-lg text-sky-300 overflow-x-auto mt-1">
                  {STATES[currentState].updateCode}
                </pre>
              </div>
            </div>
          </div>

          {/* Olay Günlüğü */}
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 text-[11px] font-mono">
            <h5 className="text-slate-500 uppercase tracking-wider text-[10px] font-bold mb-2">Geçiş Olay Günlüğü</h5>
            <div className="space-y-1 text-slate-400 max-h-24 overflow-y-auto">
              {eventLogs.map(log => (
                <div key={log.id} className="text-slate-400 border-b border-slate-800/40 pb-0.5">
                  {log.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
