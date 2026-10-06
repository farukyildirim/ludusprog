local PathfindingService = game:GetService('PathfindingService')
local monster = workspace:FindFirstChild('Monster') -- add a model named Monster with Humanoid
if not monster then return end
local humanoid = monster:FindFirstChild('Humanoid')
while wait(1) do
    local players = game.Players:GetPlayers()
    local targetP = players[1]
    if targetP and targetP.Character and targetP.Character:FindFirstChild('HumanoidRootPart') then
        local start = monster.HumanoidRootPart.Position
        local goal = targetP.Character.HumanoidRootPart.Position
        local path = PathfindingService:CreatePath()
        path:ComputeAsync(start, goal)
        for _, waypoint in ipairs(path:GetWaypoints()) do
            humanoid:MoveTo(waypoint.Position)
            humanoid.MoveToFinished:Wait()
        end
    end
end
