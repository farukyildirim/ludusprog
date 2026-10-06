-- LocalScript to show player's current stage (requires attribute 'Stage' on player)
local player = game.Players.LocalPlayer
local screen = Instance.new('ScreenGui', player:WaitForChild('PlayerGui'))
local label = Instance.new('TextLabel', screen)
label.Size = UDim2.new(0,200,0,50)
label.Position = UDim2.new(0,10,0,10)
label.BackgroundTransparency = 0.5
label.Text = 'Stage: 1'
player:GetAttributeChangedSignal('Stage'):Connect(function()
    local s = player:GetAttribute('Stage') or 1
    label.Text = 'Stage: '..tostring(s)
end)
