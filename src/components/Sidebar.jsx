import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Bookmark, 
  Sparkles, 
  Search, 
  ChevronDown, 
  ChevronRight,
  Compass,
  Clock
} from 'lucide-react';
import { CURRICULUM } from '../data/curriculumData';
import { useProgress } from '../context/ProgressContext';

export default function Sidebar({ selectedLessonId, onSelectLesson, onOpenLab }) {
  const { completedLessons, bookmarkedLessons, toggleBookmark } = useProgress();
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedLevels, setCollapsedLevels] = useState({});
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'completed' | 'bookmarks'

  const toggleLevelCollapse = (levelId) => {
    setCollapsedLevels(prev => ({
      ...prev,
      [levelId]: !prev[levelId]
    }));
  };

  return (
    <aside className="w-80 shrink-0 bg-slate-950/60 border-r border-slate-800 flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none">
      {/* Arama & Filtre Çubuğu */}
      <div className="p-4 border-b border-slate-800/80 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Ders veya konu ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Filtre Butonları */}
        <div className="flex gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-800/80 text-[11px]">
          <button
            onClick={() => setFilterMode('all')}
            className={`flex-1 py-1 rounded-md transition font-medium ${
              filterMode === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setFilterMode('completed')}
            className={`flex-1 py-1 rounded-md transition font-medium ${
              filterMode === 'completed' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tamamlanan
          </button>
          <button
            onClick={() => setFilterMode('bookmarks')}
            className={`flex-1 py-1 rounded-md transition font-medium ${
              filterMode === 'bookmarks' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Kayıtlılar
          </button>
        </div>
      </div>

      {/* Ders Listesi Hiyerarşisi */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {CURRICULUM.map(level => {
          const isCollapsed = collapsedLevels[level.id];
          const filteredLessons = level.lessons.filter(lesson => {
            const matchesSearch = 
              lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              lesson.summary.toLowerCase().includes(searchQuery.toLowerCase());
            
            if (!matchesSearch) return false;
            if (filterMode === 'completed') return completedLessons.includes(lesson.id);
            if (filterMode === 'bookmarks') return bookmarkedLessons.includes(lesson.id);
            return true;
          });

          if (filteredLessons.length === 0 && searchQuery) return null;

          const levelCompletedCount = level.lessons.filter(l => completedLessons.includes(l.id)).length;

          return (
            <div key={level.id} className="rounded-xl overflow-hidden bg-slate-900/40 border border-slate-800/80">
              {/* Seviye Başlığı / Akordeon Başlık */}
              <div
                onClick={() => toggleLevelCollapse(level.id)}
                className="flex items-center justify-between p-3 bg-slate-900/80 hover:bg-slate-800/60 cursor-pointer transition text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${level.badgeColor}`}>
                    Seviye {level.levelNumber}
                  </span>
                  <span className="font-semibold text-slate-200">{level.shortTitle}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {levelCompletedCount}/{level.lessons.length}
                  </span>
                  {isCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Dersler */}
              {!isCollapsed && (
                <div className="p-1 space-y-0.5">
                  {filteredLessons.map(lesson => {
                    const isSelected = selectedLessonId === lesson.id;
                    const isCompleted = completedLessons.includes(lesson.id);
                    const isBookmarked = bookmarkedLessons.includes(lesson.id);

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson.id)}
                        className={`group flex items-start justify-between p-2.5 rounded-lg cursor-pointer text-xs transition ${
                          isSelected
                            ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                            : 'hover:bg-slate-800/50 text-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5">
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium leading-snug">
                              {lesson.title}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{lesson.duration}</span>
                              </span>
                              {lesson.labId && (
                                <span className="inline-flex items-center gap-0.5 text-indigo-400 font-semibold bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-500/20">
                                  <Compass className="w-2.5 h-2.5" />
                                  <span>Lab</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Favori Butonu */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(lesson.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-amber-400 text-slate-500 transition"
                          title="Kayıtlılara Ekle"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400 opacity-100' : ''}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
