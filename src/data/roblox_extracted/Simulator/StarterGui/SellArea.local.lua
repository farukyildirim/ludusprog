-- LocalScript for sell button UI (example)
local player = game.Players.LocalPlayer
local screen = Instance.new('ScreenGui', player:WaitForChild('PlayerGui'))
local btn = Instance.new('TextButton', screen)
btn.Size = UDim2.new(0,150,0,50)
btn.Position = UDim2.new(0,10,0,70)
btn.Text = 'Sell Coins'
btn.MouseButton1Click:Connect(function()
    game.ReplicatedStorage:WaitForChild('SellEvent'):FireServer()
end)
