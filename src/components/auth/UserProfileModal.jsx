import React, { useState } from 'react';
import { 
  X, 
  User, 
  LogOut, 
  Award, 
  BookOpen, 
  Clock, 
  FileText, 
  Cloud, 
  CheckCircle2, 
  School,
  ExternalLink
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { getAllLessons } from '../../data/curriculumData';
import { QUIZZES } from '../../data/quizData';

export default function UserProfileModal({ isOpen, onClose, onSelectLesson }) {
  const { 
    currentUser, 
    userProfile, 
    handleLogout, 
    completedLessons, 
    quizScores, 
    bookmarkedLessons,
    lessonNotes,
    syncStatus 
  } = useProgress();

  const [activeProfileTab, setActiveProfileTab] = useState('overview'); // 'overview' | 'notes' | 'badges'

  if (!isOpen) return null;

  const allLessons = getAllLessons();
  const totalCompleted = completedLessons.length;
  const progressPercent = Math.round((totalCompleted / allLessons.length) * 100);

  // Not alınan dersler
  const notesEntries = Object.entries(lessonNotes).filter(([_, text]) => text && text.trim().length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] flex flex-col">
        {/* Kapat Butonu */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profil Başlığı */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-600/20">
              {currentUser?.displayName ? currentUser.displayName[0].toUpperCase() : 'Ö'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  {currentUser?.displayName || 'Misafir Öğrenci'}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  {userProfile?.role === 'instructor' ? 'Eğitmen' : 'Öğrenci'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {currentUser?.email || 'Yerel Cihaz'}
              </p>
              {userProfile?.university && (
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                  <School className="w-3.5 h-3.5" />
                  <span>{userProfile.university}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bulut Senkronizasyon Rozeti */}
          <div className="flex items-center gap-2 self-start sm:self-center px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <Cloud className={`w-3.5 h-3.5 ${
              syncStatus === 'synced' ? 'text-emerald-400' :
              syncStatus === 'syncing' ? 'text-amber-400 animate-pulse' : 'text-slate-500'
            }`} />
            <span className="text-[11px] font-medium text-slate-300">
              {syncStatus === 'synced' && 'Bulut Senkronize 🟢'}
              {syncStatus === 'syncing' && 'Senkronize Ediliyor... 🟡'}
              {syncStatus === 'local' && 'Yerel Misafir Modu ⚪'}
              {syncStatus === 'error' && 'Senkronizasyon Hatası 🔴'}
            </span>
          </div>
        </div>

        {/* Sekmeler */}
        <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveProfileTab('overview')}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              activeProfileTab === 'overview'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            İlerleme & İstatistikler
          </button>
          <button
            onClick={() => setActiveProfileTab('notes')}
            className={`flex-1 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-1.5 ${
              activeProfileTab === 'notes'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Ders Notlarım</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-mono">
              {notesEntries.length}
            </span>
          </button>
          <button
            onClick={() => setActiveProfileTab('badges')}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              activeProfileTab === 'badges'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Kazanılan Rozetler
          </button>
        </div>

        {/* Sekme İçerikleri */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {activeProfileTab === 'overview' && (
            <div className="space-y-4">
              {/* İstatistik Kartları */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                  <div className="text-2xl font-black text-indigo-400 font-mono">
                    %{progressPercent}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Müfredat Tamamlama</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {totalCompleted}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Tamamlanan Ders</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    {Object.keys(quizScores).length}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Çözülen Sınav</div>
                </div>
              </div>

              {/* Tamamlanan Son Dersler */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Son Tamamlanan Konular
                </h4>
                {completedLessons.length === 0 ? (
                  <p className="text-xs text-slate-500 py-2">Henüz tamamlanan bir ders yok.</p>
                ) : (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {completedLessons.slice(-5).map(id => {
                      const lesson = allLessons.find(l => l.id === id);
                      if (!lesson) return null;
                      return (
                        <div 
                          key={id}
                          onClick={() => {
                            onSelectLesson(id);
                            onClose();
                          }}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 cursor-pointer text-xs transition"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-slate-300 font-medium">{lesson.title}</span>
                          </div>
                          <ExternalLink className="w-3 h-3 text-slate-500" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeProfileTab === 'notes' && (
            <div className="space-y-3">
              {notesEntries.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-slate-700" />
                  <p>Henüz herhangi bir derse kişisel çalışma notu eklemediniz.</p>
                  <p className="text-slate-600 mt-1">Derslerin altındaki "Kişisel Ders Notum" kutusundan not ekleyebilirsiniz.</p>
                </div>
              ) : (
                notesEntries.map(([lessonId, noteText]) => {
                  const lesson = allLessons.find(l => l.id === lessonId);
                  return (
                    <div
                      key={lessonId}
                      className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => {
                            onSelectLesson(lessonId);
                            onClose();
                          }}
                          className="font-bold text-xs text-indigo-400 hover:underline flex items-center gap-1.5"
                        >
                          <span>{lesson ? lesson.title : lessonId}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 whitespace-pre-wrap">
                        {noteText}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeProfileTab === 'badges' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {QUIZZES.map(q => {
                const score = quizScores[q.id];
                const isEarned = score && score.percentage >= 70;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border flex items-center gap-3 transition ${
                      isEarned
                        ? 'bg-slate-950 border-amber-500/40 text-amber-300'
                        : 'bg-slate-950/40 border-slate-800/60 opacity-40 text-slate-500'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shrink-0">
                      {isEarned ? '🏆' : '🔒'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{q.badgeTitle}</div>
                      <div className="text-[11px] text-slate-400">
                        {isEarned ? `%${score.percentage} başarıyla kazanıldı` : 'Kazanmak için quizi %70 ile geçin'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Çıkış Yap Butonu */}
        <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
          <div className="text-[11px] text-slate-500">
            Verileriniz Cloud Firestore üzerinde sadece size özel olarak saklanır.
          </div>
          <button
            onClick={async () => {
              await handleLogout();
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>
    </div>
  );
}
