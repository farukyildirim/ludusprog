// LudusProg - Dijital Oyun Tasarımı İçin Oyun Programlama Müfredatı
// Kapsam: Temel, Orta, İleri ve Teknik Oyun Tasarımı Seviyeleri

export const CURRICULUM = [
  {
    id: "level-1",
    levelNumber: 1,
    title: "Temel Seviye: Oyun Programlama Temelleri",
    shortTitle: "Temel Seviye",
    tagline: "Oyun Döngüsü, Vektör Matematiği, Fizik ve Girdi Sistemleri",
    color: "from-emerald-500 to-teal-700",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    lessons: [
      {
        id: "l1-game-loop",
        title: "Oyun Döngüsü & Zaman Kavramı (Game Loop & Delta Time)",
        duration: "30 dk",
        labId: "gameloop",
        summary: "Bir oyunun kalbi olan ana döngü mimarisini, kare hızından bağımsız (frame-rate independent) hareket mantığını ve deltaTime kavramını öğrenin.",
        description: `
### Oyun Döngüsü (Game Loop) Nedir?
Klasik yazılımlar genellikle bir kullanıcı eylemi (örneğin buton tıklaması) bekler ve olay gerçekleşene kadar uyur. Oyunlar ise sürekli yaşayan, saniyede 60, 120 veya daha fazla kez dünyayı güncelleyen ve ekrana çizen **sürekli bir döngü (Continuous Loop)** üzerinde çalışır.

Bir oyun döngüsünün 3 temel aşaması vardır:
1. **Girdi Dinleme (Process Input):** Klavye, fare, gamepad veya dokunmatik ekran olayları toplanır.
2. **Dünya Güncelleme (Update Game State):** Karakterler hareket eder, yapay zeka kararları verilir, zamanlayıcılar işler, canlar azalır.
3. **Fizik Güncelleme (Fixed Update):** Deterministik fizik simülasyonu çalışır.
4. **Ekrana Çizme (Render):** Sahnedeki tüm 3D/2D objeler, ışıklar ve kamera perspektifi ekrana piksel olarak çizilir.

---

### En Kritik Kavram: \`Delta Time\` ve Kare Bağımsızlığı
Eğer karakterinizi her karede \`x = x + 5\` şeklinde hareket ettirirseniz:
- Oyunu **60 FPS** alan bir oyuncuda karakter saniyede: \`60 * 5 = 300\` piksel gider.
- Oyunu **144 FPS** alan güçlü bilgisayarlı bir oyuncuda karakter: \`144 * 5 = 720\` piksel gider!
Bu durum oyunu adil olmayan ve bozuk hale getirir.

Çözüm: **Delta Time (İki kare arasında geçen süre)** ile çarpmaktır!
\`x = x + (hız * deltaTime)\`
Bu sayede her oyuncu saniyede tam olarak belirlenen hız kadar yol alır.

> **Tasarımcı Notu:** Bir oyun tasarımcısı olarak prototip test ederken düşük donanımlı cihazlarda veya kare hızının dalgalandığı durumlarda karakterin hızının ve fiziksel hissinin değişmemesi için her zaman Delta Time kullanılmalıdır.
        `,
        keyConcepts: [
          { term: "Update() / _process()", desc: "Her görsel karede bir kez çağrılır. Girdi okuma, kamera takibi ve animasyonlar için kullanılır." },
          { term: "FixedUpdate() / _physics_process()", desc: "Sabit zaman aralıklarıyla (örn. 50Hz/0.02s) çağrılır. Kararlı fizik hesaplamaları içindir." },
          { term: "DeltaTime", desc: "Bir önceki kareden şu anki kareye kadar geçen süredir (saniye cinsinden kesirli sayı)." },
          { term: "Frame Rate Independence", desc: "Oyun mekaniklerinin oyuncunun FPS değerine bağlı olmaksızın aynı hızda çalışması kuralıdır." }
        ],
        codeExamples: {
          unity: `// Unity C# - Frame-rate Independent Movement
using UnityEngine;

public class PlayerMovement : MonoBehaviour
{
    [SerializeField] private float moveSpeed = 8.0f;

    // Girdi ve animasyonlar Update'te işlenir
    void Update()
    {
        float horizontal = Input.GetAxisRaw("Horizontal");
        float vertical = Input.GetAxisRaw("Vertical");
        
        Vector3 direction = new Vector3(horizontal, 0f, vertical).normalized;

        // deltaTime ile çarparak saniyedeki hızını sabitliyoruz
        transform.position += direction * moveSpeed * Time.deltaTime;
    }

    // Fizik ve Rigidbody hesaplamaları FixedUpdate'te yapılır
    void FixedUpdate()
    {
        // Sabit zamanlı fizik hesaplamaları
    }
}`,
          godot: `# Godot 4 GDScript - Frame-rate Independent Movement
extends CharacterBody3D

@export var move_speed: float = 8.0

func _process(delta: float) -> void:
    # Görsel güncellemeler ve arayüz hesaplamaları
    pass

func _physics_process(delta: float) -> void:
    # Godot'ta fizik hareketi _physics_process içinde yapılır
    var input_dir := Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down")
    var direction := Vector3(input_dir.x, 0, input_dir.y).normalized()
    
    if direction:
        velocity.x = direction.x * move_speed
        velocity.z = direction.z * move_speed
    else:
        velocity.x = move_toward(velocity.x, 0, move_speed)
        velocity.z = move_toward(velocity.z, 0, move_speed)

    # move_and_slide() arkada delta ile otomatik çarpar
    move_and_slide()`,
          unreal: `// Unreal Engine C++ - Tick ve DeltaTime
#include "MyCharacter.h"

void AMyCharacter::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);

    FVector ForwardInput = GetActorForwardVector() * CurrentForwardValue;
    FVector RightInput = GetActorRightVector() * CurrentRightValue;
    FVector MoveDirection = (ForwardInput + RightInput).GetSafeNormal();

    // DeltaTime ile frame-rate independence garantilenir
    AddMovementInput(MoveDirection, MoveSpeed * DeltaTime);
}

/* 
 * BLUEPRINT MANTIĞI:
 * Event Tick -> Delta Seconds pinini al -> Move Speed ile çarp -> Add Movement Input
 */`,
          roblox: `-- Roblox Luau - RunService RenderStepped & Heartbeat
local RunService = game:GetService("RunService")
local character = script.Parent
local humanoidRootPart = character:WaitForChild("HumanoidRootPart")

local MOVE_SPEED = 24 -- studs per second

-- RenderStepped her kare çiziminden hemen önce çalışır
RunService.RenderStepped:Connect(function(deltaTime)
    -- Girdi yönü
    local moveDirection = Vector3.new(0, 0, -1) -- Örnek ileri yön
    
    -- deltaTime ile kare bağımsız hareket
    -- humanoidRootPart.CFrame = humanoidRootPart.CFrame + (moveDirection * MOVE_SPEED * deltaTime)
end)`
        }
      },
      {
        id: "l1-vector-math",
        title: "Oyun Matematiği: Vektörler, Yön & Trigonometri",
        duration: "45 dk",
        labId: "vector",
        summary: "Oyun mekaniklerinin yapı taşı olan vektör toplamı, çıkarma, normalize etme, Dot Product (görüş açısı testi) ve Lerp kavramlarını keşfedin.",
        description: `
### Bir Oyun Tasarımcısı Neden Vektör Bilmelidir?
Oyun dünyasında her konum (Position), hız (Velocity), yön (Direction), kuvvet (Force) ve ivme (Acceleration) birer vektördür. 

Eğer vektör matematiğini kavrarsanız:
- Düşmanın oyuncuyu görüp görmediğini (FOV - Field of View) tek bir satırda hesaplayabilirsiniz.
- Merminin namludan hedef noktaya doğru fırlatılmasını sağlarsınız.
- Yumuşak kamera takibi ve arayüz animasyonlarını **Lerp (Linear Interpolation)** ile yapabilirsiniz.

---

### Temel Vektör Operasyonları
1. **İki Nokta Arasındaki Yön & Mesafe (Vektör Çıkarma):**
   \`Fark = Hedef - Başlangıç\`
   - Bu vektörün büyüklüğü (\`Magnitude\` veya \`Length\`), iki obje arasındaki gerçek **mesafedir**.
   - Bu vektörün normalize edilmiş hali (\`Normalized\`), sadece **yönü** verir (uzunluğu 1 olan birim vektör).

2. **Noktasal Çarpım (Dot Product - İç Çarpım):**
   İki birim vektör arasındaki açının kosinüsünü verir (\`A · B = cos(θ)\`).
   - Sonuç **1** ise: İki vektör tamamen aynı yöne bakıyor.
   - Sonuç **0** ise: Aralarındaki açı 90 derecedir (tam dik).
   - Sonuç **-1** ise: Tamamen zıt yöne bakıyorlar (arkasında).
   > **Tasarım Formülü:** Bir gizlilik oyununda düşmanın arkadan bıçaklanması (\`Backstab\`) veya düşmanın görüş konisi (\`FOV\`) doğrudan Dot Product ile kodlanır!

3. **Lerp (Linear Interpolation - Doğrusal Ara Değer):**
   \`Lerp(a, b, t) = a + (b - a) * t\` (Burada t [0, 1] arasındadır).
   - \`t = 0\` ise \`a\` noktasındasınız.
   - \`t = 1\` ise \`b\` noktasındasınız.
   - \`t = 0.5\` ise tam ortasındasınız.
   Yumuşak takip, sönümlü hareketler ve sağlık barının yavaşça düşmesi Lerp ile yapılır.
        `,
        keyConcepts: [
          { term: "Vector3(x, y, z)", desc: "3 boyutlu uzayda bir noktayı veya yönü temsil eden matematiksel yapı." },
          { term: "Normalize (Birim Vektör)", desc: "Vektörün yönünü koruyarak uzunluğunu tam 1 birime dönüştürme işlemi." },
          { term: "Dot Product (Noktasal Çarpım)", desc: "İki yön vektörünün hizalanma derecesini ölçer. Düşman görüş açısı tespiti için kullanılır." },
          { term: "Lerp (Linear Interpolation)", desc: "İki değer veya konum arasında belirli bir oranda pürüzsüz geçiş sağlama formülüdür." }
        ],
        codeExamples: {
          unity: `// Unity C# - Vektör Matematiği ve Düşman FOV Testi
using UnityEngine;

public class StealthDetection : MonoBehaviour
{
    public Transform targetPlayer;
    public float viewAngle = 60f; // 60 derecelik görüş açısı
    public float viewDistance = 15f;

    void Update()
    {
        // 1. Hedefe olan yön vektörü
        Vector3 dirToTarget = (targetPlayer.position - transform.position);
        float distance = dirToTarget.magnitude;

        // Mesafe kontrolü
        if (distance <= viewDistance)
        {
            // Yönü normalize et
            Vector3 normDir = dirToTarget.normalized;

            // 2. Dot Product ile önümüzde mi kontrolü
            float dot = Vector3.Dot(transform.forward, normDir);
            float angle = Vector3.Angle(transform.forward, normDir);

            if (angle < viewAngle / 2f)
            {
                Debug.Log("Oyuncu görüş konisi içinde!");
            }
        }

        // 3. Lerp ile yumuşak rotasyon
        Quaternion targetRot = Quaternion.LookRotation(dirToTarget);
        transform.rotation = Quaternion.Lerp(transform.rotation, targetRot, 5f * Time.deltaTime);
    }
}`,
          godot: `# Godot 4 GDScript - Vector Math & Dot Product
extends Node3D

@export var target: Node3D
@export var view_angle: float = 60.0
@export var max_dist: float = 15.0

func _process(delta: float) -> void:
    if not target: return
    
    var to_target := target.global_position - global_position
    var distance := to_target.length()
    
    if distance <= max_dist:
        var dir_normalized := to_target.normalized()
        var forward := -global_transform.basis.z # Godot'ta ileri yön -Z'dir
        
        # Dot product
        var dot_val := forward.dot(dir_normalized)
        var angle_deg := rad_to_deg(acos(dot_val))
        
        if angle_deg < (view_angle / 2.0):
            print("Oyuncu tespit edildi!")
            
    # Lerp ile takip
    global_position = global_position.lerp(target.global_position, 2.0 * delta)`,
          unreal: `// Unreal Engine C++ - Vector Math
#include "Math/Vector.h"

bool AEnemyAI::CanSeePlayer(AActor* PlayerActor, float MaxAngle, float MaxDistance)
{
    FVector EnemyLocation = GetActorLocation();
    FVector PlayerLocation = PlayerActor->GetActorLocation();
    
    FVector DirToPlayer = (PlayerLocation - EnemyLocation);
    float Distance = DirToPlayer.Size();
    
    if (Distance > MaxDistance) return false;
    
    FVector ForwardVector = GetActorForwardVector();
    FVector NormalizedDir = DirToPlayer.GetSafeNormal();
    
    // Dot Product (-1 ile 1 arası kosinüs değeri)
    float DotProduct = FVector::DotProduct(ForwardVector, NormalizedDir);
    float AngleDegrees = FMath::RadiansToDegrees(FMath::Acos(DotProduct));
    
    return AngleDegrees <= (MaxAngle * 0.5f);
}`,
          roblox: `-- Roblox Luau - Vector3, Magnitude & Dot Product
local enemy = script.Parent
local playerRoot = workspace:FindFirstChild("Player") and workspace.Player:FindFirstChild("HumanoidRootPart")

local MAX_DISTANCE = 30
local FOV_DEGREES = 70

if playerRoot then
    local enemyPos = enemy.Position
    local playerPos = playerRoot.Position
    
    local offset = playerPos - enemyPos
    local distance = offset.Magnitude
    
    if distance <= MAX_DISTANCE then
        local direction = offset.Unit -- Normalized vector
        local forward = enemy.CFrame.LookVector
        
        local dot = forward:Dot(direction)
        local angle = math.deg(math.acos(math.clamp(dot, -1, 1)))
        
        if angle <= (FOV_DEGREES / 2) then
            print("Oyuncu düşmanın görüş alanında!")
        end
    end
end`
        }
      },
      {
        id: "l1-physics-collision",
        title: "Fizik, Çarpışma Tespiti & Raycasting",
        duration: "40 dk",
        labId: null,
        summary: "RigidBody, Kinematic ve Static fizik türleri, Trigger vs Collision ayrımları ve görünmez lazer çizgileri olan Raycasting tekniği.",
        description: `
### Oyun Fiziğinin Temelleri
Bir oyun motorunda nesnelerin birbirinin içinden geçmemesi ve gerçekçi tepkiler vermesi için fizik motoru (PhysX, Jolt, Box2D vb.) devrededir.

#### 1. Çarpışma Nesnesi Türleri (Collision Types):
- **Static Collider:** Hareket etmeyen dünya elemanları (duvarlar, zemin, binalar). CPU için çok ucuzdur.
- **Dynamic / Rigidbody:** Yerçekimi, sürtünme ve kuvvetlerden etkilenen serbest nesneler (yuvarlanan varil, düşen kutu).
- **Kinematic:** Kod ile doğrudan hareket ettirilen ama diğer dinamik nesnelere çarptığında onları itebilen nesneler (hareketli asansör, döner platform, oyuncu kontrolcüsü).

#### 2. Collision vs. Trigger (Katı Çarpışma ve Tetikleyici):
- **Collision (OnCollisionEnter):** Katı fiziksel çarpışmadır. Objeler birbirini durdurur, seker, enerji transfer eder.
- **Trigger (OnTriggerEnter / Overlap):** Fiziksel bir itme olmaz; nesne içinden geçer. Ancak sistem bir olay tetikler (Altın toplama, kapı açma bölgesi, tuzak alanı).

---

### Raycasting Nedir? (Görünmez Lazer Işını)
Raycasting, sanal bir noktadan belirli bir yöne doğru görünmez bir ışın fırlatıp bu ışının bir collider ile kesişip kesişmediğini kontrol etmektir.

**Kullanım Alanları:**
- **Hitscan Silahlar:** Mermi fırlatmak yerine namludan çıkan anlık ışın ile düşmanı vurma (CS:GO, Valorant mantığı).
- **Zemin Tespiti (Grounded Check):** Karakterin zıplayabilmesi için ayaklarının altında zemin olup olmadığını test etme.
- **Etkileşim (Interact):** Oyuncunun baktığı nesnenin ne olduğunu algılama (Kapıyı aç, sandığı incele).
        `,
        keyConcepts: [
          { term: "Raycast", desc: "Bir başlangıç noktasından belirli bir yöne fırlatılan ve çarptığı ilk objenin bilgilerini getiren sanal ışın." },
          { term: "Trigger / Overlap", desc: "Fiziksel durdurma yapmayan ama geçiş anında kod tetikleyen hayali temas hacmi." },
          { term: "Layer Mask", desc: "Raycast'in sadece belirli nesne katmanlarını (örn. sadece Düşmanlar veya sadece Zemin) görmesini sağlayan filtre." },
          { term: "AABB (Axis-Aligned Bounding Box)", desc: "En hızlı ve hafif kutu çarpışma hesaplama geometrisi." }
        ],
        codeExamples: {
          unity: `// Unity C# - Ground Check & Raycast Shooting
using UnityEngine;

public class RaycastMechanics : MonoBehaviour
{
    [SerializeField] private LayerMask groundLayer;
    [SerializeField] private LayerMask enemyLayer;

    // 1. Zemin Kontrolü (Ground Check)
    public bool IsGrounded()
    {
        float rayDistance = 1.1f;
        // Ayaktan aşağıya ışın gönder
        return Physics.Raycast(transform.position, Vector3.down, rayDistance, groundLayer);
    }

    // 2. Hitscan Ateş Etme
    public void FireGun(Camera cam, float damage)
    {
        Ray ray = cam.ViewportPointToRay(new Vector3(0.5f, 0.5f, 0f)); // Ekranın tam ortası
        if (Physics.Raycast(ray, out RaycastHit hit, 100f, enemyLayer))
        {
            Debug.Log("Vurulan Obje: " + hit.collider.name + " Nokta: " + hit.point);
            // Hasar ver veya partikül üret
        }
    }
}`,
          godot: `# Godot 4 GDScript - Raycast3D & Area3D Trigger
extends CharacterBody3D

@onready var raycast: RayCast3D = $RayCast3D

func check_interaction() -> void:
    if raycast.is_colliding():
        var collider = raycast.get_collider()
        var hit_point = raycast.get_collision_point()
        var hit_normal = raycast.get_collision_normal()
        print("Baktığınız obje: ", collider.name)

# Trigger Tetikleyicisi (Area3D)
func _on_pickup_area_entered(body: Node3D) -> void:
    if body.is_in_group("Player"):
        print("Altın toplandı!")
        queue_free() # Yok et`,
          unreal: `// Unreal Engine C++ - LineTraceSingleByChannel
#include "Kismet/GameplayStatics.h"
#include "DrawDebugHelpers.h"

void AWeapon::FireRaycast()
{
    FVector StartLocation = GunMesh->GetSocketLocation("Muzzle");
    FVector ForwardVector = PlayerCamera->GetForwardVector();
    FVector EndLocation = StartLocation + (ForwardVector * 5000.0f);

    FHitResult HitResult;
    FCollisionQueryParams Params;
    Params.AddIgnoredActor(this);

    bool bHit = GetWorld()->LineTraceSingleByChannel(
        HitResult,
        StartLocation,
        EndLocation,
        ECC_Visibility,
        Params
    );

    if (bHit)
    {
        AActor* HitActor = HitResult.GetActor();
        // Hasar uygula: UGameplayStatics::ApplyDamage(...)
    }
}`,
          roblox: `-- Roblox Luau - Workspace:Raycast with RaycastParams
local Workspace = game:GetService("Workspace")

local function castBullet(origin, direction, shooterCharacter)
    local raycastParams = RaycastParams.new()
    raycastParams.FilterDescendantsInstances = {shooterCharacter}
    raycastParams.FilterType = RaycastFilterType.Exclude
    raycastParams.IgnoreWater = true

    local maxDistance = 200
    local result = Workspace:Raycast(origin, direction * maxDistance, raycastParams)

    if result then
        local hitPart = result.Instance
        local hitPosition = result.Position
        local hitNormal = result.Normal
        
        local humanoid = hitPart.Parent:FindFirstChildOfClass("Humanoid")
        if humanoid then
            humanoid:TakeDamage(25)
        end
    end
end`
        }
      },
      {
        id: "l1-input-systems",
        title: "Girdi Sistemleri & Oyuncu Etkileşimi (Input Mapping)",
        duration: "35 dk",
        labId: null,
        summary: "Klavye, fare, gamepad ve dokunmatik kontrolleri soyutlayan modern Input Action haritalama mimarisini öğrenin.",
        description: `
### Eski Tarz 'Hardcoded' Giriş vs Modern Input Actions
Eski oyunlarda doğrudan \`if (Input.GetKey(KeyCode.W))\` gibi donanıma bağımlı kontroller yazılırdı. 
Bu yaklaşımın büyük kusurları vardır:
- Oyuncu tuş atamalarını (Rebinding) değiştiremez.
- Gamepad, klavye ve dokunmatik ekranlar için her seferinde ayrı kod yazmak gerekir.
- Analog joystick hassasiyeti (Deadzone, smoothing) yönetilemez.

Modern oyun motorlarında **Action-Based Input (Olay Tabanlı Eylem)** yaklaşımı kullanılır:
1. Bir eylem tanımlanır: Örneğin \`Jump\`.
2. Bu eyleme donanım tuşları bağlanır: Space tuşu, Gamepad 'A' butonu, Dokunmatik ekranda 'Zıpla' butonu.
3. Oyun kodu sadece \`OnJumpTriggered\` olayını dinler. Donanımın ne olduğu oyun mekaniklerini ilgilendirmez!
        `,
        keyConcepts: [
          { term: "Action Mapping", desc: "Donanım tuşlarının soyut oyun eylemlerine ('Ateş', 'Zıpla', 'Etkileşim') eşlenmesi." },
          { term: "Deadzone (Ölü Bölge)", desc: "Analog joystick çubuklarının aşınmadan dolayı titremesini önleyen eşik değeri." },
          { term: "Input Buffering", desc: "Oyuncu zıplama tuşuna yere basmadan 0.1 sn önce bassa bile yere değer değmez zıplamasını sağlayan tolerans havuzu." }
        ],
        codeExamples: {
          unity: `// Unity New Input System (C#)
using UnityEngine;
using UnityEngine.InputSystem;

public class ModernPlayerInput : MonoBehaviour
{
    private Vector2 moveInput;

    // Input Action Asset'inden otomatik çağrılan fonksiyon
    public void OnMove(InputValue value)
    {
        moveInput = value.Get<Vector2>();
    }

    public void OnJump(InputValue value)
    {
        if (value.isPressed)
        {
            PerformJump();
        }
    }

    private void PerformJump()
    {
        Debug.Log("Zıplama eylemi tetiklendi!");
    }
}`,
          godot: `# Godot 4 Input Map Sistemi (Project Settings > Input Map)
extends CharacterBody3D

func get_movement_vector() -> Vector2:
    # "move_left", "move_right", "move_forward", "move_back"
    return Input.get_vector("move_left", "move_right", "move_forward", "move_back")

func _unhandled_input(event: InputEvent) -> void:
    if event.is_action_pressed("jump"):
        try_jump()`,
          unreal: `// Unreal Engine 5 Enhanced Input System
#include "EnhancedInputComponent.h"

void APlayerCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
    if (UEnhancedInputComponent* EnhancedInput = Cast<UEnhancedInputComponent>(PlayerInputComponent))
    {
        EnhancedInput->BindAction(MoveAction, ETriggerEvent::Triggered, this, &APlayerCharacter::Move);
        EnhancedInput->BindAction(JumpAction, ETriggerEvent::Started, this, &ACharacter::Jump);
    }
}`,
          roblox: `-- Roblox ContextActionService (Cross-Platform Mobile/PC/Console)
local ContextActionService = game:GetService("ContextActionService")

local ACTION_JUMP = "GameAction_Jump"

local function handleJump(actionName, inputState, inputObject)
    if inputState == Enum.UserInputState.Begin then
        print("Oyuncu zıpladı!")
    end
end

-- Hem PC Space hem Gamepad ButtonA hem mobil buton üretir!
ContextActionService:BindAction(
    ACTION_JUMP,
    handleJump,
    true, -- Mobil UI ekran butonu üret
    Enum.KeyCode.Space,
    Enum.KeyCode.ButtonA
)`
        }
      }
    ]
  },
  {
    id: "level-2",
    levelNumber: 2,
    title: "Orta Seviye: Mekanikler, Durum ve Sistemler",
    shortTitle: "Orta Seviye",
    tagline: "Karakter Kontrolcüleri, Durum Makineleri, Game Feel ve Envanter",
    color: "from-blue-500 to-indigo-700",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    lessons: [
      {
        id: "l2-character-controllers",
        title: "Karakter Kontrolcüleri (Platformer & 3D Kinematic)",
        duration: "50 dk",
        labId: null,
        summary: "Platform oyunları ve 3D aksiyon için profesyonel karakter kontrolcü mimarisi: Hızlanma, sürtünme, Coyote Time ve Jump Buffering.",
        description: `
### Kötü Bir Karakter Kontrolcüsü vs Mükemmel Bir Kontrolcü
Oyuncunun bir oyunu 'akıcı' ve 'zevkli' hissetmesini sağlayan ilk unsur karakter kontrolcüsüdür.
Eğer saf fizik \`Rigidbody.velocity\` veya kontrolsüz doğrudan konum değişimi kullanırsanız:
- Karakter buz üstünde kayar gibi duramaz.
- Zıplama tavana veya havada garip kütle tepkilerine yol açar.
- Uçurum kenarından tam düşerken zıplamak isteyen oyuncu düşer ve oyunu haksız bulur.

---

### Profesyonel Oyun Tasarımı 'Hileleri' (Platformer Polish)
1. **Coyote Time (Çakal Süresi):**
   Karakter bir platformun kenarından boşluğa adım attıktan sonraki **100-150 milisaniye** boyunca hala zıplamasına izin verilir. İsmini çizgi film karakteri Wile E. Coyote'un uçurumdan düştükten sonra havada bir an durmasından alır.
2. **Jump Buffering (Zıplama Ön Belleği):**
   Oyuncu havada düşerken, yere değmeden 0.1 sn önce zıplama tuşuna basarsa, bu girdi kaydedilir ve karakter yere bastığı ilk karede zıplama gerçekleşir.
3. **Değişken Zıplama Yüksekliği (Variable Jump Height):**
   Zıplama tuşuna hafifçe basıp bırakırsanız kısa zıplar (Hop), basılı tutarsanız tam yüksekliğe ulaşır (Mario ve Hollow Knight mantığı).
        `,
        keyConcepts: [
          { term: "Coyote Time", desc: "Zeminden ayrıldıktan sonra oyuncuya zıplama şansı tanıyan 0.1-0.15 saniyelik tolerans süresi." },
          { term: "Jump Buffering", desc: "Yere inmeden hemen önce basılan tuşun kaçırılmayıp inişte tetiklenmesi." },
          { term: "Kinematic Controller", desc: "Harici fizik kuvvetlerine kapalı, tamamen kod odaklı pürüzsüz hareket sağlayan kontrolcü tipi." }
        ],
        codeExamples: {
          unity: `// Unity C# - Platformer Controller with Coyote Time & Jump Buffer
using UnityEngine;

public class PlatformerController : MonoBehaviour
{
    [SerializeField] private float speed = 10f;
    [SerializeField] private float jumpForce = 14f;
    
    private float coyoteTime = 0.15f;
    private float coyoteCounter;
    
    private float jumpBufferTime = 0.1f;
    private float jumpBufferCounter;

    [SerializeField] private Transform groundCheck;
    [SerializeField] private LayerMask groundLayer;
    private Rigidbody2D rb;

    void Awake() => rb = GetComponent<Rigidbody2D>();

    void Update()
    {
        bool isGrounded = Physics2D.OverlapCircle(groundCheck.position, 0.2f, groundLayer);

        // Coyote Time sayacı
        if (isGrounded) coyoteCounter = coyoteTime;
        else coyoteCounter -= Time.deltaTime;

        // Jump Buffer sayacı
        if (Input.GetButtonDown("Jump")) jumpBufferCounter = jumpBufferTime;
        else jumpBufferCounter -= Time.deltaTime;

        // Hem Coyote hem Buffer uygunsa zıpla!
        if (coyoteCounter > 0f && jumpBufferCounter > 0f)
        {
            rb.linearVelocity = new Vector2(rb.linearVelocity.x, jumpForce);
            jumpBufferCounter = 0f;
        }

        // Değişken zıplama: Erken bırakırsa yerçekimi hızla düşürsün
        if (Input.GetButtonUp("Jump") && rb.linearVelocity.y > 0f)
        {
            rb.linearVelocity = new Vector2(rb.linearVelocity.x, rb.linearVelocity.y * 0.5f);
        }
    }
}`,
          godot: `# Godot 4 GDScript - Coyote Time & Jump Buffer
extends CharacterBody2D

const SPEED = 300.0
const JUMP_VELOCITY = -400.0

var coyote_timer: float = 0.0
var jump_buffer: float = 0.0
const COYOTE_DURATION: float = 0.15
const BUFFER_DURATION: float = 0.1

func _physics_process(delta: float) -> void:
    if not is_on_floor():
        velocity += get_gravity() * delta
        coyote_timer -= delta
    else:
        coyote_timer = COYOTE_DURATION

    if Input.is_action_just_pressed("jump"):
        jump_buffer = BUFFER_DURATION
    else:
        jump_buffer -= delta

    if jump_buffer > 0.0 and coyote_timer > 0.0:
        velocity.y = JUMP_VELOCITY
        jump_buffer = 0.0
        coyote_timer = 0.0

    var direction := Input.get_axis("move_left", "move_right")
    velocity.x = direction * SPEED
    move_and_slide()`,
          unreal: `// Unreal Engine Character Movement Component Customization
// UCharacterMovementComponent dahili olarak jump buffer ve pürüzsüz hızlanmayı destekler:
void AMyCharacter::BeginPlay()
{
    Super::BeginPlay();
    // Havada hareket kontrol oranı
    GetCharacterMovement()->AirControl = 0.85f;
    // Yerçekimi ölçeği
    GetCharacterMovement()->GravityScale = 1.75f;
    // Düşüş hızı sınırı
    GetCharacterMovement()->JumpZVelocity = 650.0f;
}`,
          roblox: `-- Roblox Platformer / Movement Tweaks
local character = script.Parent
local humanoid = character:WaitForChild("Humanoid")

-- Roblox varsayılan fizik ayarları
humanoid.WalkSpeed = 20
humanoid.JumpPower = 55
humanoid.UseJumpPower = true

-- Karakterin yere temas durumunu anlık dinleme
humanoid.StateChanged:Connect(function(oldState, newState)
    if newState == Enum.HumanoidStateType.Landed then
        -- Yere indiğinde partikül veya ses efekti
    end
end)`
        }
      },
      {
        id: "l2-state-machines",
        title: "Durum Makineleri (Finite State Machine - FSM)",
        duration: "45 dk",
        labId: "fsm",
        summary: "Spagetti if-else karmaşasına son: Karakter hareketleri ve yapay zeka durumlarını profesyonel FSM mimarisiyle tasarlayın.",
        description: `
### 'Spagetti Kod' Tuzağı
Bir karakter kodlarken başlangıçta şunları yazarsınız:
\`\`\`csharp
if (isJumping) { ... }
else if (isRunning && !isAttacking && isGrounded) { ... }
else if (isDead) { ... }
\`\`\`
Oyun geliştikçe (Yuvarlanma, Tırmanma, Duvara Tutunma, Hasar Alma eklendikçe) bu if-else blokları içinden çıkılmaz bir kabusa dönüşür. Karakter ölüyken zıplayabilir veya tırmanırken kılıç sallayabilir!

---

### Çözüm: Sonlu Durum Makinesi (FSM)
Bir karakter aynı anda **yalnızca tek bir ana durumda** bulunabilir:
- **IDLE (Bekleme)**
- **RUN (Koşma)**
- **JUMP (Zıplama)**
- **ATTACK (Saldırı)**
- **DEAD (Ölüm)**

Her Durum (State) 3 temel metoda sahiptir:
1. \`Enter()\`: Bu duruma geçildiği ilk an (Örn: Zıplama animasyonunu başlat, ses çal).
2. \`Update()\` / \`Execute()\`: Durum aktifken her karede ne yapılacak.
3. \`Exit()\`: Bu durumdan çıkılırken ne temizlenecek (Örn: Hızı sıfırla, kalkanı kapat).
        `,
        keyConcepts: [
          { term: "FSM (Finite State Machine)", desc: "Bir sistemin tanımlı sonlu sayıdaki durumlardan birinde bulunması ve kurallara göre durum değiştirmesi modeli." },
          { term: "State Pattern", desc: "Her durumun kendi sınıfı içinde kapsüllendiği nesne yönelimli tasarım kalıbı." },
          { term: "Transition (Geçiş)", desc: "Bir durumdan diğerine geçilmesini sağlayan koşul (örn: Can <= 0 ise -> Dead)." }
        ],
        codeExamples: {
          unity: `// Unity C# - Clean State Pattern Architecture
public interface IState
{
    void Enter();
    void Update();
    void Exit();
}

public class StateMachine
{
    public IState CurrentState { get; private set; }

    public void ChangeState(IState newState)
    {
        CurrentState?.Exit();
        CurrentState = newState;
        CurrentState.Enter();
    }

    public void Update() => CurrentState?.Update();
}

// Örnek: Idle Durumu
public class IdleState : IState
{
    private PlayerController player;
    public IdleState(PlayerController player) => this.player = player;

    public void Enter() => player.PlayAnimation("Idle");
    public void Update()
    {
        if (player.GetMovementInput() != Vector2.zero)
            player.StateMachine.ChangeState(player.RunState);
        else if (player.IsJumpTriggered())
            player.StateMachine.ChangeState(player.JumpState);
    }
    public void Exit() { }
}`,
          godot: `# Godot 4 Node-based State Machine
class_name StateMachine extends Node

@export var initial_state: State
var current_state: State
var states: Dictionary = {}

func _ready() -> void:
    for child in get_children():
        if child is State:
            states[child.name.to_lower()] = child
            child.transitioned.connect(on_child_transition)
    
    if initial_state:
        initial_state.enter()
        current_state = initial_state

func _process(delta: float) -> void:
    if current_state:
        current_state.update(delta)

func on_child_transition(new_state_name: String) -> void:
    var new_state = states.get(new_state_name.to_lower())
    if not new_state or new_state == current_state: return
    
    current_state.exit()
    new_state.enter()
    current_state = new_state`,
          unreal: `// Unreal Engine State Machine (AnimInstance & Gameplay FSM)
UENUM(BlueprintType)
enum class EPlayerState : uint8
{
    Idle,
    Running,
    Jumping,
    Attacking,
    Dead
};

// Character sınıfı içinde
UPROPERTY(VisibleAnywhere, BlueprintReadOnly)
EPlayerState CurrentState;

void AMyPlayer::SetPlayerState(EPlayerState NewState)
{
    if (CurrentState == NewState) return;
    ExitState(CurrentState);
    CurrentState = NewState;
    EnterState(NewState);
}`,
          roblox: `-- Roblox Luau - State Machine Module
local StateMachine = {}
StateMachine.__index = StateMachine

function StateMachine.new(states, initialState)
    local self = setmetatable({}, StateMachine)
    self.states = states
    self.current = states[initialState]
    if self.current and self.current.Enter then
        self.current:Enter()
    end
    return self
end

function StateMachine:Change(newStateName)
    if self.current and self.current.Exit then
        self.current:Exit()
    end
    self.current = self.states[newStateName]
    if self.current and self.current.Enter then
        self.current:Enter()
    end
end

return StateMachine`
        }
      },
      {
        id: "l2-game-feel",
        title: "Teknik Oyun Tasarımı: 'Game Feel' & Juice",
        duration: "40 dk",
        labId: "juice",
        summary: "Bir oyunu sıkıcıdan olağanüstüye dönüştüren sırlar: Screen Shake, Hit Stop (durdurma karesi), Squash & Stretch ve mikro geri bildirimler.",
        description: `
### 'Juice' (Meyve Suyu / Canlılık) Nedir?
Game Feel teorisyeni Steve Swink ve efsanevi Vlambeer geliştiricileri (Nuclear Throne) şu felsefeyi savunur:
> *"Oyun mekaniği matematiksel olarak doğru olabilir, ancak duyusal olarak geri bildirim vermiyorsa oyuncu sıkılır."*

Aynı vuruş mekaniğini ele alalım:
1. **Juice Olmayan:** Oyuncu kılıç sallar, düşmanın canı 10 azalır. Ses yok, tepki yok, sarsıntı yok. Donuk ve yapay.
2. **Juice Eklenmiş (Juicy):**
   - Vuruş anında oyun **60 milisaniye tamamen donar (Hit Stop / Sleep Frame)**. Vuruşun ağırlığı hissedilir.
   - Kamera hafifçe sarsılır (\`Screen Shake\`).
   - Düşman anlık olarak beyaz yanıp söner (\`Flash Shader\`).
   - Darbe yönünde kan/kıvılcım partikülleri fışkırır.
   - Vuruş sayısı havaya doğru zıplayarak uçar (\`Floating Damage Text\`).
   - Düşman ezilip uzar (\`Squash & Stretch\`).

Oyunun temel kodu değişmemiştir; ama oyuncunun aldığı zevk 10 katına çıkmıştır!
        `,
        keyConcepts: [
          { term: "Hit Stop (Frame Freeze)", desc: "Büyük bir vuruş yapıldığında oyunu birkaç milisaniye dondurarak darbenin kinetik gücünü hissettirme tekniği." },
          { term: "Screen Shake", desc: "Patlama veya vuruş anında kamera konumuna rastgele gürültü (noise) ekleyerek sarsma efekti." },
          { term: "Squash & Stretch", desc: "Zıplarken uzayan, yere basarken veya darbe alırken basıklaşan esnek organik hacim deformasyonu." },
          { term: "Impact Flash", desc: "Hasar alan objenin 1-2 kare boyunca tamamen beyaz renkle aydınlatılması." }
        ],
        codeExamples: {
          unity: `// Unity C# - Screen Shake & Hit Stop Controller
using System.Collections;
using UnityEngine;

public class GameFeelEffects : MonoBehaviour
{
    public static GameFeelEffects Instance;
    private void Awake() => Instance = this;

    // 1. Hit Stop (Zamanı dondurma)
    public void TriggerHitStop(float duration = 0.06f)
    {
        StartCoroutine(HitStopRoutine(duration));
    }

    private IEnumerator HitStopRoutine(float duration)
    {
        Time.timeScale = 0f; // Fizik ve zaman durur
        yield return new WaitForSecondsRealtime(duration); // Gerçek zamanla bekle
        Time.timeScale = 1f; // Normale dön
    }

    // 2. Camera Shake
    public IEnumerator ShakeCamera(Transform cam, float duration, float magnitude)
    {
        Vector3 originalPos = cam.localPosition;
        float elapsed = 0.0f;

        while (elapsed < duration)
        {
            float x = Random.Range(-1f, 1f) * magnitude;
            float y = Random.Range(-1f, 1f) * magnitude;
            cam.localPosition = new Vector3(originalPos.x + x, originalPos.y + y, originalPos.z);
            elapsed += Time.unscaledDeltaTime;
            yield return null;
        }

        cam.localPosition = originalPos;
    }
}`,
          godot: `# Godot 4 GDScript - Hit Stop & Screen Shake
extends Node

func hit_stop(duration_sec: float = 0.06) -> void:
    Engine.time_scale = 0.0
    await get_tree().create_timer(duration_sec, true, false, true).timeout
    Engine.time_scale = 1.0

# Kamera Sarsıntısı (Camera2D / Camera3D)
func shake_camera(camera: Camera2D, amount: float = 8.0, duration: float = 0.2) -> void:
    var tween := create_tween()
    for i in range(5):
        var offset := Vector2(randf_range(-amount, amount), randf_range(-amount, amount))
        tween.tween_property(camera, "offset", offset, duration / 5.0)
    tween.tween_property(camera, "offset", Vector2.ZERO, 0.05)`,
          unreal: `// Unreal Engine C++ / Blueprint Camera Shake
// UMatineeCameraShake veya ULegacyCameraShake kullanarak
void AMyWeapon::OnHitEnemy()
{
    // 1. Kamera Sarsıntısı Oynat
    if (CameraShakeClass)
    {
        UGameplayStatics::PlayWorldCameraShake(GetWorld(), CameraShakeClass, GetActorLocation(), 0.0f, 1000.0f);
    }

    // 2. Hit Stop (Global Time Dilation)
    UGameplayStatics::SetGlobalTimeDilation(GetWorld(), 0.05f);
    
    // Belirli bir süre sonra zamanı normale al
    FTimerHandle TimerHandle;
    GetWorldTimerManager().SetTimer(TimerHandle, [this]()
    {
        UGameplayStatics::SetGlobalTimeDilation(GetWorld(), 1.0f);
    }, 0.06f, false);
}`,
          roblox: `-- Roblox Luau - Screen Shake via Camera CFrame
local RunService = game:GetService("RunService")
local camera = workspace.CurrentCamera

local function shakeCamera(intensity, duration)
    local startTime = tick()
    local connection
    
    connection = RunService.RenderStepped:Connect(function()
        local elapsed = tick() - startTime
        if elapsed >= duration then
            connection:Disconnect()
            return
        end
        
        local dampening = 1 - (elapsed / duration)
        local rotX = (math.random() - 0.5) * intensity * dampening
        local rotY = (math.random() - 0.5) * intensity * dampening
        camera.CFrame = camera.CFrame * CFrame.Angles(math.rad(rotX), math.rad(rotY), 0)
    end)
end`
        }
      },
      {
        id: "l2-inventory-data",
        title: "Veri Yönetimi, Envanter & ScriptableObjects",
        duration: "45 dk",
        labId: null,
        summary: "Oyun verilerini (eşyalar, silah istatistikleri, yetenekler) koddan ayırma: ScriptableObjects, JSON ve Data Tables.",
        description: `
### Veriyi Koddan Ayırmak Neden Şarttır?
Acemi geliştiriciler her yeni kılıç veya düşman türü için yeni bir C#/GDScript sınıfı yazar. 
Eğer 500 farklı silahınız olacaksa, 500 farklı script yazmak projenin çöküşüdür!

Doğru Mimari: **Veri Odaklı Tasarım (Data-Driven Design)**
- Kod tek bir \`ItemData\` veya \`WeaponDefinition\` kalıbı tanımlar.
- Tasarımcılar kod yazmadan editör arayüzünden (ScriptableObject, JSON veya Excel tablosu gibi) yeni silahlar üretir:
  * Silah Adı: "Alev Kılıcı"
  * Hasar: 45
  * Saldırı Hızı: 1.2
  * İkon: flame_sword.png
  * 3D Model: sword_04.fbx
        `,
        keyConcepts: [
          { term: "ScriptableObject / Custom Resource", desc: "Sahnede bulunmayan, doğrudan proje dosyası (.asset / .tres) olarak kaydedilen saf veri konteyneri." },
          { term: "Data-Driven Design", desc: "Oyun dengesi ve içeriklerinin kod değiştirmeden dış veri dosyalarıyla yönetilmesi prensibi." },
          { term: "JSON Serialization", desc: "Oyun kayıtlarının (Save/Load) metin formatına çevrilip diske yazılması işlemi." }
        ],
        codeExamples: {
          unity: `// Unity C# - ScriptableObject Item Definition
using UnityEngine;

[CreateAssetMenu(fileName = "NewItem", menuName = "Game/Item Data")]
public class ItemData : ScriptableObject
{
    public string itemName;
    public Sprite icon;
    public int baseDamage;
    public float attackSpeed;
    public GameObject visualPrefab;
}

// Oyundaki herhangi bir envanter slotu:
public class InventorySlot : MonoBehaviour
{
    public ItemData item; // Editörden sürükle bırak!
}`,
          godot: `# Godot 4 Custom Resource (item_data.gd)
class_name ItemData extends Resource

@export var item_name: String = ""
@export var icon: Texture2D
@export var base_damage: int = 10
@export var attack_speed: float = 1.0
@export var visual_scene: PackedScene`,
          unreal: `// Unreal Engine C++ - FTableRowBase Data Table
#include "Engine/DataTable.h"

USTRUCT(BlueprintType)
struct FItemDataRow : public FTableRowBase
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FText ItemName;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    int32 BaseDamage = 10;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    UTexture2D* Icon;
};`,
          roblox: `-- Roblox Luau - ModuleScript Data Table (ReplicatedStorage)
local ItemsDatabase = {
    ["FireSword"] = {
        Name = "Alev Kılıcı",
        Damage = 45,
        AttackCooldown = 0.8,
        Rarity = "Legendary"
    },
    ["WoodenBow"] = {
        Name = "Tahta Yay",
        Damage = 15,
        AttackCooldown = 1.2,
        Rarity = "Common"
    }
}

return ItemsDatabase`
        }
      },
      {
        id: "l2-ui-hud",
        title: "Olay Tabanlı Arayüz (UI) & HUD Programlama",
        duration: "35 dk",
        labId: null,
        summary: "UI kodunu oyun mantığına dolamadan temiz tutma: Olay dinleyicileri (Events / Signals), Can Barı animasyonları ve Yüzen Hasar Metinleri.",
        description: `
### Kötü UI Kodu vs Temiz Olay Tabanlı UI
UI ile oyun mekaniklerini birbirine doğrudan bağlamak en büyük mimari hatadır:
- **KÖTÜ YÖNTEM:** Can barı scripti her kare \`Update()\` içinde \`player.currentHealth\` değerini yoklar.
- **DOĞRU YÖNTEM (Event / Signal):** Can barı tamamen pasiftir. Sadece oyuncunun \`OnHealthChanged\` olayına abone olur. Can değiştiğinde sinyal gelir ve arayüz barı pürüzsüzce (\`Tween\` ile) azalır.
        `,
        keyConcepts: [
          { term: "Observer Pattern (Gözlemci)", desc: "Bir objenin durum değişikliğini kendisini dinleyen abonelere haber vermesi kalıbı." },
          { term: "Tweening", desc: "Bir değerin zaman içinde matematiksel eğrilerle (Ease-In, Ease-Out) akıcı animasyonu." },
          { term: "Screen-Space vs World-Space", desc: "Ekrana sabitlenmiş HUD ile 3D dünyanın içinde duran (karakter tepesindeki can barı) UI farkı." }
        ],
        codeExamples: {
          unity: `// Unity C# - Action Event Driven UI
using System;
using UnityEngine;
using UnityEngine.UI;

public class PlayerHealth : MonoBehaviour
{
    // Event tanımı
    public static event Action<float, float> OnHealthChanged; // (current, max)

    private float currentHealth = 100f;
    private float maxHealth = 100f;

    public void TakeDamage(float amount)
    {
        currentHealth = Mathf.Max(0, currentHealth - amount);
        // Dinleyen tüm arayüzlere haber ver!
        OnHealthChanged?.Invoke(currentHealth, maxHealth);
    }
}

// UI Bar sınıfı
public class HealthBarUI : MonoBehaviour
{
    [SerializeField] private Slider slider;

    void OnEnable() => PlayerHealth.OnHealthChanged += UpdateBar;
    void OnDisable() => PlayerHealth.OnHealthChanged -= UpdateBar;

    private void UpdateBar(float cur, float max)
    {
        slider.value = cur / max;
    }
}`,
          godot: `# Godot 4 Signal Driven UI
# player.gd
signal health_changed(current: float, max: float)

func take_damage(amount: float) -> void:
    health -= amount
    health_changed.emit(health, max_health)

# health_bar.gd
func _ready() -> void:
    player.health_changed.connect(_on_health_changed)

func _on_health_changed(cur: float, max: float) -> void:
    var tween = create_tween()
    tween.tween_property(progress_bar, "value", (cur / max) * 100.0, 0.25)`,
          unreal: `// Unreal Engine C++ Dynamic Multicast Delegate
DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FOnHealthChangedSignature, float, CurrentHealth, float, MaxHealth);

UPROPERTY(BlueprintAssignable, Category = "Events")
FOnHealthChangedSignature OnHealthChanged;

// UMG Widget Blueprint içinde 'Bind to OnHealthChanged' ile dinlenir.`,
          roblox: `-- Roblox Luau - BindableEvent for UI
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local healthChangedEvent = Instance.new("BindableEvent")
healthChangedEvent.Name = "PlayerHealthChanged"

-- UI Scriptinde dinleme:
healthChangedEvent.Event:Connect(function(current, max)
    local ratio = current / max
    healthBarFrame:TweenSize(UDim2.new(ratio, 0, 1, 0), Enum.EasingDirection.Out, Enum.EasingStyle.Quad, 0.3)
end)`
        }
      }
    ]
  },
  {
    id: "level-3",
    levelNumber: 3,
    title: "İleri Seviye: Mimari, Yapay Zeka & Optimizasyon",
    shortTitle: "İleri Seviye",
    tagline: "Tasarım Kalıpları, NavMesh/A* AI, Multiplayer Ağ Temelleri ve Shader'lar",
    color: "from-purple-500 to-pink-700",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    lessons: [
      {
        id: "l3-design-patterns",
        title: "Oyun Tasarım Kalıpları (Design Patterns)",
        duration: "55 dk",
        labId: null,
        summary: "Büyük çaplı oyun projelerinde temiz ve genişletilebilir kod: Singleton, Object Pool, Command Pattern ve Event Bus mimarisi.",
        description: `
### Oyun Geliştirmede Tasarım Kalıpları Neden Hayatidir?
Amatör projeler ile profesyonel stüdyolar arasındaki en büyük fark **yazılım mimarisidir**.

#### 1. Object Pooling (Nesne Havuzu Kalıbı):
Ateş eden bir makineli tüfek hayal edin: Saniyede 30 mermi doğuyor (\`Instantiate\`) ve bir yere çarpınca yok ediliyor (\`Destroy\`).
- Sürekli nesne yaratıp yok etmek **Garbage Collection (Bellek Temizliği)** tetikler ve oyunda anlık takılmalara (Spike/Stutter) yol açar!
- **Object Pool Çözümü:** Oyun başında 100 mermi yaratılır ve pasif havuzda tutulur. Ateş edilince havuzdan mermi alınır (\`SetActive(true)\`), işi bitince geri havuza konur (\`SetActive(false)\`). Sıfır bellek tahsisi!

#### 2. Command Pattern (Komut Kalıbı):
Oyuncunun her eylemini (Yürü, Zıpla, Ateş Et) bir nesne olarak sarmalar.
- Bu sayede **Geri Al (Undo)**, **Tekrar Oynat (Replay)** ve **Ağ üzerinden komut gönderme** inanılmaz kolaylaşır.

#### 3. Singleton & Service Locator:
Müzik yöneticisi (\`AudioManager\`) veya Kayıt sistemi (\`SaveManager\`) gibi sahneden bağımsız yaşayan tekil servislerin erişimini sağlar.
        `,
        keyConcepts: [
          { term: "Object Pool", desc: "Sık üretilip yok edilen objelerin (mermi, partikül) önceden yaratılıp tekrar tekrar kullanılması tekniği." },
          { term: "Command Pattern", desc: "Bir eylemi parametreleriyle birlikte bir nesneye dönüştürerek kuyruklama ve geri alma imkanı sunan kalıp." },
          { term: "Event Bus", desc: "Sistemlerin birbirine doğrudan referans vermeden global olaylar üzerinden haberleşmesini sağlayan santral." }
        ],
        codeExamples: {
          unity: `// Unity C# - Generic Object Pool
using System.Collections.Generic;
using UnityEngine;

public class BulletPool : MonoBehaviour
{
    [SerializeField] private GameObject bulletPrefab;
    [SerializeField] private int poolSize = 30;
    private Queue<GameObject> pool = new Queue<GameObject>();

    void Awake()
    {
        for (int i = 0; i < poolSize; i++)
        {
            GameObject obj = Instantiate(bulletPrefab, transform);
            obj.SetActive(false);
            pool.Enqueue(obj);
        }
    }

    public GameObject SpawnBullet(Vector3 position, Quaternion rotation)
    {
        GameObject bullet = pool.Dequeue();
        bullet.transform.position = position;
        bullet.transform.rotation = rotation;
        bullet.SetActive(true);
        return bullet;
    }

    public void ReturnBullet(GameObject bullet)
    {
        bullet.SetActive(false);
        pool.Enqueue(bullet);
    }
}`,
          godot: `# Godot 4 GDScript - Object Pooler Node
extends Node

@export var bullet_scene: PackedScene
@export var initial_size: int = 30
var pool: Array[Node] = []

func _ready() -> void:
    for i in range(initial_size):
        var obj = bullet_scene.instantiate()
        obj.process_mode = Node.PROCESS_MODE_DISABLED
        obj.visible = false
        add_child(obj)
        pool.append(obj)

func get_bullet() -> Node:
    for obj in pool:
        if not obj.visible:
            obj.visible = true
            obj.process_mode = Node.PROCESS_MODE_INHERIT
            return obj
    return null`,
          unreal: `// Unreal Engine C++ - Gameplay Tags & Subsystems
// Unreal 5'te Singleton yerine GameInstanceSubsystem kullanılır:
UCLASS()
class UInventorySubsystem : public UGameInstanceSubsystem
{
    GENERATED_BODY()
public:
    virtual void Initialize(FSubsystemCollectionBase& Collection) override;
    // Sahne değişimlerinde hayatta kalan global servis
};`,
          roblox: `-- Roblox Luau - Object Pooling Pattern
local BulletPool = {}
BulletPool.__index = BulletPool

function BulletPool.new(templatePart, size)
    local self = setmetatable({}, BulletPool)
    self.pool = {}
    for i = 1, size do
        local part = templatePart:Clone()
        part.Parent = workspace
        part.Transparency = 1
        part.CanCollide = false
        table.insert(self.pool, part)
    end
    return self
end

function BulletPool:Get()
    for _, part in ipairs(self.pool) do
        if part.Transparency == 1 then
            part.Transparency = 0
            part.CanCollide = true
            return part
        end
    end
    return nil
end

return BulletPool`
        }
      },
      {
        id: "l3-game-ai",
        title: "Oyun Yapay Zekası: Navigasyon & Karar Ağaçları",
        duration: "50 dk",
        labId: null,
        summary: "NavMesh navigasyonu, A* algoritması, görüş alanı (Sensörler) ve Düşman Davranış Ağaçları (Behavior Trees).",
        description: `
### Oyun Yapay Zekası (Game AI) Gerçek AI ile Aynı mıdır?
Hayır! Oyun yapay zekasının amacı 'dünyayı ele geçirmek' veya insanı alt etmek değil, **oyuncuya eğlenceli ve adil bir mücadele hissi yaşatmaktır**.

Bir oyun yapay zekasının 3 temel parçası vardır:
1. **Algılama (Perception / Senses):** Düşman oyuncuyu gördü mü (FOV & Raycast)? Sesini duydu mu (Mesafe çemberi)?
2. **Yol Bulma (Pathfinding & NavMesh):** Engellerin etrafından dolanarak hedefe en kısa yoldan ulaşma (A* algoritması).
3. **Karar Verme (Decision Making):**
   - **Devriye Gez (Patrol):** Oyuncu yokken noktalar arasında gezin.
   - **Takip Et (Chase):** Oyuncuyu görünce üzerine koş.
   - **Saldır (Attack):** Belirli menzile girince ateş et.
   - **Siper Al (Take Cover):** Canı azaldığında engellerin arkasına saklan.
        `,
        keyConcepts: [
          { term: "NavMesh (Navigasyon Ağı)", desc: "Seviyedeki yürünebilir alanların önceden taranıp (Bake) poligon haritasına dönüştürülmesi." },
          { term: "A* (A-Star) Algoritması", desc: "İki nokta arasındaki en verimli rotayı sezgisel maliyetlerle bulan temel yol arama formülü." },
          { term: "Behavior Tree (Davranış Ağacı)", desc: "AAA oyunlarda karmaşık yapay zeka mantıklarını hiyerarşik (Selector, Sequence) düğümlerle yöneten yapı." }
        ],
        codeExamples: {
          unity: `// Unity C# - NavMeshAgent Patrol & Chase AI
using UnityEngine;
using UnityEngine.AI;

[RequireComponent(typeof(NavMeshAgent))]
public class EnemyAI : MonoBehaviour
{
    [SerializeField] private Transform playerTarget;
    [SerializeField] private Transform[] patrolPoints;
    [SerializeField] private float chaseRange = 10f;
    [SerializeField] private float attackRange = 2f;

    private NavMeshAgent agent;
    private int currentPatrolIndex = 0;

    void Awake() => agent = GetComponent<NavMeshAgent>();

    void Update()
    {
        float distToPlayer = Vector3.Distance(transform.position, playerTarget.position);

        if (distToPlayer <= attackRange)
        {
            // Saldırı durumu
            agent.isStopped = true;
            Debug.Log("Düşman vuruyor!");
        }
        else if (distToPlayer <= chaseRange)
        {
            // Takip durumu
            agent.isStopped = false;
            agent.SetDestination(playerTarget.position);
        }
        else
        {
            // Devriye gezme durumu
            agent.isStopped = false;
            if (!agent.pathPending && agent.remainingDistance < 0.5f)
            {
                currentPatrolIndex = (currentPatrolIndex + 1) % patrolPoints.Length;
                agent.SetDestination(patrolPoints[currentPatrolIndex].position);
            }
        }
    }
}`,
          godot: `# Godot 4 GDScript - NavigationAgent3D
extends CharacterBody3D

@onready var nav_agent: NavigationAgent3D = $NavigationAgent3D
@export var speed: float = 5.0

func set_target_destination(target_pos: Vector3) -> void:
    nav_agent.target_position = target_pos

func _physics_process(delta: float) -> void:
    if nav_agent.is_navigation_finished():
        return

    var next_path_pos := nav_agent.get_next_path_position()
    var direction := (next_path_pos - global_position).normalized()
    
    velocity = direction * speed
    move_and_slide()`,
          unreal: `// Unreal Engine Behavior Tree & AIController
// Unreal'da AI yapısı şunlardan oluşur:
// 1. AAIController (Düşmanı yöneten beyin)
// 2. Blackboard (Yapay zekanın hafızası: TargetActor, IsInCover vb.)
// 3. Behavior Tree (Selector & Sequence düğümleri ile karar akışı)
void AMyAIController::OnPossess(APawn* InPawn)
{
    Super::OnPossess(InPawn);
    if (BehaviorTreeAsset)
    {
        RunBehaviorTree(BehaviorTreeAsset);
    }
}`,
          roblox: `-- Roblox PathfindingService (Monster AI Pattern)
local PathfindingService = game:GetService("PathfindingService")
local monster = script.Parent
local humanoid = monster:WaitForChild("Humanoid")
local root = monster:WaitForChild("HumanoidRootPart")

local function followPath(destination)
    local path = PathfindingService:CreatePath({
        AgentRadius = 2,
        AgentHeight = 5,
        AgentCanJump = true
    })
    
    path:ComputeAsync(root.Position, destination)
    
    if path.Status == Enum.PathStatus.Success then
        local waypoints = path:GetWaypoints()
        for _, waypoint in ipairs(waypoints) do
            humanoid:MoveTo(waypoint.Position)
            humanoid.MoveToFinished:Wait()
        end
    end
end`
        }
      },
      {
        id: "l3-multiplayer",
        title: "Çok Oyunculu (Multiplayer) & Ağ Temelleri",
        duration: "50 dk",
        labId: null,
        summary: "Otoriter sunucu (Authoritative Server), RPC (Remote Procedure Call), Network Variables ve istemci tarafı tahmin (Client Prediction).",
        description: `
### Tek Oyunculu Kod Neden Çok Oyunculuda Çalışmaz?
Tek oyunculu bir oyunda bir değişkene (\`health -= 10\`) yazdığınızda her şey anında değişir.
Çok oyunculu bir oyunda ise:
- İstemci (Client) hile yapabilir. Eğer istemcinin 'ben ateş ettim ve vurdum' demesine güvenirseniz hileciler oyunu yok eder!
- Fiziksel gecikme (Ping / Latency) vardır. İstanbul'daki oyuncu ile Frankfurt sunucusu arasında 40-70 milisaniye gecikme olur.

---

### Temel Ağ Mimarisi: Authoritative Server (Otoriter Sunucu)
Oyun dünyasının tek ve mutlak gerçeği **Sunucudur (Server)**.
1. İstemci sadece niyetini bildirir: *"İleri yürümek istiyorum"* veya *"Ateş tuşuna bastım"*.
2. Sunucu bu eylemi doğrular: *"Oyuncunun mermisi var mı? Yürümek istediği yer duvar mı?"*
3. Sunucu sonucu hesaplar ve tüm istemcilere yayınlar (\`Replication / Sync\`).
        `,
        keyConcepts: [
          { term: "Authoritative Server", desc: "Hileleri önlemek için tüm oyun mekaniği kararlarını alan merkezi sunucu kuralı." },
          { term: "RPC (Remote Procedure Call)", desc: "İstemciden sunucuya (ServerRpc) veya sunucudan tüm oyunculara (ClientRpc) fonksiyon çağırma yöntemi." },
          { term: "Client Prediction", desc: "Oyuncunun gecikme hissetmemesi için sunucu onayını beklemeden karakteri anlık hareket ettirmesi tekniği." }
        ],
        codeExamples: {
          unity: `// Unity Netcode for GameObjects (NGO)
using Unity.Netcode;
using UnityEngine;

public class NetworkPlayerHealth : NetworkBehaviour
{
    // Sunucu kontrollü değişken (otomatik tüm istemcilere senkronize olur)
    public NetworkVariable<int> health = new NetworkVariable<int>(100, 
        NetworkVariableReadPermission.Everyone, 
        NetworkVariableWritePermission.Server);

    // İstemciden Sunucuya Çağrı
    [ServerRpc]
    public void RequestDamageServerRpc(int amount)
    {
        // Yalnızca sunucuda çalışır!
        health.Value = Mathf.Max(0, health.Value - amount);
        
        if (health.Value <= 0)
        {
            NotifyDeathClientRpc();
        }
    }

    // Sunucudan İstemcilere Çağrı
    [ClientRpc]
    private void NotifyDeathClientRpc()
    {
        Debug.Log("Bu oyuncu öldü efekti oynat!");
    }
}`,
          godot: `# Godot 4 MultiplayerAPI
extends CharacterBody3D

@export var player_id: int = 1

# Sunucuya gönderilen RPC fonksiyonu
@rpc("any_peer", "call_local", "reliable")
func take_damage_rpc(amount: int) -> void:
    if multiplayer.is_server():
        health -= amount
        # Yeni canı herkese duyur
        update_health_rpc.rpc(health)

@rpc("authority", "call_local")
func update_health_rpc(new_health: int) -> void:
    health = new_health`,
          unreal: `// Unreal Engine C++ Network Replication
// Header dosyasında:
UPROPERTY(ReplicatedUsing = OnRep_Health)
float CurrentHealth;

UFUNCTION()
void OnRep_Health(); // Can istemcide değiştiğinde tetiklenir

// Server RPC
UFUNCTION(Server, Reliable, WithValidation)
void Server_ApplyDamage(float Amount);`,
          roblox: `-- Roblox Client-Server RemoteEvent (ReplicatedStorage)
-- ServerScriptService (Sunucu Kodu):
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local damageEvent = Instance.new("RemoteEvent")
damageEvent.Name = "DamageRequest"
damageEvent.Parent = ReplicatedStorage

damageEvent.OnServerEvent:Connect(function(player, targetEnemy)
    -- Hile kontrolü: Mesafe testi
    local dist = (player.Character.HumanoidRootPart.Position - targetEnemy.Position).Magnitude
    if dist <= 15 then
        targetEnemy.Humanoid:TakeDamage(20)
    end
end)`
        }
      },
      {
        id: "l3-optimization",
        title: "Performans, Profiling & Optimizasyon",
        duration: "45 dk",
        labId: null,
        summary: "60/120 FPS akıcılık için optimizasyon: Draw Calls, Batching, Garbage Collection (GC) yönetimi ve LOD sistemleri.",
        description: `
### Oyun Tasarımcısının Optimizasyon Sorumluluğu
Oyununuz harika tasarlanmış olabilir, ancak 20 FPS'e düşüyorsa kimse oynamayacaktır. 
Optimizasyon iki büyük darboğaza (Bottleneck) odaklanır:
1. **CPU Darboğazı:**
   - Çok fazla fizik hesaplaması.
   - Sık yapılan \`Instantiate / Destroy\` nedeniyle Garbage Collector'ın (çöp toplayıcı) oyunu dondurması.
   - Her kare binlerce objenin \`Update()\` fonksiyonunda arama (\`Find\`, \`GetComponent\`) yapması.
2. **GPU Darboğazı:**
   - **Draw Call (Çizim Çağrısı):** CPU'nun GPU'ya "Şu objeyi çiz" dediği her komut. Sahnedeki 5000 taş tek tek çizilirse GPU çöker!
   - Çözüm: **GPU Instancing** ve **Static Batching** ile benzer objeleri tek çağrıda çizmek.
   - **LOD (Level of Detail):** Uzaktaki objelerin poligon sayısını düşürmek.
   - **Occlusion Culling:** Kamera arkasında veya duvar arkasında kalan görünmeyen objeleri çizmemek.
        `,
        keyConcepts: [
          { term: "Draw Call / Batch", desc: "CPU'nun GPU'ya bir materyal ve mesh grubunu çizmesi için gönderdiği paket komut." },
          { term: "LOD (Level of Detail)", desc: "Kameraya yaklaştıkça detaylanan, uzaklaştıkça düşük poligonlu versiyonuna geçen model tekniği." },
          { term: "Garbage Collector Spike", desc: "C# veya dillerde kullanılmayan nesnelerin bellekten silinmesi sırasında oluşan milisaniyelik FPS düşüşleri." },
          { term: "Occlusion Culling", desc: "Duvar veya dağların arkasında kalıp ekranda görünmeyen objelerin çizimden tamamen çıkarılması." }
        ],
        codeExamples: {
          unity: `// Unity C# - Optimizasyon İpuçları (GC Alloc Önleme)
using UnityEngine;

public class OptimizedScript : MonoBehaviour
{
    // YANLIŞ: Update içinde GetComponent veya string birleştirme bellek harcar!
    // void Update() { GetComponent<Renderer>().material.color = Color.red; }

    // DOĞRU: Referansı Awake'te önbelleğe al (Cache):
    private Renderer myRenderer;
    private static readonly int ColorProperty = Shader.PropertyToID("_BaseColor");

    void Awake()
    {
        myRenderer = GetComponent<Renderer>();
    }

    void SetColorFast(Color col)
    {
        // MaterialPropertyBlock ile yeni materyal klonlamadan hızlı değişim
        MaterialPropertyBlock block = new MaterialPropertyBlock();
        block.SetColor(ColorProperty, col);
        myRenderer.SetPropertyBlock(block);
    }
}`,
          godot: `# Godot 4 MultiMeshInstance3D (Binlerce Objeyi Tek Draw Call ile Çizme)
extends MultiMeshInstance3D

func spawn_grass_field(count: int) -> void:
    multimesh.instance_count = count
    for i in range(count):
        var t := Transform3D()
        t.origin = Vector3(randf_range(-50, 50), 0, randf_range(-50, 50))
        multimesh.set_instance_transform(i, t)`,
          unreal: `// Unreal Engine Nanite & Lumen Best Practices
// UE5'te Nanite sayesinde milyonlarca poligon otomatik LOD yapılır.
// Ancak CPU optimizasyonu için:
// 1. Tick() fonksiyonunu gerekmedikçe kapatın: PrimaryActorTick.bCanEverTick = false;
// 2. Blueprint yerine kritik matematik döngülerini C++ ile yazın.`,
          roblox: `-- Roblox StreamingEnabled & ContentProvider
local ContentProvider = game:GetService("ContentProvider")

-- Kritik modelleri önceden yükleme (Preload)
local assetsToPreload = {
    workspace.BossModel,
    workspace.LobbyMap
}

ContentProvider:PreloadAsync(assetsToPreload)
print("Varlıklar belleğe yüklendi, takılma önlendi!")`
        }
      },
      {
        id: "l3-shaders",
        title: "Shader & Görsel Programlama Temelleri",
        duration: "40 dk",
        labId: null,
        summary: "Görsel efektlerin matematiği: Vertex vs Fragment shader, UV koordinat animasyonu, Dissolve (Yok olma) efekti ve Rim Lighting.",
        description: `
### Shader Nedir?
Shader, doğrudan ekran kartında (GPU) her bir köşe (Vertex) ve her bir piksel (Fragment) için saniyede milyarlarca kez çalışan özel küçük programlardır.
- **Vertex Shader:** Objelerin şeklini büker (Rüzgarda sallanan çimen, su dalgaları).
- **Fragment / Pixel Shader:** Her pikselin son rengini hesaplar (Ateş parlaması, cam yansıması, hologram, zehir parıltısı).

Görsel programlamayı (Unity Shader Graph, Unreal Material Editor, Godot Visual Shader) anlamanın anahtarı **UV koordinatları** ve renk matematiğidir.
        `,
        keyConcepts: [
          { term: "UV Koordinatı", desc: "2D kaplamanın 3D model üzerine 0 ile 1 arasındaki koordinatlarla sarılması." },
          { term: "Fragment / Pixel Shader", desc: "Her pikselin aydınlatma, doku ve renk değerini belirleyen GPU fonksiyonu." },
          { term: "Dissolve Effect", desc: "Bir gürültü (Noise) dokusuna göre karakterin kenarlarından yanarak yok olması efekti." }
        ],
        codeExamples: {
          unity: `// Unity HLSL Shader - Simple UV Scroll (Su / Akış Efekti)
Shader "Custom/UVScroll"
{
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
        _ScrollSpeed ("Scroll Speed", Vector) = (0.5, 0.5, 0, 0)
    }
    SubShader
    {
        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "UnityCG.cginc"

            sampler2D _MainTex;
            float4 _ScrollSpeed;

            struct v2f
            {
                float2 uv : TEXCOORD0;
                float4 pos : SV_POSITION;
            };

            v2f vert(appdata_base v)
            {
                v2f o;
                o.pos = UnityObjectToClipPos(v.vertex);
                // Zaman ile UV'yi ötele
                o.uv = v.texcoord + (_ScrollSpeed.xy * _Time.y);
                return o;
            }

            fixed4 frag(v2f i) : SV_Target
            {
                return tex2D(_MainTex, i.uv);
            }
            ENDCG
        }
    }
}`,
          godot: `// Godot 4 Shading Language - Dissolve Effect
shader_type spatial;

uniform sampler2D noise_texture;
uniform float dissolve_amount : hint_range(0.0, 1.0) = 0.0;
uniform vec4 edge_color : source_color = vec4(1.0, 0.4, 0.0, 1.0);

void fragment() {
    float noise_val = texture(noise_texture, UV).r;
    if (noise_val < dissolve_amount) {
        discard; // Bu pikseli çizme (şeffaf/yok)
    }
    
    // Kenar parlama çizgisi
    if (noise_val < dissolve_amount + 0.05) {
        ALBEDO = edge_color.rgb;
        EMISSION = edge_color.rgb * 2.0;
    }
}`,
          unreal: `// Unreal Engine Material Node Network (HLSL Custom Expression)
// Material Editor içinde:
// UV Koordinatına Panner düğümü bağlayarak UV animasyonu yapılır.
// Fresnel düğümü ile karakterin çevresinde Rim Light (kontur ışıması) elde edilir.`,
          roblox: `-- Roblox Studio Highlight & SurfaceAppearance PBR
-- Roblox doğrudan özel GLSL/HLSL yazımını sınırlasa da gelişmiş efektler için:
local highlight = Instance.new("Highlight")
highlight.FillColor = Color3.fromRGB(255, 100, 0)
highlight.OutlineColor = Color3.fromRGB(255, 255, 255)
highlight.FillTransparency = 0.5
highlight.Parent = character`
        }
      }
    ]
  },
  {
    id: "level-4",
    levelNumber: 4,
    title: "Teknik Oyun Tasarımı & Prototipleme",
    shortTitle: "Teknik Tasarım",
    tagline: "Game Jam Metodolojileri, Greyboxing ve Tasarım Dokümanından (GDD) Koda",
    color: "from-amber-500 to-orange-700",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    lessons: [
      {
        id: "l4-rapid-prototyping",
        title: "Hızlı Prototipleme & Greyboxing Metodolojileri",
        duration: "40 dk",
        labId: null,
        summary: "Bir oyun fikrini saatler içinde test edilebilir hale getirme: Greybox bloklama, temel mekanik izolasyonu ve 'Fail Fast' kültürü.",
        description: `
### Oyun Tasarımında Prototiplemenin Önemi
Çoğu acemi oyun geliştirici doğrudan 3D modelleme, ses kaydı ve detaylı grafiklerle başlar. 3 ay sonra oyun mekaniğinin aslında 'sıkıcı' olduğunu fark ettiğinde tüm harcanan emek boşa gider!

**Altın Kural: Core Mechanic First (Önce Çekirdek Mekanik)**
1. **Greyboxing (Gri Kutu Testi):** Hiçbir kaplama ve grafik olmadan sadece ilkel küpler ve silindirlerle seviye tasarlayın.
2. **Karakter Hissiyatı Testi:** Karakter hiçbir grafik olmadan sadece beyaz bir kapsülken bile zıplamak, koşmak ve eğilmek keyifli hissettirmelidir.
3. **Fail Fast (Hızlı Hata Yap):** Eğer mekanik çalışmıyorsa ilk 48 saatte bunu görüp yön değiştirebilmelisiniz (Game Jam felsefesi).
        `,
        keyConcepts: [
          { term: "Greyboxing (Blockout)", desc: "Görsel varlıklar üretilmeden önce seviye geometrisinin basit kutularla oynanabilirlik testine tabi tutulması." },
          { term: "Core Mechanic", desc: "Oyuncunun oyun boyunca en sık yapacağı eylem döngüsü (Örn: Mario'da zıplamak, Doom'da ateş edip hareket etmek)." },
          { term: "Fail Fast", desc: "Çalışmayan fikirleri erken aşamada tespit edip minimum maliyetle revize etme yaklaşımı." }
        ],
        codeExamples: {
          unity: `// Unity C# - Hızlı Parametrik Prototip Ayarları
using UnityEngine;

[ExecuteInEditMode]
public class PrototypePlatform : MonoBehaviour
{
    [Range(1f, 30f)] public float width = 5f;
    [Range(0.5f, 5f)] public float height = 1f;
    public Color debugColor = Color.cyan;

    void Update()
    {
        // Editörde anlık ölçeklendirip test etme
        transform.localScale = new Vector3(width, height, 1f);
    }

    void OnDrawGizmos()
    {
        Gizmos.color = debugColor;
        Gizmos.DrawWireCube(transform.position, transform.localScale);
    }
}`,
          godot: `# Godot 4 CSG (Constructive Solid Geometry) Bloklama
# Godot CSGBox3D ve CSGCombiner3D ile kod yazmadan saniyeler içinde
# kapılar, merdivenler ve karmaşık prototip odalar inşa edebilirsiniz.`,
          unreal: `// Unreal Engine Geometry Scripting & BSP Brushes
// Seviye tasarımcıları için Modeling Mode ile hızlı oda ve engel taslakları oluşturma.`,
          roblox: `-- Roblox Studio Part Bloklama
-- Basit Anchored Part'lar ve ProximityPrompt ile 10 dakikada oynanabilir mekanik testi.`
        }
      },
      {
        id: "l4-gdd-to-code",
        title: "Tasarım Dokümanından (GDD) Koda Dönüşüm",
        duration: "45 dk",
        labId: null,
        summary: "Oyun tasarımcısı (Game Designer) ile programcı (Programmer) arasındaki köprü: Mekanik ayrıştırma ve Core Loop mühendisliği.",
        description: `
### Tasarım Dili ile Kod Dili Arasındaki Fark
Bir Game Design Document (GDD) içinde şu cümle yazar:
> *"Oyuncu teleport taşına bastığında 1 saniye şarj olur, ardından hedefe ışınlanır ve etrafındaki düşmanları geri iter."*

Bir Teknik Oyun Tasarımcısı bu cümleyi kod mimarisine şöyle parçalar:
1. **Tetikleyici Algılama:** \`OnTriggerEnter\` (Taşın algılama hacmi).
2. **Durum Değişimi:** Karakter \`ChargingTeleport\` durumuna geçer (Input kilitlenir).
3. **Zamanlayıcı (Timer / Cooldown):** 1.0 saniyelik sayaç çalışır, partikül ve ses tetiklenir.
4. **Konum Değişimi (Teleport):** Karakterin \`transform.position\` değeri hedef noktaya atanır.
5. **Alan Hasarı & Fizik İtme (Radial Knockback):** \`Physics.OverlapSphere\` ile etraftaki tüm düşmanlar bulunur ve \`Rigidbody.AddExplosionForce\` uygulanır.
        `,
        keyConcepts: [
          { term: "Core Loop", desc: "Oyuncunun sürekli tekrarladığı temel döngü: Keşfet -> Savaş -> Ödül Topla -> Güçlen -> Tekrarla." },
          { term: "Technical Game Designer (Teknik Tasarımcı)", desc: "Oyun tasarım vizyonunu anlayan ve bunu motor içinde kod/script ile prototipleyebilen uzman rolü." },
          { term: "Feature Breakdown", desc: "Bir tasarım cümlesinin programlama değişkenleri, fonksiyonları ve sınıflarına ayrıştırılması süreci." }
        ],
        codeExamples: {
          unity: `// Unity C# - Teleport & Radial Knockback Implementation
using System.Collections;
using UnityEngine;

public class TeleportMechanic : MonoBehaviour
{
    [SerializeField] private Transform targetDestination;
    [SerializeField] private float chargeDuration = 1.0f;
    [SerializeField] private float blastRadius = 6.0f;
    [SerializeField] private float blastForce = 800f;

    public void ActivateTeleport(GameObject player)
    {
        StartCoroutine(TeleportRoutine(player));
    }

    private IEnumerator TeleportRoutine(GameObject player)
    {
        // 1. Şarj efekti
        Debug.Log("Işınlanma şarj ediliyor...");
        yield return new WaitForSeconds(chargeDuration);

        // 2. Işınlanma
        player.transform.position = targetDestination.position;

        // 3. Etraftaki düşmanları it (Radial Knockback)
        Collider[] hits = Physics.OverlapSphere(player.transform.position, blastRadius);
        foreach (var hit in hits)
        {
            Rigidbody rb = hit.GetComponent<Rigidbody>();
            if (rb != null && hit.gameObject != player)
            {
                rb.AddExplosionForce(blastForce, player.transform.position, blastRadius);
            }
        }
    }
}`,
          godot: `# Godot 4 GDScript - Radial Blast
func trigger_knockback(epicenter: Vector3, radius: float, force: float) -> void:
    var space_state = get_world_3d().direct_space_state
    var shape = SphereShape3D.new()
    shape.radius = radius
    
    var query = PhysicsShapeQueryParameters3D.new()
    query.shape = shape
    query.transform = Transform3D(Basis(), epicenter)
    
    var results = space_state.intersect_shape(query)
    for res in results:
        var body = res.collider
        if body is RigidBody3D:
            var push_dir = (body.global_position - epicenter).normalized()
            body.apply_central_impulse(push_dir * force)`,
          unreal: `// Unreal Engine C++ Radial Damage & Impulse
void ATeleportPad::OnTeleportArrived(FVector ArrivalLocation)
{
    // Unreal'in dahili Radial Damage & Impulse fonksiyonları
    UGameplayStatics::ApplyRadialDamage(GetWorld(), 50.0f, ArrivalLocation, 500.0f, nullptr, TArray<AActor*>(), this);
}`,
          roblox: `-- Roblox Luau - Explosion with Custom Knockback
local function createBlast(position, radius)
    local explosion = Instance.new("Explosion")
    explosion.Position = position
    explosion.BlastRadius = radius
    explosion.BlastPressure = 500000 -- İtme gücü
    explosion.Parent = workspace
end`
        }
      }
    ]
  }
];

// Yardımcı Fonksiyonlar
export function getAllLessons() {
  const all = [];
  CURRICULUM.forEach(level => {
    level.lessons.forEach(lesson => {
      all.push({ ...lesson, levelId: level.id, levelTitle: level.title, levelNumber: level.levelNumber });
    });
  });
  return all;
}

export function getLessonById(id) {
  for (const level of CURRICULUM) {
    const found = level.lessons.find(l => l.id === id);
    if (found) {
      return { ...found, levelId: level.id, levelTitle: level.title, levelNumber: level.levelNumber, levelColor: level.color };
    }
  }
  return null;
}
