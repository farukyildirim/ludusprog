local LapManager = {}
function LapManager.TouchCheckpoint(player)
    local ls = player:FindFirstChild('leaderstats')
    if ls and ls:FindFirstChild('Lap') then
        ls.Lap.Value = ls.Lap.Value + 1
    end
end
return LapManager
