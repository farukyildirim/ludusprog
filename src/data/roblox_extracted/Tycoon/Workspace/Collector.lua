-- Collector script: detect DropItem and credit player (requires collector ownership logic)
workspace.ChildAdded:Connect(function(child)
    if child.Name == 'DropItem' then
        wait(2)
        child:Destroy()
    end
end)
