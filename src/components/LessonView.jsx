import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Bookmark, 
  Clock, 
  Layers, 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  Compass,
  Code2,
  BookOpen
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { getAllLessons } from '../data/curriculumData';
import CodeBlock from './CodeBlock';
import VectorLab from './labs/VectorLab';
import JuiceLab from './labs/JuiceLab';
import FsmLab from './labs/FsmLab';
import GameLoopLab from './labs/GameLoopLab';

export default function LessonView({ lesson, onSelectLesson }) {
  const { 
    completedLessons, 
    toggleLessonComplete, 
    bookmarkedLessons, 
    toggleBookmark, 
    activeEngine, 
    setActiveEngine,
    lessonNotes,
    saveLessonNote,
    currentUser
  } = useProgress();
  const [selectedEngineTab, setSelectedEngineTab] = useState(activeEngine || 'unity');
  const [noteContent, setNoteContent] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  // Sync local note state when lesson changes
  React.useEffect(() => {
    if (lesson) {
      setNoteContent(lessonNotes[lesson.id] || '');
      setNoteSaved(false);
    }
  }, [lesson?.id, lessonNotes]);

  const handleSaveNote = () => {
    if (lesson) {
      saveLessonNote(lesson.id, noteContent);
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2500);
    }
  };

  if (!lesson) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500">
        <BookOpen className="w-12 h-12 mb-4 text-slate-700" />
        <p className="text-sm">İncelemek için sol menüden bir ders seçin.</p>
      </div>
    );
  }

  const isCompleted = completedLessons.includes(lesson.id);
  const isBookmarked = bookmarkedLessons.includes(lesson.id);

  const allLessons = getAllLessons();
  const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const engines = [
    { id: 'unity', name: 'Unity C#' },
    { id: 'godot', name: 'Godot GDScript' },
    { id: 'unreal', name: 'Unreal C++ / BP' },
    { id: 'roblox', name: 'Roblox Luau' }
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 max-w-5xl mx-auto space-y-8">
      {/* Ders Üst Başlık & Aksiyon Alanı */}
      <div className="space-y-4 pb-6 border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Seviye {lesson.levelNumber}: {lesson.levelTitle}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{lesson.duration}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBookmark(lesson.id)}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition ${
                isBookmarked 
                  ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Kayıtlılara Ekle / Çıkar"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              <span className="hidden sm:inline">{isBookmarked ? 'Kayıtlı' : 'Kaydet'}</span>
            </button>

            <button
              onClick={() => toggleLessonComplete(lesson.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow ${
                isCompleted
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Tamamlandı</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4" />
                  <span>Tamamlandı Olarak İşaretle</span>
                </>
              )}
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          {lesson.title}
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
          💡 <strong className="text-indigo-300">Özet:</strong> {lesson.summary}
        </p>
      </div>

      {/* Eğer Derse Ait İnteraktif Laboratuvar Varsa Doğrudan Burada Çalıştır */}
      {lesson.labId && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
            <Compass className="w-4 h-4" />
            <span>Dersle Entegre İnteraktif Simülatör</span>
          </div>
          {lesson.labId === 'vector' && <VectorLab />}
          {lesson.labId === 'juice' && <JuiceLab />}
          {lesson.labId === 'fsm' && <FsmLab />}
          {lesson.labId === 'gameloop' && <GameLoopLab />}
        </div>
      )}

      {/* Teorik Anlatım & Tasarımcı Perspektifi */}
      <div className="prose prose-invert max-w-none space-y-4 text-slate-300 leading-relaxed text-sm">
        <div 
          className="lesson-content space-y-4"
          dangerouslySetInnerHTML={{ 
            __html: lesson.description
              .replace(/### (.*?)\n/g, '<h3 class="text-xl font-bold text-white mt-6 mb-2">$1</h3>')
              .replace(/#### (.*?)\n/g, '<h4 class="text-base font-semibold text-indigo-300 mt-4 mb-2">$1</h4>')
              .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-xs">$1</code>')
              .replace(/> (.*?)\n/g, '<div class="p-4 my-4 rounded-xl bg-indigo-950/40 border-l-4 border-indigo-500 text-slate-300">$1</div>')
              .replace(/\n\n/g, '<br/>')
          }} 
        />
      </div>

      {/* Temel Kavramlar Kartları */}
      {lesson.keyConcepts && lesson.keyConcepts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Öğrenilmesi Gereken Temel Kavramlar</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lesson.keyConcepts.map((concept, index) => (
              <div 
                key={index}
                className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 transition"
              >
                <div className="text-xs font-bold text-indigo-300 font-mono mb-1">
                  {concept.term}
                </div>
                <div className="text-xs text-slate-400 leading-relaxed">
                  {concept.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Çoklu Motor Kod Örnekleri (Multi-Engine Switcher) */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Çoklu Motor Uygulama Kodları</h3>
          </div>
          <span className="text-xs text-slate-400">
            Aynı mekaniğin 4 farklı popüler oyun motorundaki karşılığı
          </span>
        </div>

        {/* Motor Sekmeleri */}
        <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-900/80 rounded-xl border border-slate-800">
          {engines.map(engine => {
            const isTabActive = selectedEngineTab === engine.id;
            return (
              <button
                key={engine.id}
                onClick={() => setSelectedEngineTab(engine.id)}
                className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-semibold transition ${
                  isTabActive
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {engine.name}
              </button>
            );
          })}
        </div>

        {/* Seçili Motorun Kod Bloğu */}
        {lesson.codeExamples && lesson.codeExamples[selectedEngineTab] ? (
          <CodeBlock
            code={lesson.codeExamples[selectedEngineTab]}
            language={selectedEngineTab}
            title={`${engines.find(e => e.id === selectedEngineTab)?.name} Örneği`}
          />
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
            Bu motor için kod örneği hazırlanıyor.
          </div>
        )}
      </div>

      {/* Kişisel Ders Notu Kutusu (Öğrenciye Özel Bulut Kaydı) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <span>📝 Bu Derse Özel Kişisel Notlarım</span>
            {currentUser && (
              <span className="text-[10px] text-emerald-400 font-mono normal-case bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Bulut Senkronize
              </span>
            )}
          </div>
          <button
            onClick={handleSaveNote}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              noteSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {noteSaved ? 'Not Kaydedildi ✓' : 'Notu Kaydet'}
          </button>
        </div>

        <textarea
          rows={3}
          placeholder="Bu dersle ilgili aklınıza gelen fikirleri, oyun projenize nasıl uyarlayacağınızı veya sınav notlarınızı buraya yazın..."
          value={noteContent}
          onChange={(e) => {
            setNoteContent(e.target.value);
            setNoteSaved(false);
          }}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition leading-relaxed resize-y"
        />
        <div className="flex justify-between text-[11px] text-slate-500">
          <span>Bu notlar yalnızca sizin hesabınızdan görülebilir.</span>
          <span>{noteContent.length} karakter</span>
        </div>
      </div>

      {/* Önceki / Sonraki Ders Gezintisi */}
      <div className="pt-8 border-t border-slate-800 flex items-center justify-between gap-4">
        {prevLesson ? (
          <button
            onClick={() => onSelectLesson(prevLesson.id)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 p-3 rounded-xl border border-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <div className="text-left">
              <div className="text-[10px] text-slate-400">Önceki Ders</div>
              <div className="font-medium text-slate-200 truncate max-w-[200px]">{prevLesson.title}</div>
            </div>
          </button>
        ) : <div></div>}

        {nextLesson ? (
          <button
            onClick={() => onSelectLesson(nextLesson.id)}
            className="flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/40 p-3 rounded-xl border border-indigo-800/40 transition text-right"
          >
            <div className="text-right">
              <div className="text-[10px] text-slate-400">Sonraki Ders</div>
              <div className="font-medium text-indigo-300 truncate max-w-[200px]">{nextLesson.title}</div>
            </div>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : <div></div>}
      </div>
    </div>
  );
}
