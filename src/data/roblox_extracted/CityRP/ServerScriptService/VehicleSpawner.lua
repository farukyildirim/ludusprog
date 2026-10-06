-- Simple vehicle spawner template: clone a Vehicle model from ServerStorage
local storage = game:GetService('ServerStorage')
local vehicle = storage:FindFirstChild('VehicleTemplate')
if vehicle then
    game.Players.PlayerAdded:Connect(function(player)
        -- spawn logic
    end)
end
