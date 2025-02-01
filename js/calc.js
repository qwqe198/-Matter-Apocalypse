function calc(dt) {
    if (hasUpgrade("O9")) return;

    for (let [i,v] of Object.entries(CURRENCIES)) {
        var passive = v.passive ?? 1
        gainCurrency(i, tmp.currency_gain[i].mul(dt).mul(passive))
    }

    if (player.meta.unl) {
        
    } else {
        if (player.best_matter.gte(1e3)) {
            player.antimatter_time = player.antimatter_time.add(Decimal.mul(dt,antimatterGrowthSpeed()))
    
            if ((!hasUpgrade("EM4") || tmp.dark_penalty[2]) && getAntimatterGrowth().gte(player.matter)) {
                doReset(tmp.dark_penalty[2] ? 'dark' : 'unnatural',true)
            }
        }
    
        if (hasUpgrade("EM4") && player.unnatural.total.gte(1e4)) {
            player.unnatural.anti_time = player.unnatural.anti_time.add(Decimal.mul(dt,tmp.unnatural_speed).mul(getEM4Rate()))
    
            if (!hasUpgrade("DM5") && getAntiUnnaturalGrowth().gte(player.unnatural.total)) {
                doReset('exotic',true)
            }
        }
    
        if (hasUpgrade("DM5") && player.exotic.total.gte(1e9)) {
            player.exotic.anti_time = player.exotic.anti_time.add(Decimal.mul(dt,getDM5Rate()))
        }
    }

    let au = player.auto_upgs
    for (let id of tmp.auto_upg) if (!(id in au) || au[id]) buyUpgrade(id, false, true);

    player.time_played += dt

    checkAchievements();
}