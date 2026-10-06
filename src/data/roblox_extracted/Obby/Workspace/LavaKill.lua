-- Attach this script to a lava part
local part = script.Parent
part.Touched:Connect(function(hit)
    local hum = hit.Parent:FindFirstChild('Humanoid')
    if hum then hum.Health = 0 end
end)
