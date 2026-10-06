// Game Programming & Technical Game Design Glossary

export const GLOSSARY_TERMS = [
  {
    term: "Delta Time (Δt)",
    category: "Temel & Zaman",
    definition: "İki ardışık görsel kare (frame) arasında geçen süredir. Hareketi ve fiziği oyuncunun FPS değerinden bağımsız kılmak için kullanılır."
  },
  {
    term: "FixedUpdate",
    category: "Temel & Fizik",
    definition: "Ekran kartının render hızından bağımsız olarak, sabit zaman aralıklarında (genelde 50Hz/0.02s) çalışan fizik hesaplama döngüsü."
  },
  {
    term: "Lerp (Linear Interpolation)",
    category: "Matematik",
    definition: "A ve B noktaları arasında t [0-1] oranına göre doğrusal geçiş yapma formülü. Pürüzsüz kamera takibi ve arayüz animasyonlarının temelidir."
  },
  {
    term: "Dot Product (Noktasal Çarpım)",
    category: "Matematik",
    definition: "İki vektörün birbiriyle hizalanma derecesini (-1 ile 1 arasında) veren çarpım türü. Düşman görüş açısı (FOV) ve aydınlatma hesaplarında kullanılır."
  },
  {
    term: "Cross Product (Vektörel Çarpım)",
    category: "Matematik",
    definition: "İki vektöre birden tam dik (90 derece) olan üçüncü bir vektör üretir. Yüzey normali ve 3D dönüş hesaplamalarında kullanılır."
  },
  {
    term: "Raycast",
    category: "Fizik",
    definition: "Belirli bir noktadan belirli bir yöne doğru gönderilen sanal ışın. Çarptığı ilk objenin mesafesini, yüzey normalini ve collider bilgisini döner."
  },
  {
    term: "AABB (Axis-Aligned Bounding Box)",
    category: "Fizik",
    definition: "Eksenlere paralel, döndürülmeyen en basit kutu çarpışma hacmi. Fizik motorlarının en hızlı çarpışma eleme yöntemidir."
  },
  {
    term: "Coyote Time",
    category: "Game Feel",
    definition: "Karakter platform kenarından boşluğa düştükten sonraki 100-150 milisaniye boyunca oyuncuya zıplama hakkı tanıyan tasarım toleransı."
  },
  {
    term: "Jump Buffering",
    category: "Game Feel",
    definition: "Oyuncu yere inmeden hemen önce zıplama tuşuna bastığında bu komutun hafızaya alınıp iniş anında otomatik uygulanması."
  },
  {
    term: "Hit Stop / Sleep Frame",
    category: "Game Feel",
    definition: "Darbe veya kritik vuruş anında oyunun birkaç kare dondurulması. Darbenin ağırlığını hissettiren en etkili Juice tekniğidir."
  },
  {
    term: "Screen Shake",
    category: "Game Feel",
    definition: "Patlama, kaza veya vuruş anlarında kameraya uygulanan sönümlü rastgele titreşim hareketi."
  },
  {
    term: "Squash & Stretch",
    category: "Game Feel & Animasyon",
    definition: "Disney animasyon prensiplerinden biri olan, hızlanan objenin uzaması ve yere/engellere çarpan objenin basıklaşarak esnemesi."
  },
  {
    term: "FSM (Finite State Machine)",
    category: "Mimari",
    definition: "Bir karakter veya sistemin belirli durumlardan (Idle, Run, Jump, Attack) yalnızca birinde bulunması ve geçiş kurallarıyla yönetilmesi mimarisi."
  },
  {
    term: "Object Pooling",
    category: "Optimizasyon & Mimari",
    definition: "Sık yaratılıp yok edilen mermi ve partiküllerin önceden üretilip bir havuzda tutulması, böylece Garbage Collection takılmalarının sıfırlanması."
  },
  {
    term: "Observer Pattern (Event Bus)",
    category: "Mimari",
    definition: "Sistemlerin (örneğin Oyuncu ile Can Barı) birbirine sıkı sıkıya bağlanmadan olaylar (Events / Signals) üzerinden haberleşmesi kalıbı."
  },
  {
    term: "NavMesh (Navigasyon Ağı)",
    category: "Yapay Zeka",
    definition: "3D veya 2D oyun dünyasındaki yürünebilir zeminlerin taranarak yapay zeka ajanlarının rota hesaplayabileceği poligonlara dönüştürülmesi."
  },
  {
    term: "A* (A-Star) Algoritması",
    category: "Yapay Zeka",
    definition: "Bir harita üzerinde iki nokta arasındaki en kısa ve en az maliyetli yolu sezgisel (heuristic) olarak bulan popüler yol bulma algoritması."
  },
  {
    term: "Behavior Tree (Davranış Ağacı)",
    category: "Yapay Zeka",
    definition: "AAA oyunlarda NPC ve düşmanların karmaşık karar mekanizmalarını (Selector, Sequence, Decorator) düğümleriyle modelleyen hiyerarşik ağaç."
  },
  {
    term: "Authoritative Server",
    category: "Multiplayer",
    definition: "Oyun dünyasındaki tüm kritik kuralların, hareketlerin ve hasarların doğruluğuna tek başına karar veren güvenilir sunucu yaklaşımı."
  },
  {
    term: "RPC (Remote Procedure Call)",
    category: "Multiplayer",
    definition: "Bir cihazdaki kodun, ağ üzerindeki başka bir cihazda (istemciden sunucuya veya sunucudan istemciye) bir fonksiyonu tetiklemesi."
  },
  {
    term: "Draw Call",
    category: "Optimizasyon",
    definition: "CPU'nun grafik kartına (GPU) belirli bir nesneyi çizmesi için verdiği emir. Çok fazla draw call CPU'yu kilitler."
  },
  {
    term: "Static & Dynamic Batching",
    category: "Optimizasyon",
    definition: "Aynı materyale sahip birden çok bağımsız 3D mesh'in tek bir çizim çağrısında (Draw Call) birleştirilerek GPU'ya iletilmesi."
  },
  {
    term: "LOD (Level of Detail)",
    category: "Optimizasyon",
    definition: "Bir 3D modelin kameraya olan mesafesine göre yüksek poligonlu halinden düşük poligonlu haline otomatik geçiş yapması tekniği."
  },
  {
    term: "Frustum Culling",
    category: "Optimizasyon",
    definition: "Kameranın görüş piramidinin (Frustum) dışında kalan nesnelerin ekran kartı tarafından işlenmeden atılması."
  },
  {
    term: "Occlusion Culling",
    category: "Optimizasyon",
    definition: "Öndeki büyük nesnelerin (duvarlar, binalar) arkasında kalıp görünmeyen objelerin çizim kuyruğundan çıkarılması."
  },
  {
    term: "UV Mapping",
    category: "Shader & Grafik",
    definition: "2D bir kaplama resminin (Texture) 3D bir modelin yüzeyine koordinatlarla (U: Yatay, V: Dikey) sarılması işlemi."
  },
  {
    term: "Vertex Shader",
    category: "Shader & Grafik",
    definition: "GPU üzerinde her bir tepe noktası (Vertex) için çalışan ve modelin geometrik konumunu değiştirebilen (rüzgar, dalga) shader aşaması."
  },
  {
    term: "Fragment (Pixel) Shader",
    category: "Shader & Grafik",
    definition: "Ekrandaki her pikselin rengini, gölgesini, ışığını ve şeffaflığını hesaplayan GPU programı."
  },
  {
    term: "Greyboxing (Blockout)",
    category: "Tasarım & Prototipleme",
    definition: "Görsel varlıklar ve kaplamalar eklenmeden önce seviyenin sadece ilkel geometrik kutularla oynanabilirlik testine tabi tutulması."
  },
  {
    term: "Core Loop (Çekirdek Döngü)",
    category: "Tasarım & Prototipleme",
    definition: "Oyuncunun oyun boyunca en sık yaptığı ve oyunun merkezinde duran temel eylemler zinciri (Örn: Keşfet -> Savaş -> Ganimet Topla -> Geliş)."
  }
];
