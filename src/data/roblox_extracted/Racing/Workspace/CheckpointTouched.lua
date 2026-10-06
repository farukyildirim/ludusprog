script.Parent.Touched:Connect(function(hit)
    local plr = game.Players:GetPlayerFromCharacter(hit.Parent)
    if plr then
        game.ServerScriptService.LapManager.TouchCheckpoint(plr)
    end
end)
