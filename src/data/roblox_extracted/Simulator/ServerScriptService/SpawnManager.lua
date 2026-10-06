                -- Simple coin spawn manager (server)
                local spawnFolder = workspace:FindFirstChild('CoinSpawns') or Instance.new('Folder', workspace)
                spawnFolder.Name = 'CoinSpawns'
                while wait(2) do
                    for _, spawn in pairs(spawnFolder:GetChildren()) do
                        local coin = Instance.new('Part')
                        coin.Name = 'Coin'
                        coin.Size = Vector3.new(1,1,0.2)
                        coin.CFrame = spawn.CFrame + Vector3.new(0,2,0)
                        coin.Anchored = false
                        coin.Parent = workspace
                        local scriptObj = Instance.new('Script', coin)
                        scriptObj.Source = [[
local coin = script.Parent
coin.Touched:Connect(function(hit)
    local player = game.Players:GetPlayerFromCharacter(hit.Parent)
    if player then
        local ls = player:FindFirstChild('leaderstats')
        if ls and ls:FindFirstChild('Coins') then
            ls.Coins.Value = ls.Coins.Value + 1
        end
        coin:Destroy()
    end
end)
]]
                    end
                end
