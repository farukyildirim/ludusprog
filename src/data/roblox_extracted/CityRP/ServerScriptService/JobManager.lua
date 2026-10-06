local JobManager = {}
function JobManager.GivePay(player, amount)
    local ls = player:FindFirstChild('leaderstats')
    if ls and ls:FindFirstChild('Money') then
        ls.Money.Value = ls.Money.Value + amount
    end
end
return JobManager
