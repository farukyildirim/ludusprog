// Starter Pack and Project Templates Dataset
// İçerik: Roblox Starter Pack modülleri, Unity Game Manager Şablonu, Godot 4 Proje İskeleti, Unreal Proje Yapısı

export const STARTER_PACKS = [
  {
    id: "roblox-obby",
    engine: "roblox",
    genre: "Platform / Obby",
    title: "Obby (Engel Parkuru) Sistemi",
    description: "Checkpoint sistemi, lav/ölüm blokları (LavaKill) ve aşama göstergesi (Stage UI).",
    difficulty: "Başlangıç",
    files: [
      {
        path: "ServerScriptService/CheckpointModule.lua",
        desc: "Oyuncuların geçtiği aşamaları (Stage) sunucu tarafında kaydeder ve öldüklerinde son kaldıkları noktada doğmalarını sağlar.",
        code: `local CheckpointModule = {}
local Players = game:GetService("Players")

function CheckpointModule.init()
    Players.PlayerAdded:Connect(function(player)
        local leaderstats = Instance.new("Folder")
        leaderstats.Name = "leaderstats"
        leaderstats.Parent = player

        local stage = Instance.new("IntValue")
        stage.Name = "Stage"
        stage.Value = 1
        stage.Parent = leaderstats

        player.CharacterAdded:Connect(function(character)
            local currentStage = stage.Value
            local checkpoint = workspace.Checkpoints:FindFirstChild(tostring(currentStage))
            if checkpoint then
                character:PivotTo(checkpoint.CFrame + Vector3.new(0, 3, 0))
            end
        end)
    end)
end

return CheckpointModule`
      },
      {
        path: "Workspace/LavaKill.lua",
        desc: "Dokunulduğunda oyuncunun Humanoid canını 0 yaparak anında elenmesini sağlayan tehlikeli zemin kodu.",
        code: `local lavaPart = script.Parent

lavaPart.Touched:Connect(function(hit)
    local character = hit.Parent
    local humanoid = character:FindFirstChildOfClass("Humanoid")
    if humanoid and humanoid.Health > 0 then
        humanoid.Health = 0
    end
end)`
      }
    ]
  },
  {
    id: "roblox-tycoon",
    engine: "roblox",
    genre: "Ekonomi / Tycoon",
    title: "Tycoon (Fabrika / Üretim) Sistemi",
    description: "Dropper (hammadde üreteci), Collector (satış toplayıcı) ve gelir döngüsü.",
    difficulty: "Orta",
    files: [
      {
        path: "ServerScriptService/DropperModule.lua",
        desc: "Belirli aralıklarla hammadde parçaları (Part) üretip konveyör bandına bırakan modül.",
        code: `local DropperModule = {}

function DropperModule.start(spawnerPart, dropTemplate, interval)
    task.spawn(function()
        while true do
            task.wait(interval)
            local drop = dropTemplate:Clone()
            drop.Position = spawnerPart.Position - Vector3.new(0, 1.5, 0)
            drop.Parent = workspace.Drops
            
            -- 30 saniye sonra toplanmazsa bellek için temizle
            task.delay(30, function()
                if drop and drop.Parent then
                    drop:Destroy()
                end
            end)
        end
    end)
end

return DropperModule`
      },
      {
        path: "Workspace/Collector.lua",
        desc: "Hammadde parçaları hazneye düştüğünde değerini oyuncunun kasasına para olarak ekleyen toplayıcı.",
        code: `local collector = script.Parent

collector.Touched:Connect(function(hit)
    if hit:GetAttribute("Value") then
        local value = hit:GetAttribute("Value")
        local ownerId = collector.Parent:GetAttribute("OwnerUserId")
        -- Oyuncunun parasına ekleme yap:
        -- DataService.AddCash(ownerId, value)
        hit:Destroy()
    end
end)`
      }
    ]
  },
  {
    id: "roblox-horror",
    engine: "roblox",
    genre: "Korku / Hayatta Kalma",
    title: "Korku Oyunu: Canavar AI & Jumpscare",
    description: "PathfindingService ile oyuncuyu avlayan canavar yapay zekası ve istemci tarafı jumpscare kamerası.",
    difficulty: "İleri",
    files: [
      {
        path: "ServerScriptService/MonsterAI.lua",
        desc: "En yakındaki oyuncuyu arar, görüş açısındaysa kovalar, engellerin etrafından Pathfinding ile dolanır.",
        code: `local PathfindingService = game:GetService("PathfindingService")
local monster = script.Parent
local humanoid = monster:WaitForChild("Humanoid")
local rootPart = monster:WaitForChild("HumanoidRootPart")

local function findNearestPlayer()
    local nearest = nil
    local minDistance = 60 -- Algılama menzili
    
    for _, player in ipairs(game.Players:GetPlayers()) do
        if player.Character and player.Character:FindFirstChild("HumanoidRootPart") then
            local dist = (player.Character.HumanoidRootPart.Position - rootPart.Position).Magnitude
            if dist < minDistance then
                minDistance = dist
                nearest = player.Character
            end
        end
    end
    return nearest
end

while task.wait(0.5) do
    local target = findNearestPlayer()
    if target then
        local path = PathfindingService:CreatePath()
        path:ComputeAsync(rootPart.Position, target.HumanoidRootPart.Position)
        if path.Status == Enum.PathStatus.Success then
            local waypoints = path:GetWaypoints()
            if #waypoints > 1 then
                humanoid:MoveTo(waypoints[2].Position)
            end
        end
    end
end`
      }
    ]
  },
  {
    id: "roblox-fps",
    engine: "roblox",
    genre: "Aksiyon / FPS",
    title: "FPS Silah Mekaniği & Raycasting",
    description: "Raycast ile mermi tespiti, mermi dağılımı (spread) ve hasar verme sistemi.",
    difficulty: "Orta",
    files: [
      {
        path: "StarterPack/GunHandler.lua",
        desc: "İstemcide farenin baktığı noktaya Raycast fırlatır ve sunucuya hasar talebi iletir.",
        code: `local Tool = script.Parent
local Players = game:GetService("Players")
local player = Players.LocalPlayer
local mouse = player:GetMouse()

Tool.Activated:Connect(function()
    local origin = Tool.Handle.Position
    local target = mouse.Hit.Position
    local direction = (target - origin).Unit

    local rayParams = RaycastParams.new()
    rayParams.FilterDescendantsInstances = {player.Character}
    rayParams.FilterType = RaycastFilterType.Exclude

    local result = workspace:Raycast(origin, direction * 300, rayParams)
    if result and result.Instance then
        local enemyHumanoid = result.Instance.Parent:FindFirstChildOfClass("Humanoid")
        if enemyHumanoid then
            -- RemoteEvent ile sunucuya bildir
            game.ReplicatedStorage.Events.GunHit:FireServer(enemyHumanoid, 25)
        end
    end
end)`
      }
    ]
  },
  {
    id: "unity-architecture",
    engine: "unity",
    genre: "Mimari / Şablon",
    title: "Unity Singleton & Event Bus Oyun İskeleti",
    description: "GameManager, AudioManager, EventBus ve sahne yönetimi için temiz kurumsal Unity mimari şablonu.",
    difficulty: "Orta",
    files: [
      {
        path: "Scripts/Core/GameManager.cs",
        desc: "Oyun durumunu (MainMenu, Playing, Paused, GameOver) yöneten tekil yönetici sınıfı.",
        code: `using System;
using UnityEngine;

public enum GameState { MainMenu, Playing, Paused, GameOver }

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }
    public GameState CurrentState { get; private set; }
    public static event Action<GameState> OnGameStateChanged;

    void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }
        Instance = this;
        DontDestroyOnLoad(gameObject);
    }

    public void UpdateGameState(GameState newState)
    {
        CurrentState = newState;
        switch (newState)
        {
            case GameState.Playing: Time.timeScale = 1f; break;
            case GameState.Paused: Time.timeScale = 0f; break;
            case GameState.GameOver: Time.timeScale = 0.2f; break;
        }
        OnGameStateChanged?.Invoke(newState);
    }
}`
      }
    ]
  },
  {
    id: "godot-template",
    engine: "godot",
    genre: "Mimari / Şablon",
    title: "Godot 4 Bileşen Tabanlı (Component) Varlık İskeleti",
    description: "HealthComponent, HitboxComponent ve HurtboxComponent ile temiz kompozisyon mimarisi.",
    difficulty: "Orta",
    files: [
      {
        path: "components/health_component.gd",
        desc: "Herhangi bir varlığa (Düşman, Oyuncu, Kırılabilir Kutu) sürüklenip bırakılabilen bağımsız can bileşeni.",
        code: `class_name HealthComponent extends Node

signal health_changed(current: float, max: float)
signal died

@export var max_health: float = 100.0
@onready var current_health: float = max_health

func damage(amount: float) -> void:
    current_health = clamp(current_health - amount, 0.0, max_health)
    health_changed.emit(current_health, max_health)
    if current_health <= 0.0:
        died.emit()

func heal(amount: float) -> void:
    current_health = clamp(current_health + amount, 0.0, max_health)
    health_changed.emit(current_health, max_health)`
      }
    ]
  }
];
