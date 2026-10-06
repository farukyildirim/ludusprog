// Interactive Quiz Dataset for Digital Game Design Students

export const QUIZZES = [
  {
    id: "quiz-level-1",
    levelNumber: 1,
    title: "Temel Seviye Değerlendirme Testi",
    description: "Game Loop, Delta Time, Vektör Matematiği ve Fizik kavramlarını pekiştirin.",
    badgeTitle: "Vektör & Fizik Çırağı",
    questions: [
      {
        id: "q1_1",
        question: "Bir oyunda karakter hareketinde 'Time.deltaTime' kullanılmazsa ne tür bir problem ortaya çıkar?",
        options: [
          "Karakterin animasyonları ters oynar.",
          "Yüksek FPS alan oyuncuların bilgisayarında karakter daha hızlı koşar.",
          "Fizik motoru nesnelerin içinden geçmesine izin vermez.",
          "Ekran kartı aşırı ısınarak oyunu kapatır."
        ],
        correctIndex: 1,
        explanation: "DeltaTime olmadan her kare sabit miktarda ilerleyen bir obje, 144 FPS alan sistemde 30 FPS alana kıyasla neredeyse 5 kat daha hızlı hareket eder. DeltaTime, hareketi saniyeye oranlayarak kare hızından bağımsız kılar."
      },
      {
        id: "q1_2",
        question: "İki birim vektörün Noktasal Çarpımı (Dot Product) 0 çıkarsa, bu iki vektör arasındaki geometrik ilişki nedir?",
        options: [
          "Birbirlerine tamamen zıt yöne bakmaktadırlar (180 derece).",
          "Tamamen aynı yöne bakmaktadırlar (0 derece).",
          "Aralarında 90 derecelik dik bir açı vardır.",
          "İkisinin de uzunluğu sıfırdır."
        ],
        correctIndex: 2,
        explanation: "Dot product formülü cos(θ) içerir. cos(90°) = 0 olduğundan, sonucun sıfır olması iki vektörün birbirine dik (orthogonal) olduğunu gösterir."
      },
      {
        id: "q1_3",
        question: "Bir oyuncunun altın/coin toplarken veya gizli bir tetikleyici alana girdiğinde katı şekilde durmadan içinden geçmesi için hangi fizik bileşeni kullanılmalıdır?",
        options: [
          "Static Mesh Collider",
          "IsTrigger / Area3D (Tetikleyici Çarpıştırıcı)",
          "Non-Kinematic Rigidbody",
          "Physic Material Bounciness"
        ],
        correctIndex: 1,
        explanation: "Trigger (Tetikleyici) collider'lar fiziksel bir direnç/durdurma uygulamaz, ancak temas anında 'OnTriggerEnter' olayını tetikleyerek kod çalıştırmanızı sağlar."
      },
      {
        id: "q1_4",
        question: "FPS oyunlarında merminin namludan çıktığı an hedefi vurup vurmadığını tespit etmek için kullanılan görünmez ışın tekniğinin adı nedir?",
        options: [
          "Raycasting (Hitscan)",
          "Baking Occlusion",
          "Frustum Culling",
          "Rasterization"
        ],
        correctIndex: 0,
        explanation: "Raycasting, bir başlangıç noktasından belirli bir yöne doğru matematiksel bir ışın göndererek çarptığı ilk fizik nesnesini anında tespit etme yöntemidir."
      }
    ]
  },
  {
    id: "quiz-level-2",
    levelNumber: 2,
    title: "Orta Seviye: Karakter, FSM & Game Feel Testi",
    description: "Karakter kontrolcüleri, State Pattern ve Juicy mekanik tasarım prensipleri.",
    badgeTitle: "Mekanik & Juice Mimarı",
    questions: [
      {
        id: "q2_1",
        question: "Platform oyunlarında karakter platformun kenarından boşluğa düştükten sonra 0.1-0.15 saniye boyunca zıplamasına izin veren tolerans mekanizmasına ne ad verilir?",
        options: [
          "Jump Buffering",
          "Coyote Time",
          "Wall Cling",
          "Apex Float"
        ],
        correctIndex: 1,
        explanation: "Coyote Time, oyuncunun refleks hatalarını tolere ederek platform kenarından düşerken oyunu adil ve tatmin edici hissettiren meşhur tasarım tekniğidir."
      },
      {
        id: "q2_2",
        question: "Karakterin aynı anda sadece tek bir durumda (Yürüme, Zıplama, Saldırı veya Ölüm) olmasını sağlayan ve spagetti if-else bloklarını engelleyen tasarım kalıbı hangisidir?",
        options: [
          "Singleton Pattern",
          "Finite State Machine (FSM / Sonlu Durum Makinesi)",
          "Model-View-Controller (MVC)",
          "Object Pooler"
        ],
        correctIndex: 1,
        explanation: "FSM (Sonlu Durum Makinesi), karakter veya yapay zekanın durumlarını (Enter, Update, Exit) izole ederek hatasız durum geçişleri sağlar."
      },
      {
        id: "q2_3",
        question: "Büyük bir vuruş veya kritik darbe anında oyunun 50-80 milisaniye tamamen dondurulması (TimeScale = 0) tekniğine ne ad verilir?",
        options: [
          "Hit Stop / Frame Freeze",
          "Screen Tearing",
          "Garbage Collection Pause",
          "Latency Lag"
        ],
        correctIndex: 0,
        explanation: "Hit Stop (Frame Freeze), dövüş ve aksiyon oyunlarında (Street Fighter, Smash Bros, Dead Cells) darbenin kinetik etkisini oyuncunun beynine işlemek için uygulanan temel Juice tekniğidir."
      },
      {
        id: "q2_4",
        question: "500 farklı silah veya düşman çeşidi olan bir RPG oyununda her silah için ayrı bir C#/GDScript kodu yazmak yerine veriyi koddan ayıran Unity yapısı hangisidir?",
        options: [
          "ScriptableObject",
          "MonoBehaviour",
          "PlayerPrefs",
          "TextMeshPro"
        ],
        correctIndex: 0,
        explanation: "ScriptableObject (veya Godot'taki Custom Resource), sahnede yaşamayan, proje dosyası olarak saklanan ve veri odaklı tasarımı (Data-Driven Design) mümkün kılan veri konteyneridir."
      }
    ]
  },
  {
    id: "quiz-level-3",
    levelNumber: 3,
    title: "İleri Seviye: Mimari, AI & Optimizasyon Testi",
    description: "Object Pooling, Authoritative Network, NavMesh ve GPU Draw Call kavramları.",
    badgeTitle: "Optimizasyon & Ağ Ustası",
    questions: [
      {
        id: "q3_1",
        question: "Saniyede 50 mermi atan bir makineli tüfekte sürekli Instantiate ve Destroy çağırmanın yol açtığı en büyük teknik problem nedir?",
        options: [
          "Ses kartının kanallarının kilitlenmesi.",
          "Garbage Collector (Çöp Toplayıcı) çalışarak oyunda anlık donmalara (Spike) yol açar.",
          "Ekran kartının VRAM belleğinin anında dolması.",
          "Ağ paketlerinin şifrelenememesi."
        ],
        correctIndex: 1,
        explanation: "Sürekli nesne üretilip yok edilmesi RAM'de parçalanmaya ve C# Garbage Collector'ın devreye girerek oyunu milisaniyelerce dondurmasına sebep olur. Çözüm 'Object Pooling' kalıbıdır."
      },
      {
        id: "q3_2",
        question: "Çok oyunculu rekabetçi oyunlarda hilecilerin (örneğin uçma veya duvardan geçme hilesi) engellenmesi için uygulanan temel sunucu prensibi hangisidir?",
        options: [
          "Peer-to-Peer Tam Yetkili İstemci",
          "Authoritative Server (Otoriter Sunucu Mimarisi)",
          "İstemci Tarafı Doğrulama (Client-side Validation)",
          "WebRTC Doğrudan P2P Kanalı"
        ],
        correctIndex: 1,
        explanation: "Otoriter Sunucu mimarisinde istemciler sadece niyet bildirir ('Ateş tuşuna bastım'), merminin gerçekten çarpıp çarpmadığına ve hasara tamamen sunucu karar verir."
      },
      {
        id: "q3_3",
        question: "CPU'nun GPU'ya sahnedeki bir grup objeyi çizmesi için gönderdiği komut paketine ne ad verilir ve neden optimize edilmelidir?",
        options: [
          "Draw Call (Çizim Çağrısı) - Çok fazla olması CPU darboğazına yol açar.",
          "Pixel Shader - Fazlalığı VRAM'i tüketir.",
          "Vertex Count - Ekranı karartır.",
          "Ray Tracing Bounce - Sesi bozar."
        ],
        correctIndex: 0,
        explanation: "Draw Call (Çizim Çağrısı), CPU ile GPU arasındaki iletişim köprüsüdür. Binlerce ayrı draw call CPU'yu kilitler; GPU Instancing veya Static Batching ile tek bir çağrıda birleştirilmelidir."
      }
    ]
  }
];
