-- Simple dropper: creates Parts periodically under parent DropPoint
local Dropper = {}
function Dropper.Start(dropPoint, interval)
    spawn(function()
        while wait(interval or 1) do
            local p = Instance.new('Part')
            p.Size = Vector3.new(1,1,1)
            p.CFrame = dropPoint.CFrame + Vector3.new(0,2,0)
            p.Name = 'DropItem'
            p.Parent = workspace
        end
    end)
end
return Dropper
