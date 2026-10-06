import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  isFirebaseConfigured, 
  loginWithEmail, 
  registerWithEmail, 
  loginWithGoogle, 
  logoutUser, 
  resetPasswordEmail,
  fetchUserData, 
  syncUserProgress, 
  listenToUserData 
} from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [syncStatus, setSyncStatus] = useState('local'); // 'local' | 'syncing' | 'synced' | 'error'
  const isCloudEnabled = isFirebaseConfigured();

  // Local storage state (used as initial values & fallback for guests)
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem('ludusprog_completed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [quizScores, setQuizScores] = useState(() => {
    try {
      const saved = localStorage.getItem('ludusprog_quizzes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeEngine, setActiveEngine] = useState(() => {
    try {
      return localStorage.getItem('ludusprog_engine') || 'unity';
    } catch {
      return 'unity';
    }
  });

  const [bookmarkedLessons, setBookmarkedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem('ludusprog_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [lessonNotes, setLessonNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('ludusprog_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Listen to Firebase Auth state
  useEffect(() => {
    if (!auth) {
      setLoadingAuth(false);
      return;
    }

    let unsubscribeSnapshot = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoadingAuth(false);

      if (user) {
        setSyncStatus('syncing');
        // Fetch or listen to Firestore user document
        unsubscribeSnapshot = listenToUserData(user.uid, (data) => {
          if (data) {
            setUserProfile(data);
            if (data.completedLessons) setCompletedLessons(data.completedLessons);
            if (data.quizScores) setQuizScores(data.quizScores);
            if (data.bookmarkedLessons) setBookmarkedLessons(data.bookmarkedLessons);
            if (data.activeEngine) setActiveEngine(data.activeEngine);
            if (data.notes) setLessonNotes(data.notes);
            setSyncStatus('synced');
          }
        });
      } else {
        setUserProfile(null);
        setSyncStatus('local');
        if (unsubscribeSnapshot) {
          unsubscribeSnapshot();
          unsubscribeSnapshot = null;
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('ludusprog_completed', JSON.stringify(completedLessons));
    localStorage.setItem('ludusprog_quizzes', JSON.stringify(quizScores));
    localStorage.setItem('ludusprog_engine', activeEngine);
    localStorage.setItem('ludusprog_bookmarks', JSON.stringify(bookmarkedLessons));
    localStorage.setItem('ludusprog_notes', JSON.stringify(lessonNotes));
  }, [completedLessons, quizScores, activeEngine, bookmarkedLessons, lessonNotes]);

  // Helper to sync to Cloud Firestore if logged in
  const syncToCloud = async (overrideData = {}) => {
    if (currentUser) {
      setSyncStatus('syncing');
      try {
        await syncUserProgress(currentUser.uid, {
          completedLessons,
          quizScores,
          bookmarkedLessons,
          activeEngine,
          notes: lessonNotes,
          ...overrideData
        });
        setSyncStatus('synced');
      } catch (err) {
        console.error("Cloud sync error:", err);
        setSyncStatus('error');
      }
    }
  };

  const toggleLessonComplete = (lessonId) => {
    const updated = completedLessons.includes(lessonId)
      ? completedLessons.filter(id => id !== lessonId)
      : [...completedLessons, lessonId];
    
    setCompletedLessons(updated);
    syncToCloud({ completedLessons: updated });
  };

  const toggleBookmark = (lessonId) => {
    const updated = bookmarkedLessons.includes(lessonId)
      ? bookmarkedLessons.filter(id => id !== lessonId)
      : [...bookmarkedLessons, lessonId];
    
    setBookmarkedLessons(updated);
    syncToCloud({ bookmarkedLessons: updated });
  };

  const recordQuizScore = (quizId, score, total) => {
    const updated = {
      ...quizScores,
      [quizId]: { 
        score, 
        total, 
        percentage: Math.round((score / total) * 100), 
        timestamp: Date.now() 
      }
    };
    setQuizScores(updated);
    syncToCloud({ quizScores: updated });
  };

  const updateEngine = (engineId) => {
    setActiveEngine(engineId);
    syncToCloud({ activeEngine: engineId });
  };

  const saveLessonNote = (lessonId, noteText) => {
    const updated = {
      ...lessonNotes,
      [lessonId]: noteText
    };
    setLessonNotes(updated);
    syncToCloud({ notes: updated });
  };

  const resetProgress = () => {
    if (window.confirm('Tüm eğitim ilerlemenizi ve quiz puanlarınızı sıfırlamak istediğinize emin misiniz?')) {
      setCompletedLessons([]);
      setQuizScores({});
      setBookmarkedLessons([]);
      setLessonNotes({});
      syncToCloud({
        completedLessons: [],
        quizScores: {},
        bookmarkedLessons: [],
        notes: {}
      });
    }
  };

  // Auth Operations
  const handleRegister = async (email, password, displayName, university) => {
    const user = await registerWithEmail(email, password, displayName, university);
    return user;
  };

  const handleLogin = async (email, password) => {
    const user = await loginWithEmail(email, password);
    return user;
  };

  const handleGoogleLogin = async () => {
    const user = await loginWithGoogle();
    return user;
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  const handleResetPassword = async (email) => {
    await resetPasswordEmail(email);
  };

  return (
    <ProgressContext.Provider value={{
      currentUser,
      userProfile,
      loadingAuth,
      syncStatus,
      isCloudEnabled,
      completedLessons,
      toggleLessonComplete,
      quizScores,
      recordQuizScore,
      activeEngine,
      setActiveEngine: updateEngine,
      bookmarkedLessons,
      toggleBookmark,
      lessonNotes,
      saveLessonNote,
      resetProgress,
      handleRegister,
      handleLogin,
      handleGoogleLogin,
      handleLogout,
      handleResetPassword
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
