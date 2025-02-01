const CURRENCIES = {
    matter: {
        get amount() { return player.matter },
        set amount(v) { player.matter = v.max(0) },

        get best() { return player.best_matter },
        set best(v) { player.best_matter = v.max(0) },

        name: "物质",
    
        get gain() {
            if (!hasUpgrade('M1')) return E(0)

            let x = E(1)

            x = x.mul(upgradeEffect('M2')).mul(tmp.unnatural_boost).mul(tmp.exotic_boost[0]).mul(tmp.dark_boost[0])

            if (hasUpgrade('M7')) x = x.pow(upgradeEffect('M7'));
            if (hasUpgrade('DM1')) x = x.pow(upgradeEffect('DM1'));
            if (hasAchievement('ach13')) x = x.pow(1.05);

            x = x.pow(tmp.exotic_boost[1])

            if (hasUpgrade("M10")) x = expPow(x,1.05);
            if (hasUpgrade("DM4")) x = expPow(x,tmp.exotic_boost[1])

            x = expPow(x,upgradeEffect("M11"))

           x = x.addTP(upgradeEffect("DM8",0))

            let ss = Decimal.iteratedexp(10,3,Decimal.add(10,upgradeEffect("EM7",0)))

            tmp.matter_overflow_start = ss

            x = x.overflow(ss,0.75,2)

            if (x.gte("10 TP 1")) {
                x = Decimal.tetrate(10, x.slog(10).div(10).root(2).mul(10))
            }

            return x
        },
    },
    unnatural: {
        get amount() { return player.unnatural.matter },
        set amount(v) { player.unnatural.matter = v.max(0) },

        get total() { return player.unnatural.total },
        set total(v) { player.unnatural.total = v.max(0) },

        name: "非自然物质",
    
        get gain() {
            if (player.best_matter.lt(1e3)) return E(0)

            let base = player.best_matter.div(1e2).slog(10)
            let exp = hasUpgrade("EM3") ? 2 : 1
            
            let x = base.pow(exp).sub(1).pow_base(10)
            if (tmp.dark_penalty[0]) x = Decimal.tetrate(10,base.root(2).sub(1)).pow(exp).sub(1).pow_base(10).add(x)

            x = x.mul(simpleUpgradeEffect('M5')).mul(upgradeEffect('UM1')).mul(tmp.exotic_boost[0]).mul(tmp.dark_boost[0])

            if (hasAchievement('ach24')) x = x.pow(1.05);
            x = x.pow(tmp.dark_boost[1])

            x = expPow(x,upgradeEffect("UM12"));

            return x.floor()
        },

        get passive() { return hasUpgrade("EM4") ? Decimal.mul(tmp.unnatural_speed,getEM4Rate()) : 0 },
    },
    exotic: {
        get amount() { return player.exotic.matter },
        set amount(v) { player.exotic.matter = v.max(0) },

        get total() { return player.exotic.total },
        set total(v) { player.exotic.total = v.max(0) },

        name: "奇异物质",
    
        get gain() {
            if (player.unnatural.total.lt(1e4)) return E(0)

            let x = expPow(player.unnatural.total.div(1e4),0.5)
            
            if (x.gte(1e100)) {
                x = x.log10().div(100).log10().add(1).sqrt().log10().add(1).sqrt().mul(100).pow_base(10)
            }
            
            x = x.mul(simpleUpgradeEffect('UM5')).mul(upgradeEffect('EM2')).mul(tmp.dark_boost[0])

            if (tmp.dark_penalty[0]) x = x.pow(0.6);

            if (hasAchievement('ach33')) x = x.pow(1.05);

            if (x.gte('e1000')) {
                x = Decimal.pow(10, x.log10().div(1e3).slog(10).add(1).mul(1e3))
            }

            return x.floor()
        },

        get passive() { return hasUpgrade("DM5") ? Decimal.mul(1,getDM5Rate()) : 0 },
    },
    dark: {
        get amount() { return player.dark.matter },
        set amount(v) { player.dark.matter = v.max(0) },

        get total() { return player.dark.total },
        set total(v) { player.dark.total = v.max(0) },

        name: "暗物质",
    
        get gain() {
            if (player.exotic.total.lt(1e9)) return E(0)

            let x = expPow(player.exotic.total.div(1e9),1/3).mul(upgradeEffect('DM3'))

            if (tmp.dark_penalty[2]) x = x.mul(player.antimatter_time.add(1).root(2));

            return x.floor()
        },

        passive: 0,
    },
    meta: {
        get amount() { return player.meta.matter },
        set amount(v) { player.meta.matter = v.max(0) },

        get best() { return player.meta.best },
        set best(v) { player.meta.best = v.max(0) },

        name: "元物质",

        get gain() {
            if (!hasUpgrade("MM1")) return E(0)

            let x = E(0.1)

            if (hasUpgrade("MM2")) x = x.add(this.amount.mul(UPGRADES["MM2"].base));
            if (hasAchievement("ach42")) x = x.mul(10);

            x = x.addTP(upgradeEffect("MM6",0))

            return x.min("1e308 TP 1")
        },
    },
}

function setupCurrencies() {
    
}

function gainCurrency(id,amt) {
    var curr = CURRENCIES[id]
    curr.amount = curr.amount.add(amt)
    if ('total' in curr) curr.total = curr.total.add(amt);
    if ('best' in curr) curr.best = curr.best.max(curr.amount);
}