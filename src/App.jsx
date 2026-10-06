import React, { useState } from 'react';
import { ProgressProvider } from './context/ProgressContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LessonView from './components/LessonView';
import LabsHub from './components/LabsHub';
import RoadmapView from './components/RoadmapView';
import QuizSection from './components/QuizSection';
import StarterPackSection from './components/StarterPackSection';
import GlossarySection from './components/GlossarySection';
import AuthModal from './components/auth/AuthModal';
import UserProfileModal from './components/auth/UserProfileModal';
import { getLessonById, CURRICULUM } from './data/curriculumData';

function PortalContent() {
  const [activeTab, setActiveTab] = useState('lessons'); // 'lessons' | 'labs' | 'roadmap' | 'quizzes' | 'starterpacks' | 'glossary'
  const [selectedLessonId, setSelectedLessonId] = useState('l1-game-loop');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const selectedLesson = getLessonById(selectedLessonId) || CURRICULUM[0].lessons[0];

  const handleSelectLesson = (lessonId) => {
    setSelectedLessonId(lessonId);
    setActiveTab('lessons');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Üst Gezinti Çubuğu */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Ana İçerik Alanı */}
      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'lessons' && (
          <div className="flex-1 flex w-full">
            {/* Sol Kenar Çubuğu */}
            <Sidebar
              selectedLessonId={selectedLessonId}
              onSelectLesson={handleSelectLesson}
            />

            {/* Sağ Ders Detayı */}
            <LessonView
              lesson={selectedLesson}
              onSelectLesson={handleSelectLesson}
            />
          </div>
        )}

        {activeTab === 'labs' && (
          <div className="flex-1 overflow-y-auto">
            <LabsHub />
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="flex-1 overflow-y-auto">
            <RoadmapView
              onSelectLesson={handleSelectLesson}
            />
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="flex-1 overflow-y-auto">
            <QuizSection />
          </div>
        )}

        {activeTab === 'starterpacks' && (
          <div className="flex-1 overflow-y-auto">
            <StarterPackSection />
          </div>
        )}

        {activeTab === 'glossary' && (
          <div className="flex-1 overflow-y-auto">
            <GlossarySection />
          </div>
        )}
      </main>

      {/* Kimlik Doğrulama Modalı */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Kullanıcı Profili & Notlar Modalı */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSelectLesson={handleSelectLesson}
      />

      {/* Alt Bilgi Çubuğu (Footer) */}
      <footer className="bg-slate-950 border-t border-slate-900 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="text-slate-400">LudusProg</strong> — Dijital Oyun Tasarımı (DOT) Oyun Programlama Eğitim Portalı
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Unity • Godot • Unreal • Roblox</span>
            <span>|</span>
            <span>Çoklu Kullanıcı Bulut Modu</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <PortalContent />
    </ProgressProvider>
  );
}
