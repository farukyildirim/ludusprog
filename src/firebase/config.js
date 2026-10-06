// Firebase Configuration & Services
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';

// Environment variables from Vite (VITE_ prefix required)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

// Check if actual configuration exists
export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.apiKey !== "your_api_key_here"
  );
};

// Initialize Firebase only if configured or fallback
let app;
let auth;
let db;

try {
  if (isFirebaseConfigured()) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (error) {
  console.warn("Firebase initialization warning:", error.message);
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { app, auth, db, googleProvider };

// ==========================================
// AUTHENTICATION HELPER METHODS
// ==========================================

// Register with Email and Password
export async function registerWithEmail(email, password, displayName, university = "") {
  if (!auth) throw new Error("Firebase henüz yapılandırılmadı. Lütfen .env dosyanızı veya Firebase ayarlarınızı kontrol edin.");
  
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Profil adını güncelle
  await updateProfile(user, { displayName });

  // Firestore'da kullanıcı dökümanını oluştur
  if (db) {
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName: displayName || user.email.split('@')[0],
      university: university || "Dijital Oyun Tasarımı",
      role: 'student',
      completedLessons: [],
      quizScores: {},
      bookmarkedLessons: [],
      activeEngine: 'unity',
      notes: {},
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  return user;
}

// Login with Email and Password
export async function loginWithEmail(email, password) {
  if (!auth) throw new Error("Firebase yapılandırması eksik.");
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

// Login with Google Popup
export async function loginWithGoogle() {
  if (!auth) throw new Error("Firebase yapılandırması eksik.");
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Eğer ilk girişi ise Firestore dökümanını kontrol et ve oluştur
  if (db) {
    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL || "",
        university: "Dijital Oyun Tasarımı",
        role: 'student',
        completedLessons: [],
        quizScores: {},
        bookmarkedLessons: [],
        activeEngine: 'unity',
        notes: {},
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  }

  return user;
}

// Logout
export async function logoutUser() {
  if (!auth) return;
  await signOut(auth);
}

// Password Reset Email
export async function resetPasswordEmail(email) {
  if (!auth) throw new Error("Firebase yapılandırması eksik.");
  await sendPasswordResetEmail(auth, email);
}

// ==========================================
// FIRESTORE USER DATA HELPER METHODS
// ==========================================

// Get user profile data
export async function fetchUserData(uid) {
  if (!db) return null;
  const userDocRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userDocRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
}

// Update user progress data in Firestore
export async function syncUserProgress(uid, data) {
  if (!db) return;
  const userDocRef = doc(db, 'users', uid);
  await setDoc(userDocRef, {
    ...data,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

// Real-time listener for user data
export function listenToUserData(uid, callback) {
  if (!db) return () => {};
  const userDocRef = doc(db, 'users', uid);
  return onSnapshot(userDocRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    }
  }, (err) => {
    console.warn("Firestore subscription error:", err.message);
  });
}
