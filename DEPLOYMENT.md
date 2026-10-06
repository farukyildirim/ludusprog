# 🚀 LudusProg Çoklu Kullanıcı & Yayınlama (Deployment) Rehberi

Bu rehber, **LudusProg Oyun Programlama Portalı**'nı çoklu kullanıcı (multi-user) modunda **Vercel** veya **Netlify** üzerinde tamamen ücretsiz olarak nasıl canlıya alacağınızı ve her öğrencinin yalnızca kendi verilerini görmesini nasıl sağlayacağınızı adım adım anlatır.

---

## 🔒 Çoklu Kullanıcı Veri İzolasyonu Nasıl Çalışır?

1. **Kimlik Doğrulama (Firebase Auth):**
   - Her öğrenci kendi e-posta adresiyle veya tek tıkla **Google Hesabı** ile kayıt olur ve giriş yapar.
   - Her kullanıcıya benzersiz bir kimlik anahtarı (**`UID`**) atanır.

2. **Veritabanı İzolasyonu (Cloud Firestore):**
   - Her öğrencinin verisi Firestore içinde `users/{userId}` dökümanında saklanır:
     - `completedLessons`: Tamamladığı derslerin listesi
     - `quizScores`: Sınav sonuçları ve rozetleri
     - `bookmarkedLessons`: Kaydettiği dersler
     - `notes`: Derslere özel aldığı kişisel çalışma notları
     - `activeEngine`: Tercih ettiği oyun motoru (Unity, Godot, Unreal, Roblox)

3. **Katı Güvenlik Kuralları (`firestore.rules`):**
   - Projenizdeki [`firestore.rules`](./firestore.rules) dosyası, kullanıcıların birbirlerinin verilerini okumasını veya değiştirmesini kesin olarak engeller:
   ```javascript
   match /users/{userId} {
     // Yalnızca kimliği doğrulanmış döküman sahibi okuyabilir ve yazabilir
     allow read, write: if request.auth != null && request.auth.uid == userId;
   }
   ```
   *Öğrenci A, Öğrenci B'nin sınav notunu veya çalışma notlarını asla göremez.*

---

## 🛠️ Adım 1: Ücretsiz Firebase Projesi Oluşturma (3 Dakika)

