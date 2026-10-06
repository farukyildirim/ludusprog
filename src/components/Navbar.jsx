import React from 'react';
import { Gamepad2, Compass, Map, Award, FolderArchive, BookOpen, Layers, CheckCircle2, User } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { getAllLessons } from '../data/curriculumData';

export default function Navbar({ activeTab, setActiveTab, onOpenSearch, onOpenAuth, onOpenProfile }) {
  const { completedLessons, activeEngine, setActiveEngine, currentUser } = useProgress();
  const allLessons = getAllLessons();
  const progressPercent = Math.round((completedLessons.length / allLessons.length) * 100);

  const navItems = [
    { id: 'lessons', label: 'Dersler', icon: BookOpen },
    { id: 'labs', label: 'Laboratuvarlar', icon: Compass },
    { id: 'roadmap', label: 'Yol Haritası', icon: Map },
    { id: 'quizzes', label: 'Quiz & Sınav', icon: Award },
    { id: 'starterpacks', label: 'Starter Kits & Roblox', icon: FolderArchive },
    { id: 'glossary', label: 'Sözlük', icon: Layers }
  ];

  const engines = [
    { id: 'unity', name: 'Unity (C#)' },
    { id: 'godot', name: 'Godot (GDScript)' },
    { id: 'unreal', name: 'Unreal (C++/BP)' },
    { id: 'roblox', name: 'Roblox (Luau)' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Başlık */}
          <div 
            onClick={() => setActiveTab('lessons')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                  LudusProg
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  DOT
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Dijital Oyun Tasarımı Oyun Programlama Portalı
              </p>
            </div>
          </div>

          {/* Ana Menü Sekmeleri */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Sağ Alan: Motor Seçici & İlerleme Çubuğu */}
          <div className="flex items-center gap-3">
            {/* Tercih Edilen Motor Seçici */}
            <div className="hidden lg:flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800 text-[11px]">
              {engines.map(engine => (
                <button
                  key={engine.id}
                  onClick={() => setActiveEngine(engine.id)}
                  className={`px-2.5 py-1 rounded-lg transition font-medium ${
                    activeEngine === engine.id
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {engine.name.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* İlerleme Rozeti */}
            <div 
              onClick={() => setActiveTab('roadmap')}
              className="hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-800 cursor-pointer transition"
              title="İlerlemenizi Görüntüleyin"
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <CheckCircle2 className={`w-4 h-4 ${progressPercent === 100 ? 'text-emerald-400' : 'text-indigo-400'}`} />
              </div>
              <div className="text-left text-xs">
                <div className="text-[10px] text-slate-400">İlerleme</div>
                <div className="font-bold text-white font-mono leading-none">
                  %{progressPercent}
                </div>
              </div>
            </div>

            {/* Kullanıcı / Kimlik Giriş Alanı */}
            {currentUser ? (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800/80 pl-2 pr-3 py-1.5 rounded-xl border border-slate-800 transition group"
                title="Profil & Notlarım"
              >
                <div className="relative w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'Ö'}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-950"></span>
                </div>
                <span className="text-xs font-semibold text-slate-200 hidden md:inline truncate max-w-[100px]">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3 py-1.5 rounded-xl text-xs transition shadow-lg shadow-indigo-600/20"
              >
                <User className="w-3.5 h-3.5" />
                <span>Giriş Yap</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobil Alt Menü */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-900 scrollbar-none">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium transition ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
