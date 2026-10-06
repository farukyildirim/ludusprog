local Crafting = {}
Crafting.recipes = {
    wood_plank = { require = { wood = 2 } }
}
function Crafting.CanCraft(inventory, item)
    -- check inventory
    return true
end
return Crafting