1. [Firebase Console](https://console.firebase.google.com/) adresine gidin ve Google hesabınızla giriş yapın.
2. **"Proje Ekle" (Add Project)** butonuna tıklayın:
   - Proje adı girin (Örn: `ludusprog-portal`).
   - Google Analytics'i isteğe bağlı olarak açabilir veya geçebilirsiniz.
3. **Authentication (Kimlik Doğrulama) Açma:**
   - Sol menüden **Build > Authentication** seçeneğine tıklayın.
   - **"Get Started"** butonuna basın.
   - **Sign-in method** sekmesinden:
     - **Email/Password** -> Etkinleştirin (Enable).
     - **Google** -> Etkinleştirin (Destek e-postanızı seçip kaydedin).
4. **Cloud Firestore Veritabanını Açma:**
   - Sol menüden **Build > Firestore Database** seçeneğine tıklayın.
   - **"Create database"** butonuna basın.
   - Konum olarak en yakın bölgeyi (örn: `eur3 - europe-west` veya `nam5`) seçin.
   - Güvenlik kuralı başlangıcı için varsayılanı seçip tamamlayın.
5. **Güvenlik Kurallarını Yükleme:**
   - Firestore içinde **"Rules" (Kurallar)** sekmesine tıklayın.
   - Projenizdeki [`firestore.rules`](./firestore.rules) dosyasının içeriğini kopyalayıp buraya yapıştırın ve **"Publish" (Yayınla)** butonuna basın.
6. **Web Uygulama Anahtarlarını Alma:**
   - Sol üstteki **Proje Ayarları (Project Settings - Dişli Çark)** simgesine tıklayın.
   - **"Your apps"** bölümünde **Web (</>)** simgesine tıklayın.
   - Uygulama adı verin (örn: `ludusprog-web`) ve kaydedin.
   - Ekrana gelen `firebaseConfig` değerlerini bir kenara kopyalayın:
     ```javascript
     const firebaseConfig = {
       apiKey: "AIzaSy...",
       authDomain: "ludusprog-portal.firebaseapp.com",
       projectId: "ludusprog-portal",
       storageBucket: "ludusprog-portal.appspot.com",
       messagingSenderId: "123456789",
       appId: "1:123456789:web:abcdef"
     };
     ```

---

## 💻 Adım 2: Yerel Ortamda Test Etme

1. Proje kök dizininde `.env` dosyasını oluşturun (veya `.env.example` dosyasını kopyalayın):
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=ludusprog-portal.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=ludusprog-portal
   VITE_FIREBASE_STORAGE_BUCKET=ludusprog-portal.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```
2. Geliştirme sunucusunu yeniden başlatın:
   ```bash
   npm run dev
   ```
3. İki farklı tarayıcı penceresinde (biri normal pencere, diğeri Gizli Pencere / Incognito) `http://localhost:5173` adresini açın.
   - 1. Pencerede: Öğrenci A olarak kayıt olun ve 2 dersi tamamlayın.
   - 2. Pencerede: Öğrenci B olarak kayıt olun.
   - *Öğrenci B'nin ekranında Öğrenci A'nın tamamladığı derslerin görünmediğini ve verilerin tamamen izole olduğunu göreceksiniz!*

---

## 🌐 Adım 3: Vercel Üzerinde Yayınlama (Önerilen - Ücretsiz)

Vercel, otomatik HTTPS sertifikası, küresel CDN ve sıfır sunucu maliyetiyle en hızlı dağıtım seçeneğidir.

### Yöntem A: GitHub ile Otomatik Dağıtım (En Kolay)
1. Kodlarınızı bir GitHub deposuna yükleyin:
   ```bash
   git init
   git add .
   git commit -m "LudusProg Multi-User Education Portal"
   git branch -M main
   git remote add origin https://github.com/KULLANICI_ADINIZ/ludusprog.git
   git push -u origin main
   ```
2. [Vercel](https://vercel.com) adresine gidip GitHub hesabınızla giriş yapın.
3. **"Add New Project"** butonuna tıklayın ve `ludusprog` deponuzu seçin.
4. **Environment Variables (Ortam Değişkenleri)** bölümüne Firebase anahtarlarınızı ekleyin:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
5. **"Deploy"** butonuna basın!
   - 1 dakika içinde `https://ludusprog.vercel.app` gibi canlı bir bağlantı alacaksınız.
   - Projedeki [`vercel.json`](./vercel.json) dosyası tüm sayfa yönlendirmelerini otomatik olarak yönetecektir.

### Yöntem B: Vercel CLI ile Komut Satırından Dağıtım
```bash
# Vercel CLI aracını çalıştırın
npx vercel

# Üretim ortamına dağıtmak için:
npx vercel --prod
```

---

## 🌐 Alternatif: Netlify Üzerinde Yayınlama

1. [Netlify](https://www.netlify.com) adresine gidin.
2. **"Add new site" > "Import an existing project"** adımıyla GitHub deponuzu bağlayın.
3. Build Settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. **Site configuration > Environment variables** bölümünden Firebase değişkenlerini tanımlayın.
5. **"Deploy site"** butonuna basın. Projedeki [`public/_redirects`](./public/_redirects) dosyası Netlify SPA yönlendirmesini otomatik sağlayacaktır.

---

## 📌 Google Girişini Canlı Domainde Etkinleştirme (Önemli Not)

Vercel veya Netlify üzerinde sitenizi yayınladıktan sonra (`https://siteniz.vercel.app`), Google ile Giriş özelliğinin çalışabilmesi için domaininizi Firebase'e tanıtmanız gerekir:

1. [Firebase Console](https://console.firebase.google.com/) > Projeniz > **Authentication** > **Settings** sekmesine gidin.
2. **Authorized domains (Yetkili Alan Adları)** tablosuna tıklayın.
3. **"Add domain"** butonuna basarak sitenizin adresini (örn: `ludusprog.vercel.app`) protokol olmadan ekleyin (`https://` olmadan, yalnızca `ludusprog.vercel.app`).
4. Artık tüm öğrenciler canlı sitede Google ile anında oturum açabilir!
