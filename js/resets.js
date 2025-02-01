const RESETS = {
    unnatural: {
        get require() { return false }, 
        reset(force) {
            player.unnatural.unl = true
            gainCurrency('unnatural',tmp.currency_gain.unnatural)

            unlockAchievement("ach12")

            if (player.unnatural.total.gte(1e4)) {
                player.unnatural.anti_time = player.unnatural.anti_time.add(tmp.unnatural_speed)

                if (getAntiUnnaturalGrowth().gte(player.unnatural.total)) {
                    doReset('exotic',true)

                    return
                }
            }

            this.doReset()
        },
        doReset() {
            player.matter = E(0)
            player.best_matter = E(0)
            player.antimatter_time = E(0)

            resetUpgrades("M")
        },
    },
    exotic: {
        get require() { return false }, 
        reset(force) {
            player.exotic.unl = true
            gainCurrency('exotic',tmp.currency_gain.exotic)
            
            unlockAchievement("ach15")

            if (player.exotic.total.gte(1e9)) {
                player.exotic.anti_time = player.exotic.anti_time.add(1)

                if (getAntiExoticGrowth().gte(player.exotic.total)) {
                    doReset('dark',true)

                    return
                }
            }

            this.doReset()
        },
        doReset() {
            player.unnatural.matter = E(0)
            player.unnatural.total = E(0)
            player.unnatural.anti_time = E(0)

            resetUpgrades("UM",['UM3'])

            RESETS.unnatural.doReset()
        },
    },
    dark: {
        get require() { return false }, 
        reset(force) {
            player.dark.unl = true
            gainCurrency('dark',tmp.currency_gain.dark)

            unlockAchievement("ach25")
            if (!hasUpgrade("EM4")) unlockAchievement("ach26")

            /*
            if (player.unnatural.total.gte(1e9)) {
                player.exotic.anti_time = player.exotic.anti_time.add(1)
            }
            */

            this.doReset()
        },
        doReset() {
            player.exotic.matter = E(0)
            player.exotic.total = E(0)
            player.exotic.anti_time = E(0)

            let keep = ['EM5']
            if (hasAchievement("ach26")) keep.push("EM4")
            resetUpgrades("EM",keep)

            RESETS.exotic.doReset()
        },
    },
}

function doReset(id, force, ...arg) {
    var r = RESETS[id]
    if (force || r.require) r.reset(force, ...arg);
    else if (r.require && confirm("确定要重置吗？")) r.reset(false, ...arg);
    updateTemp()
}
