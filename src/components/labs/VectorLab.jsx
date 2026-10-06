import React, { useState, useRef, useEffect } from 'react';
import { Compass, Eye, Move, RefreshCw, Zap } from 'lucide-react';

export default function VectorLab() {
  const canvasRef = useRef(null);

  // Karakter ve Hedef Konumları (Canvas içi koordinatlar)
  const [playerPos, setPlayerPos] = useState({ x: 250, y: 220 });
  const [targetPos, setTargetPos] = useState({ x: 420, y: 140 });
  const [playerFacingAngle, setPlayerFacingAngle] = useState(0); // Derece cinsinden (0 = Sağa bakar)
  const [fovAngle, setFovAngle] = useState(70); // Görüş açısı derecesi
  const [lerpFactor, setLerpFactor] = useState(0.08);
  const [isLerping, setIsLerping] = useState(false);
  const [isDragging, setIsDragging] = useState(null); // 'player' | 'target' | null

  // Matematiksel Hesaplamalar
  const dx = targetPos.x - playerPos.x;
  const dy = targetPos.y - playerPos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const normX = distance > 0 ? dx / distance : 0;
  const normY = distance > 0 ? dy / distance : 0;

  // Karakterin baktığı birim yön vektörü
  const facingRad = (playerFacingAngle * Math.PI) / 180;
  const forwardX = Math.cos(facingRad);
  const forwardY = Math.sin(facingRad);

  // Dot Product: A · B = cos(θ)
  const dotProduct = forwardX * normX + forwardY * normY;
  // Açı hesaplama: radyan -> derece
  const clampedDot = Math.max(-1, Math.min(1, dotProduct));
  const angleBetween = Math.round((Math.acos(clampedDot) * 180) / Math.PI);
  const isInFov = angleBetween <= fovAngle / 2;

  // Canvas Çizimi
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Arka planı temizle
    ctx.clearRect(0, 0, width, height);

    // 1. Grid Çizimi (Izgara)
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 2. Görüş Konisi (FOV Cone)
    const coneRadius = 180;
    const halfFovRad = ((fovAngle / 2) * Math.PI) / 180;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(playerPos.x, playerPos.y);
    ctx.arc(
      playerPos.x,
      playerPos.y,
      coneRadius,
      facingRad - halfFovRad,
      facingRad + halfFovRad
    );
    ctx.closePath();
    ctx.fillStyle = isInFov ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.1)';
    ctx.fill();
    ctx.strokeStyle = isInFov ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // 3. Mesafe Vektörü Çizimi (Player -> Target)
    ctx.beginPath();
    ctx.moveTo(playerPos.x, playerPos.y);
    ctx.lineTo(targetPos.x, targetPos.y);
    ctx.strokeStyle = isInFov ? '#4ade80' : '#f87171';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 4. Karakter İleri Yön Vektörü (Forward Vector)
    const forwardLength = 70;
    const fX = playerPos.x + forwardX * forwardLength;
    const fY = playerPos.y + forwardY * forwardLength;
    ctx.beginPath();
    ctx.moveTo(playerPos.x, playerPos.y);
    ctx.lineTo(fX, fY);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // İleri ok ucu
    const arrowHeadLen = 10;
    const arrowAngle1 = facingRad + (5 * Math.PI) / 6;
    const arrowAngle2 = facingRad - (5 * Math.PI) / 6;
    ctx.beginPath();
    ctx.moveTo(fX, fY);
    ctx.lineTo(fX + arrowHeadLen * Math.cos(arrowAngle1), fY + arrowHeadLen * Math.sin(arrowAngle1));
    ctx.moveTo(fX, fY);
    ctx.lineTo(fX + arrowHeadLen * Math.cos(arrowAngle2), fY + arrowHeadLen * Math.sin(arrowAngle2));
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 5. Karakter Çizimi (Player)
    ctx.beginPath();
    ctx.arc(playerPos.x, playerPos.y, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#6366f1';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Karakter İçi İkon/Yazı
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('P', playerPos.x, playerPos.y);

    // 6. Hedef Çizimi (Target)
    ctx.beginPath();
    ctx.arc(targetPos.x, targetPos.y, 14, 0, Math.PI * 2);
    ctx.fillStyle = isInFov ? '#22c55e' : '#ef4444';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.fillText('T', targetPos.x, targetPos.y);

    // Bilgi Etiketi (Mesafe)
    const midX = (playerPos.x + targetPos.x) / 2;
    const midY = (playerPos.y + targetPos.y) / 2 - 12;
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.fillText(`Mesafe: ${Math.round(distance)} px`, midX, midY);

  }, [playerPos, targetPos, playerFacingAngle, fovAngle, isInFov, facingRad, forwardX, forwardY]);

  // Canlı Lerp Animasyonu
  useEffect(() => {
    let animId;
    if (isLerping) {
      const step = () => {
        setPlayerPos(prev => {
          const newX = prev.x + (targetPos.x - prev.x) * lerpFactor;
          const newY = prev.y + (targetPos.y - prev.y) * lerpFactor;
          if (Math.abs(targetPos.x - newX) < 1 && Math.abs(targetPos.y - newY) < 1) {
            setIsLerping(false);
            return { x: targetPos.x, y: targetPos.y };
          }
          return { x: newX, y: newY };
        });
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isLerping, targetPos, lerpFactor]);

  // Fare Etkileşimi
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const distPlayer = Math.hypot(mouseX - playerPos.x, mouseY - playerPos.y);
    const distTarget = Math.hypot(mouseX - targetPos.x, mouseY - targetPos.y);

    if (distPlayer < 25) {
      setIsDragging('player');
    } else if (distTarget < 25) {
      setIsDragging('target');
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = Math.max(20, Math.min(rect.width - 20, e.clientX - rect.left));
    const mouseY = Math.max(20, Math.min(rect.height - 20, e.clientY - rect.top));

    if (isDragging === 'player') {
      setPlayerPos({ x: mouseX, y: mouseY });
    } else if (isDragging === 'target') {
      setTargetPos({ x: mouseX, y: mouseY });
    }
  };

  const handleMouseUp = () => setIsDragging(null);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-1">
            <Compass className="w-5 h-5" />
            <span>İnteraktif Laboratuvar: Vektör Matematiği & Görüş Açısı (FOV)</span>
          </div>
          <p className="text-sm text-slate-400">
            Karakter (P) ve Hedef (T) noktalarını fareyle sürükleyin. Dot Product ve görüş açısını canlı gözlemleyin.
          </p>
        </div>

        {/* Durum Rozeti */}
        <div className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 border ${
          isInFov 
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
            : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
        }`}>
          <Eye className="w-4 h-4" />
          <span>{isInFov ? 'HEDEF GÖRÜŞ ALANINDA!' : 'HEDEF GÖRÜLEMİYOR'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Alanı */}
        <div className="lg:col-span-2 relative bg-slate-950 rounded-xl border border-slate-800 p-2 flex justify-center items-center overflow-hidden">
          <canvas
            ref={canvasRef}
            width={600}
            height={420}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="cursor-crosshair max-w-full rounded-lg"
          />
          <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-slate-400 flex items-center gap-3">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span> P: Oyuncu</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> T: Hedef</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-sky-400 inline-block"></span> Mavi Ok: Forward</span>
          </div>
        </div>

        {/* Kontrol ve Canlı Matematik Paneli */}
        <div className="flex flex-col gap-4">
          {/* Canlı Hesaplamalar */}
          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 text-sm">
            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">Canlı Vektör Metrikleri</h4>
            
            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Mesafe (Magnitude):</span>
                <span className="text-indigo-400 font-semibold">{distance.toFixed(1)} px</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Normalize Yön (Dir):</span>
                <span className="text-sky-400 font-semibold">({normX.toFixed(2)}, {normY.toFixed(2)})</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Dot Product (A · B):</span>
                <span className={`font-bold ${dotProduct > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {dotProduct.toFixed(3)}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Aralarındaki Açı (θ):</span>
                <span className="text-amber-400 font-semibold">{angleBetween}°</span>
              </div>
            </div>
          </div>

          {/* Ayar Kaydırıcıları */}
          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Karakter Baktığı Açı:</span>
                <span className="text-sky-400">{playerFacingAngle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={playerFacingAngle}
                onChange={(e) => setPlayerFacingAngle(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Görüş Açısı (FOV):</span>
                <span className="text-emerald-400">{fovAngle}°</span>
              </div>
              <input
                type="range"
                min="20"
                max="160"
                value={fovAngle}
                onChange={(e) => setFovAngle(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Lerp Hızı (t):</span>
                <span className="text-indigo-400">{lerpFactor.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.02"
                max="0.25"
                step="0.01"
                value={lerpFactor}
                onChange={(e) => setLerpFactor(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsLerping(true)}
              disabled={isLerping}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Lerp ile Takip Et</span>
            </button>
            <button
              onClick={() => {
                setPlayerPos({ x: 250, y: 220 });
                setTargetPos({ x: 420, y: 140 });
                setPlayerFacingAngle(0);
                setIsLerping(false);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 px-3 rounded-xl text-xs flex items-center justify-center transition"
              title="Konumları Sıfırla"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
