local remote = Instance.new('RemoteEvent', game.ReplicatedStorage)
remote.Name = 'FireGunEvent'
remote.OnServerEvent:Connect(function(player, origin, direction)
    local result = workspace:Raycast(origin, direction)
    if result and result.Instance and result.Instance.Parent:FindFirstChild('Humanoid') then
        result.Instance.Parent.Humanoid:TakeDamage(20)
    end
end)
