import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Volume2, ShieldAlert, Zap, Sliders, Play, RotateCcw } from 'lucide-react';

export default function JuiceLab() {
  const [toggles, setToggles] = useState({
    screenShake: true,
    hitStop: true,
    squashStretch: true,
    particles: true,
    damageNumbers: true,
    flashEffect: true,
    sound: true
  });

  const [isShaking, setIsShaking] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isSquashing, setIsSquashing] = useState(false);
  const [isHitStopped, setIsHitStopped] = useState(false);
  const [particles, setParticles] = useState([]);
  const [damageTexts, setDamageTexts] = useState([]);
  const [hitCombo, setHitCombo] = useState(0);

  const containerRef = useRef(null);

  // Web Audio API ile dahili 'Juice' darbe sesi üretimi (Harici ses dosyası gerektirmez)
  const playImpactSound = (isJuicy) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (isJuicy) {
        // Tok ve patlayıcı bas vuruş sesi
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.15);

        gain.gain.setValueAtTime(0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      } else {
        // Donuk, tekdüze basit 'bip' sesi
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch {
      // AudioContext engellenirse sessizce yut
    }
  };

  // Vur Eylemi (Attack Trigger)
  const triggerAttack = () => {
    setHitCombo(prev => prev + 1);
    const damage = Math.floor(Math.random() * 25) + 35;

    // 1. Ses
    if (toggles.sound) {
      playImpactSound(toggles.screenShake || toggles.hitStop);
    }

    // 2. Hit Stop (Frame Freeze)
    if (toggles.hitStop) {
      setIsHitStopped(true);
      setTimeout(() => {
        setIsHitStopped(false);
      }, 70);
    }

    // 3. Screen Shake
    if (toggles.screenShake) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 220);
    }

    // 4. Squash & Stretch
    if (toggles.squashStretch) {
      setIsSquashing(true);
      setTimeout(() => setIsSquashing(false), 250);
    }

    // 5. Flash Effect
    if (toggles.flashEffect) {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 80);
    }

    // 6. Particle Burst
    if (toggles.particles) {
      const newParticles = Array.from({ length: 14 }).map((_, i) => ({
        id: Math.random(),
        x: (Math.random() - 0.5) * 160,
        y: (Math.random() - 0.5) * 160 - 20,
        color: ['#fbbf24', '#f87171', '#fb7185', '#ffffff'][Math.floor(Math.random() * 4)],
        size: Math.random() * 8 + 4
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 450);
    }

    // 7. Floating Damage Numbers
    if (toggles.damageNumbers) {
      const newDmg = {
        id: Math.random(),
        val: damage,
        x: (Math.random() - 0.5) * 60,
        y: -30
      };
      setDamageTexts(prev => [...prev, newDmg]);
      setTimeout(() => {
        setDamageTexts(prev => prev.filter(item => item.id !== newDmg.id));
      }, 700);
    }
  };

  const setAllToggles = (val) => {
    setToggles({
      screenShake: val,
      hitStop: val,
      squashStretch: val,
      particles: val,
      damageNumbers: val,
      flashEffect: val,
      sound: val
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
            <Sparkles className="w-5 h-5" />
            <span>Teknik Oyun Tasarımı Laboratuvarı: 'Game Feel' & Juice Simülatörü</span>
          </div>
          <p className="text-sm text-slate-400">
            Aynı saldırı mekaniğinin efektler olmadan ne kadar donuk, efektler açıkken ne kadar tatmin edici hissettirdiğini anında kıyaslayın!
          </p>
        </div>

        {/* Hızlı Karşılaştırma Butonları */}
        <div className="flex gap-2">
          <button
            onClick={() => setAllToggles(false)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            Sıfır Juice (Donuk Kod)
          </button>
          <button
            onClick={() => setAllToggles(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 transition"
          >
            Maksimum Juice (Tatmin Edici)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* İnteraktif Oyun Alanı */}
        <div 
          ref={containerRef}
          className={`lg:col-span-2 relative h-96 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center overflow-hidden transition-transform duration-75 ${
            isShaking ? 'translate-x-1.5 -translate-y-1 rotate-0.5' : ''
          }`}
        >
          {/* Arka plan ızgara */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>

          {/* Dondurma Bildirimi */}
          {isHitStopped && (
            <div className="absolute top-4 bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-mono font-bold animate-pulse">
              HIT STOP (60ms FREEZE)
            </div>
          )}

          {/* Hedef Düşman / Dummy Kuklası */}
          <div 
            onClick={triggerAttack}
            className={`relative cursor-pointer select-none transition-all duration-100 ${
              isSquashing ? 'scale-x-125 scale-y-75 translate-y-3' : 'scale-100'
            }`}
          >
            {/* Karakter Gövdesi */}
            <div className={`w-32 h-32 rounded-3xl flex flex-col items-center justify-center font-bold text-lg shadow-2xl transition-colors duration-75 ${
              isFlashing 
                ? 'bg-white text-slate-950 shadow-white/50' 
                : 'bg-gradient-to-br from-rose-500 to-red-700 text-white shadow-rose-900/50'
            }`}>
              <div className="text-3xl mb-1">👾</div>
              <span className="text-xs font-mono tracking-wider">HEDEF KUKLA</span>
            </div>

            {/* Yüzen Hasar Metinleri (Damage Numbers) */}
            {damageTexts.map(item => (
              <div
                key={item.id}
                style={{ transform: `translate(${item.x}px, ${item.y}px)` }}
                className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl font-black text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] animate-bounce pointer-events-none"
              >
                -{item.val}
              </div>
            ))}

            {/* Patlayan Partiküller */}
            {particles.map(p => (
              <div
                key={p.id}
                style={{
                  transform: `translate(${p.x}px, ${p.y}px)`,
                  backgroundColor: p.color,
                  width: `${p.size}px`,
                  height: `${p.size}px`
                }}
                className="absolute top-1/2 left-1/2 rounded-full pointer-events-none transition-all duration-300 opacity-90 animate-ping"
              />
            ))}
          </div>

          {/* Vur Butonu */}
          <button
            onClick={triggerAttack}
            className="mt-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black px-8 py-3.5 rounded-2xl shadow-xl shadow-amber-500/20 flex items-center gap-2 transform active:scale-95 transition"
          >
            <Zap className="w-5 h-5 fill-current" />
            <span>KUKLAYA VUR! (KOMBO: {hitCombo})</span>
          </button>
        </div>

        {/* Juice Ayar Paneli */}
        <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-300 font-semibold mb-4 text-sm pb-2 border-b border-slate-800">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Game Feel Parametreleri</span>
            </div>

            <div className="space-y-3">
              {[
                { id: 'screenShake', label: 'Screen Shake (Kamera Sarsıntısı)', desc: 'Darbe anında kamerayı sarsar' },
                { id: 'hitStop', label: 'Hit Stop (Frame Freeze)', desc: 'Vuruşta 60ms zamanı dondurur' },
                { id: 'squashStretch', label: 'Squash & Stretch', desc: 'Darbe hacmini esnetip ezer' },
                { id: 'flashEffect', label: 'Impact Flash (Beyaz Parlama)', desc: 'Hasar anı 1 kare beyaz yanar' },
                { id: 'particles', label: 'Particle Burst (Kıvılcım)', desc: 'Darbe noktasından parçacık fışkırır' },
                { id: 'damageNumbers', label: 'Damage Numbers (Yüzen Sayı)', desc: 'Havaya fırlayan hasar metinleri' },
                { id: 'sound', label: 'Punchy Audio (Dinamik Ses)', desc: 'Tok bas vuruş ses frekansı' },
              ].map(toggle => (
                <label 
                  key={toggle.id} 
                  className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-900 cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={toggles[toggle.id]}
                    onChange={(e) => setToggles(prev => ({ ...prev, [toggle.id]: e.target.checked }))}
                    className="mt-1 w-4 h-4 rounded text-indigo-600 accent-indigo-500 cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{toggle.label}</div>
                    <div className="text-[11px] text-slate-500">{toggle.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 leading-relaxed">
            💡 <strong className="text-slate-400">Tasarım İlkesi:</strong> Sıfır Juice ile Maksimum Juice arasındaki fark, oyun mekaniğinin değil, duyusal geri bildirimin (Game Feel) gücüdür.
          </div>
        </div>
      </div>
    </div>
  );
}
