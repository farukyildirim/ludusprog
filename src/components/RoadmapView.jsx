import React from 'react';
import { 
  Map, 
  CheckCircle2, 
  Circle, 
  ArrowDown, 
  Award, 
  Sparkles, 
  Clock, 
  RotateCcw,
  Compass,
  ArrowRight
} from 'lucide-react';
import { CURRICULUM, getAllLessons } from '../data/curriculumData';
import { useProgress } from '../context/ProgressContext';

export default function RoadmapView({ onSelectLesson }) {
  const { completedLessons, quizScores, resetProgress } = useProgress();
  const allLessons = getAllLessons();
  const totalCompleted = completedLessons.length;
  const progressPercent = Math.round((totalCompleted / allLessons.length) * 100);

  // Bulunan ilk tamamlanmamış dersi öner
  const nextRecommended = allLessons.find(l => !completedLessons.includes(l.id)) || allLessons[0];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
      {/* Üst İlerleme ve Rozet Özeti */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/40 p-6 rounded-3xl border border-indigo-900/40 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <Map className="w-4 h-4" />
              <span>Öğrenme Yol Haritası & İlerleme</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Dijital Oyun Programlama Kariyer Rotası
            </h1>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Temel oyun döngüsü ve vektörlerden başlayarak AAA mimarilerine, çok oyunculu ağlara ve teknik oyun tasarımına uzanan aşamalı müfredat.
            </p>
          </div>

          {/* İlerleme Çemberi / Kartı */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center min-w-[200px] shrink-0">
            <div className="text-3xl font-black text-indigo-400 font-mono">
              %{progressPercent}
            </div>
            <div className="text-xs font-semibold text-slate-200 mt-1">
              {totalCompleted} / {allLessons.length} Ders Tamamlandı
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div 
                style={{ width: `${progressPercent}%` }}
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>

        {/* Sıradaki Önerilen Ders Aksiyonu */}
        {nextRecommended && totalCompleted < allLessons.length && (
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-amber-400 font-bold">🚀 Sıradaki Hedef:</span>
              <span className="font-semibold text-white">{nextRecommended.title}</span>
              <span className="text-slate-500">({nextRecommended.duration})</span>
            </div>
            <button
              onClick={() => onSelectLesson(nextRecommended.id)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-1.5 rounded-xl transition flex items-center gap-1.5"
            >
              <span>Derse Başla</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Yol Haritası Düğümleri */}
      <div className="relative space-y-12 before:absolute before:inset-0 before:left-8 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-blue-500 before:to-amber-500 hidden md:block">
        {CURRICULUM.map((level, levelIdx) => {
          const levelCompleted = level.lessons.filter(l => completedLessons.includes(l.id)).length;
          const levelPercent = Math.round((levelCompleted / level.lessons.length) * 100);

          return (
            <div key={level.id} className="relative pl-20 space-y-4">
              {/* Seviye Çapası / İkonu */}
              <div className={`absolute left-4 top-0 w-8 h-8 rounded-full border-4 border-slate-950 flex items-center justify-center font-bold text-xs text-white shadow-xl ${
                levelPercent === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
              }`}>
                {level.levelNumber}
              </div>

              {/* Seviye Başlık Kartı */}
              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${level.badgeColor}`}>
                      Seviye {level.levelNumber}
                    </span>
                    <h2 className="text-lg font-bold text-white">{level.title}</h2>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    %{levelPercent} Tamamlandı
                  </span>
                </div>
                <p className="text-xs text-slate-400">{level.tagline}</p>

                {/* Ders Düğümleri Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {level.lessons.map(lesson => {
                    const isDone = completedLessons.includes(lesson.id);

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start justify-between gap-3 ${
                          isDone
                            ? 'bg-emerald-950/20 border-emerald-900/40 hover:border-emerald-700/60'
                            : 'bg-slate-950/60 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5">
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-600" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-200">
                              {lesson.title}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-mono">
                              <span>{lesson.duration}</span>
                              {lesson.labId && (
                                <span className="text-indigo-400 font-bold">★ Lab İçerir</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0 self-center" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobil Görünüm (Dikey Liste) */}
      <div className="block md:hidden space-y-6">
        {CURRICULUM.map(level => (
          <div key={level.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${level.badgeColor}`}>
                Seviye {level.levelNumber}
              </span>
              <span className="text-xs text-slate-400">
                {level.lessons.filter(l => completedLessons.includes(l.id)).length}/{level.lessons.length}
              </span>
            </div>
            <h3 className="font-bold text-white text-sm">{level.title}</h3>
            <div className="space-y-2">
              {level.lessons.map(lesson => (
                <div
                  key={lesson.id}
                  onClick={() => onSelectLesson(lesson.id)}
                  className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs flex items-center justify-between text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    {completedLessons.includes(lesson.id) ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600" />
                    )}
                    <span>{lesson.title}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* İlerleme Sıfırlama Butonu */}
      <div className="pt-6 border-t border-slate-800 flex justify-end">
        <button
          onClick={resetProgress}
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-rose-400 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Eğitim İlerlemesini Sıfırla</span>
        </button>
      </div>
    </div>
  );
}
