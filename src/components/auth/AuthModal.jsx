import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  School, 
  LogIn, 
  UserPlus, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

export default function AuthModal({ isOpen, onClose }) {
  const { 
    handleLogin, 
    handleRegister, 
    handleGoogleLogin, 
    handleResetPassword, 
    isCloudEnabled 
  } = useProgress();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [university, setUniversity] = useState('Dijital Oyun Tasarımı');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const onTabChange = (tab) => {
    setActiveTab(tab);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (activeTab === 'login') {
        await handleLogin(email, password);
        onClose();
      } else if (activeTab === 'register') {
        if (!displayName.trim()) {
          throw new Error('Lütfen adınızı ve soyadınızı girin.');
        }
        if (password.length < 6) {
          throw new Error('Şifreniz en az 6 karakter olmalıdır.');
        }
        await handleRegister(email, password, displayName, university);
        onClose();
      } else if (activeTab === 'forgot') {
        await handleResetPassword(email);
        setSuccessMsg('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
      }
    } catch (err) {
      console.error(err);
      let msg = err.message || 'Bir hata oluştu.';
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password') || msg.includes('auth/user-not-found')) {
        msg = 'E-posta veya şifre hatalı.';
      } else if (msg.includes('auth/email-already-in-use')) {
        msg = 'Bu e-posta adresiyle kayıtlı bir hesap zaten var.';
      } else if (msg.includes('auth/weak-password')) {
        msg = 'Şifre çok zayıf. Lütfen en az 6 karakter girin.';
      } else if (msg.includes('auth/invalid-email')) {
        msg = 'Geçersiz e-posta formatı.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await handleGoogleLogin();
      onClose();
    } catch (err) {
      console.error(err);
      if (!err.message?.includes('popup-closed-by-user')) {
        setErrorMsg('Google ile giriş yapılırken bir sorun oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Kapat Butonu */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Başlık */}
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>LudusProg Öğrenci Portalı</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {activeTab === 'login' && 'Hesabınıza Giriş Yapın'}
            {activeTab === 'register' && 'Yeni Öğrenci Hesabı Oluştur'}
            {activeTab === 'forgot' && 'Şifrenizi Sıfırlayın'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {activeTab === 'login' && 'Ders ilerlemenizi, quiz skorlarınızı ve özel ders notlarınızı senkronize edin.'}
            {activeTab === 'register' && 'Ücretsiz hesap oluşturarak öğrenme yolculuğunuzu tüm cihazlarınızdan takip edin.'}
            {activeTab === 'forgot' && 'Kayıtlı e-posta adresinizi girin, sıfırlama linki gönderelim.'}
          </p>
        </div>

        {/* Firebase Yapılandırma Uyarısı (Eğer .env henüz eklenmediyse) */}
        {!isCloudEnabled && (
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Info className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Firebase Yapılandırması Bekleniyor</span>
            </div>
            <p className="text-[11px] text-amber-200/80 leading-relaxed">
              Çoklu kullanıcı bulut senkronizasyonu için <code className="bg-slate-950 px-1 rounded text-amber-300">.env</code> dosyasına Firebase anahtarlarınızı ekleyin. Şu anda sistem yerel misafir modunda çalışmaktadır.
            </p>
          </div>
        )}

        {/* Sekmeler (Giriş / Kayıt) */}
        {activeTab !== 'forgot' && (
          <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => onTabChange('login')}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                activeTab === 'login'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => onTabChange('register')}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                activeTab === 'register'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Kayıt Ol
            </button>
          </div>
        )}

        {/* Hata ve Başarı Bildirimleri */}
        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Google ile Hızlı Giriş Butonu */}
        {activeTab !== 'forgot' && isCloudEnabled && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={onGoogleSignIn}
              disabled={loading}
              className="w-full bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-3 transition shadow"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google Hesabı ile Giriş Yap</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full"></div>
              <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                veya e-posta ile
              </span>
            </div>
          </div>
        )}

        {/* E-posta Formu */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {activeTab === 'register' && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Ad Soyad
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Adınız Soyadınız"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Üniversite / Bölüm
                </label>
                <div className="relative">
                  <School className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Örn: Dijital Oyun Tasarımı, 2. Sınıf"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              E-posta Adresi
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                placeholder="ogrenci@universite.edu.tr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {activeTab !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-300">
                  Şifre
                </label>
                {activeTab === 'login' && (
                  <button
                    type="button"
                    onClick={() => onTabChange('forgot')}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 transition"
                  >
                    Şifremi unuttum?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/25"
          >
            {loading ? (
              <span>İşleniyor...</span>
            ) : (
              <>
                {activeTab === 'login' && (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Giriş Yap</span>
                  </>
                )}
                {activeTab === 'register' && (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Hesap Oluştur</span>
                  </>
                )}
                {activeTab === 'forgot' && (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Sıfırlama Linki Gönder</span>
                  </>
                )}
              </>
            )}
          </button>
        </form>

        {/* Şifremi Unuttum'dan Geri Dön */}
        {activeTab === 'forgot' && (
          <div className="text-center pt-2">
            <button
              onClick={() => onTabChange('login')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Giriş Ekranına Dön
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
