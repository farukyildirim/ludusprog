-- LocalScript example: play jumpscare (graphic + sound)
local player = game.Players.LocalPlayer
local gui = Instance.new('ScreenGui', player:WaitForChild('PlayerGui'))
local img = Instance.new('ImageLabel', gui)
img.Size = UDim2.new(1,0,1,0)
img.Visible = false
img.Image = '' -- set to jumpscare image
local sound = Instance.new('Sound', player.Character or player)
sound.SoundId = '' -- set to jumpscare sound
-- To play: img.Visible = true; sound:Play(); wait(1); img.Visible = false
