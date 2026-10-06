-- CheckpointModule: simple checkpoint handling
local Checkpoint = {}
function Checkpoint.Setup(part, stageIndex)
    part:SetAttribute("StageIndex", stageIndex)
    part.Touched:Connect(function(hit)
        local player = game.Players:GetPlayerFromCharacter(hit.Parent)
        if player then
            player:SetAttribute("Stage", stageIndex)
        end
    end)
end
return Checkpoint
