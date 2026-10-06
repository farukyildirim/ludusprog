import React, { useState, useEffect, useRef } from 'react';
import { Gauge, Play, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function GameLoopLab() {
  const [simulatedFps, setSimulatedFps] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  // Yarışçıların konumları (0 ile 100 arası yüzde)
  const [posWithDelta, setPosWithDelta] = useState(0);
  const [posWithoutDelta, setPosWithoutDelta] = useState(0);

  const speedUnitsPerSecond = 20; // Saniyede %20 ilerleme
  const speedPerFrameFixed = 0.33; // 60 FPS'e göre varsayılan sabit değer (0.33 * 60 ~= 20)

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      const frameIntervalMs = 1000 / simulatedFps;
      const dt = 1 / simulatedFps;

      intervalId = setInterval(() => {
        setPosWithDelta(prev => {
          const next = prev + speedUnitsPerSecond * dt;
          if (next >= 100) {
            setIsRunning(false);
            return 100;
          }
          return next;
        });

        setPosWithoutDelta(prev => {
          const next = prev + speedPerFrameFixed;
          return next >= 100 ? 100 : next;
        });
      }, frameIntervalMs);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, simulatedFps]);

  const handleReset = () => {
    setIsRunning(false);
    setPosWithDelta(0);
    setPosWithoutDelta(0);
  };

  const frameTimeMs = (1000 / simulatedFps).toFixed(1);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-teal-400 font-semibold mb-1">
            <Gauge className="w-5 h-5" />
            <span>İnteraktif Laboratuvar: Kare Hızı & Delta Time Karşılaştırması</span>
          </div>
          <p className="text-sm text-slate-400">
            FPS kaydırıcısını değiştirerek <code className="text-teal-400">Time.deltaTime</code> kullanan ve kullanmayan iki karakterin hareket farkını canlı görün.
          </p>
        </div>

        {/* FPS Göstergesi */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500">Simüle Edilen FPS:</span>
            <span className="ml-1.5 font-bold text-teal-400 font-mono text-sm">{simulatedFps} FPS</span>
          </div>
          <div className="text-slate-600">|</div>
          <div>
            <span className="text-slate-500">Kare Süresi:</span>
            <span className="ml-1.5 font-mono text-slate-300">{frameTimeMs} ms</span>
          </div>
        </div>
      </div>

      {/* Yarış Pisti */}
      <div className="space-y-6 mb-6">
        {/* 1. Delta Time Kullanan (Doğru Mimari) */}
        <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/40 relative">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>DOĞRU: DeltaTime Kullanan Karakter (\`speed * deltaTime\`)</span>
            </div>
            <span className="font-mono text-slate-400">İlerleme: %{posWithDelta.toFixed(1)}</span>
          </div>

          <div className="h-10 bg-slate-900 rounded-lg relative overflow-hidden border border-slate-800">
            {/* Bitiş Çizgisi */}
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-emerald-500/50"></div>
            
            {/* Karakter */}
            <div
              style={{ left: `${posWithDelta}%` }}
              className="absolute top-1 bottom-1 w-10 -ml-5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-lg flex items-center justify-center text-sm shadow-lg shadow-emerald-500/30 transition-all duration-75"
            >
              🚀
            </div>
          </div>
          <div className="text-[11px] text-emerald-500/80 mt-1.5">
            FPS ne olursa olsun her saniye tam olarak aynı mesafeyi kat eder (Kare hızından bağımsız).
          </div>
        </div>

        {/* 2. Delta Time Kullanmayan (Hatalı Kod) */}
        <div className="bg-slate-950 p-4 rounded-xl border border-rose-900/40 relative">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2 text-rose-400 font-semibold">
              <AlertTriangle className="w-4 h-4" />
              <span>HATALI: Sabit Kare Başına Hareket (\`speed\`)</span>
            </div>
            <span className="font-mono text-slate-400">İlerleme: %{posWithoutDelta.toFixed(1)}</span>
          </div>

          <div className="h-10 bg-slate-900 rounded-lg relative overflow-hidden border border-slate-800">
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-rose-500/50"></div>
            
            <div
              style={{ left: `${posWithoutDelta}%` }}
              className="absolute top-1 bottom-1 w-10 -ml-5 bg-gradient-to-r from-rose-500 to-red-400 rounded-lg flex items-center justify-center text-sm shadow-lg shadow-rose-500/30 transition-all duration-75"
            >
              🚗
            </div>
          </div>
          <div className="text-[11px] text-rose-500/80 mt-1.5">
            FPS düştüğünde yavaşlar, FPS yükseldiğinde hızlanır. Adil ve kararlı bir oynanış sağlamaz!
          </div>
        </div>
      </div>

      {/* Kontroller */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div className="w-full sm:w-72">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Simüle Edilen Kare Hızı:</span>
            <span className="text-teal-400 font-bold">{simulatedFps} FPS</span>
          </div>
          <input
            type="range"
            min="10"
            max="120"
            step="5"
            value={simulatedFps}
            onChange={(e) => setSimulatedFps(Number(e.target.value))}
            className="w-full accent-teal-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
            <span>10 FPS (Kasıyor)</span>
            <span>60 FPS (Standart)</span>
            <span>120 FPS (Yüksek)</span>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex-1 sm:flex-initial bg-teal-600 hover:bg-teal-500 text-white font-medium py-2.5 px-5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isRunning ? 'Durdur' : 'Yarışı Başlat'}</span>
          </button>
          <button
            onClick={handleReset}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 px-3 rounded-xl text-xs flex items-center justify-center transition"
            title="Sıfırla"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
