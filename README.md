# 🎮 LudusProg — Dijital Oyun Tasarımı Oyun Programlama Eğitim Portalı

Dijital Oyun Tasarımı (DOT) lisans ve önlisans öğrencileri için sıfırdan ileri seviyeye, teknik oyun tasarımı (Technical Game Design) odaklı interaktif eğitim platformu.

---

## 🚀 Hızlı Başlangıç

Geliştirme sunucusunu çalıştırmak için:

```bash
# 1. Bağımlılıkları yükleyin (İlk sefer için)
npm install

# 2. Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda açın: **[http://localhost:5173](http://localhost:5173)**

Üretim (Production) derlemesi almak için:
```bash
npm run build
```

---

## 🎯 Portaldaki Temel Bölümler ve Özellikler

### 1. Kapsamlı Müfredat & Çoklu Motor Kod Karşılaştırması
Müfredat 4 ana sütun altında toplanmıştır:
- **Seviye 1: Temel Düzey (Oyun Programlama Temelleri)**
  - Oyun Döngüsü & Zaman Kavramı (`Game Loop & Delta Time`)
  - Oyun Matematiği: Vektörler, Yön & Trigonometri (`Dot Product, FOV, Lerp`)
  - Fizik, Çarpışma Tespiti & Raycasting (`AABB, Trigger vs Collision, Hitscan`)
  - Girdi Sistemleri & Oyuncu Etkileşimi (`Action Mapping, Deadzone, Buffer`)
- **Seviye 2: Orta Düzey (Mekanikler, Durum & Sistemler)**
  - Karakter Kontrolcüleri (`Platformer 2D/3D, Coyote Time, Jump Buffering`)
  - Durum Makineleri (`Finite State Machine - FSM, State Pattern`)
  - Teknik Oyun Tasarımı: *Game Feel* & Juice (`Screen Shake, Hit Stop, Squash & Stretch`)
  - Veri Yönetimi, Envanter & ScriptableObjects (`Data-Driven Design, JSON`)
  - Olay Tabanlı UI & HUD Programlama (`Observer Pattern, Signals/Events`)
- **Seviye 3: İleri Düzey (Mimari, AI & Optimizasyon)**
  - Oyun Tasarım Kalıpları (`Object Pooling, Command Pattern, Event Bus`)
  - Oyun Yapay Zekası: Navigasyon & Karar Ağaçları (`A* Pathfinding, NavMesh, Behavior Trees`)
  - Çok Oyunculu (Multiplayer) & Ağ Temelleri (`Authoritative Server, RPC, Replication`)
  - Performans, Profiling & Optimizasyon (`Draw Calls, Batching, GC Alloc, LOD`)
  - Shader & Görsel Programlama Temelleri (`Vertex/Fragment Pipeline, Dissolve, UV Scroll`)
- **Seviye 4: Teknik Oyun Tasarımı & Prototipleme**
  - Hızlı Prototipleme & Greyboxing Metodolojileri (`Fail Fast, Core Loop`)
  - Tasarım Dokümanından (GDD) Koda Dönüşüm (`Mekanik Ayrıştırma`)

Tüm derslerde kod örnekleri **Unity (C#)**, **Godot 4 (GDScript)**, **Unreal Engine (C++/BP)** ve **Roblox (Luau)** sekmeleriyle sunulur.

---

### 2. İnteraktif Görsel Simülatörler & Laboratuvarlar
- 🧭 **Vektör & Görüş Açısı (FOV) Lab:** Fare ile sürüklenebilir hedef ve oyuncu, canlı Dot Product, normalize yön, mesafe ve görüş açısı hesaplama.
- ✨ **Game Feel & 'Juice' Simülatörü:** Aynı vuruş mekaniğini ham/donuk kod ile; ekran sarsıntısı, 60ms hit stop, squash & stretch, partikül patlaması, dinamik Web Audio sesi ve yüzen hasar metinleriyle karşılaştırma.
- ⚙️ **FSM (Durum Makinesi) Simülatörü:** Karakter durumları (IDLE, RUN, JUMP, FALL, ATTACK), canlı durum düğüm ışımaları ve çalışan kod blokları.
- ⏱️ **Kare Hızı & Delta Time Simülatörü:** FPS dalgalanmalarında Delta Time kullanan ile kullanmayan iki yarışçının gerçek zamanlı hız farkı.

---

### 3. Starter Kits & Roblox Kütüphanesi
Proje klasöründeki hazır mekanik şablonları:
- **Obby (Engel Parkuru):** `CheckpointModule`, `LavaKill`, `StageUI`
- **Tycoon (Fabrika / Ekonomi):** `DropperModule`, `Collector`
- **Korku & Canavar AI:** `MonsterAI` (PathfindingService), `Jumpscare`
- **FPS Silahı:** Raycast ve hasar sistemi
- **Kurumsal İskeletler:** Unity `GameManager` & `EventBus`, Godot 4 `HealthComponent`
- Portal üzerinden doğrudan **Roblox_Starter_Pack.zip** indirme desteği (`public/downloads/`).

---

### 4. Öğrenci İlerleme Takip Sistemi & Sınavlar
- **Sınavlar:** Her seviye için açıklamalı çoktan seçmeli test soruları ve rozet ödülleri (Konfeti kutlamasıyla birlikte).
- **Yerel Hafıza:** Tamamlanan dersler, kaydedilen içerikler ve sınav skorları `localStorage` üzerinde öğrencinin cihazında kalıcı olarak saklanır.
- **Sözlük:** 30'dan fazla oyun geliştirme ve teknik tasarım terimini anlık arama ve kategori filtreleriyle sunar.
