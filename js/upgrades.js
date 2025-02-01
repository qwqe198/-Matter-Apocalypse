const UPGRADES = {
    'M1': {
        max: 1,
        unl: ()=>true,

        desc: `每秒生成 <b>1</b> 物质。`,
        curr: "matter",

        cost: E(0),

        on_buy() { unlockAchievement("ach11") },
    },
    'M2': {
        unl: ()=>hasUpgrade('M1'),

        get pow() { return Decimal.add(1, upgradeEffect('M3',0)).mul(getAchievementBoost()) },
        get base() { return Decimal.add(2, upgradeEffect('M4',0)) },

        get desc() {
            let pow = this.pow
            return `每级增加物质生成 <b>${formatMult(this.base)}</b>${pow > 1 ? `<sup>${format(pow,3)}</sup>` : ""}。`
        },
        curr: "matter",

        get scaling() {
            let x = Decimal.add(10,upgradeEffect("UM8",0))
            return x
        },

        cost(a) {
            let b = this.scaling

            if (a.gte(b)) a = a.sub(b.sub(1)).sumBase(1.1).add(b.sub(1));

            return a.pow_base(2).pow_base(2)
        },
        bulk(a) {
            let b = this.scaling

            a = a.log(2).log(2)

            if (a.gte(b)) a = a.sub(b.sub(1)).sumBase(1.1,true).add(b.sub(1));

            return a.floor().add(1)
        },

        effect(a) {
            a = a.mul(upgradeEffect("M12"))
            let x = Decimal.pow(this.base,a.pow(this.pow))
            return x
        },
        effDesc: x => formatMult(x),
    },
    'M3': {
        unl: ()=>hasUpgrade('M2',3),

        get base() { return Decimal.add(0.5, upgradeEffect('M6',0)) },

        get desc() {
            let base = this.base
            return `每平方根级增加 <b>M2</b> 的等级效果指数 <b>+${format(base)}</b>。`
        },
        curr: "matter",

        get scaling() {
            let x = E(10)
            if (hasUpgrade("UM9")) x = x.add(Decimal.div(upgradeEffect("UM8",0),2))
            return x
        },

        cost(a) { return a.scale(this.scaling,2,"P").pow_base(2).pow_base(100) },
        bulk(a) { return a.log(100).log(2).scale(this.scaling,2,"P",true).floor().add(1) },

        effect(a) {
            a = a.mul(upgradeEffect("M12"))
            let x = a.root(2).mul(this.base)
            return x
        },
        effDesc: x => "+"+format(x,3),
    },
    'M4': {
        unl: ()=>hasUpgrade('M3') && player.unnatural.unl,

        get base() { return Decimal.add(0.5, upgradeEffect('M6',0)) },

        get desc() {
            let base = this.base
            return `每级增加 <b>M2</b> 的基础值 <b>+${format(base)}</b>。`
        },
        curr: "matter",

        cost: a => a.sumBase(2).pow_base(1e10).mul(1e50),
        bulk: a => a.div(1e50).log(1e10).sumBase(2,true).floor().add(1),

        effect(a) {
            a = a.mul(upgradeEffect("M12"))
            let x = a.mul(this.base)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    'M5': {
        max: 1,
        unl: ()=>hasUpgrade('M4'),

        desc: `物质提升非自然物质获取，但以相同速率加速反物质的增长。`,
        curr: "matter",

        cost: 1e150,

        effect(a) {
            let x = player.matter.add(1).slog(10).add(1)
            if (hasUpgrade('M8')) x = x.pow(Decimal.add(2,upgradeEffect("M9",0)))
            return x
        },
        effDesc: x => formatMult(x),
    },
    'M6': {
        unl: ()=>hasUpgrade('M5'),

        get base() { return Decimal.mul(0.1,hasUpgrade("UM10")?getAchievementBoost():1) },

        get desc() {
            let base = this.base
            return `每${hasUpgrade("DM2") ? "" : hasUpgrade("UM6") ? "平方根" : "立方根"}级增加 <b>M3</b> 和 <b>M4</b> 的基础值 <b>+${format(base)}</b>。`
        },
        curr: "matter",

        cost: a => a.scale(1e4,2,"P",false,tmp.dark_penalty[1]).sumBase(2).pow_base('e800').mul('e400'),
        bulk: a => a.div('e400').log('e800').sumBase(2,true).scale(1e4,2,"P",true,tmp.dark_penalty[1]).floor().add(1),

        effect(a) {
            a = a.mul(upgradeEffect("M12"))
            let x = a.root(hasUpgrade("DM2") ? 1.5 : hasUpgrade("UM6") ? 2 : 3).mul(this.base)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    'M7': {
        max: 1,
        unl: ()=>hasUpgrade('M6'),

        desc: `反物质增长时间以降低的速率提升物质生成。`,
        curr: "matter",

        cost: E('e5555'),

        effect(a) {
            let x = player.antimatter_time.add(1).log10().div(8).add(1)
            return x
        },
        effDesc: x => formatPow(x,3),
    },
    'M8': {
        max: 1,
        unl: ()=>hasUpgrade('M7'),

        get base() { return Decimal.add(2,upgradeEffect("M9")) },

        get desc() { return `<b>M5</b> 的效果提升至 <b>${format(this.base)}</b> 次方。` },
        curr: "matter",

        cost: E('e1.8e4'),
    },
    'M9': {
        max: 100,
        unl: ()=>player.exotic.unl&&hasUpgrade('M8'),

        get base() { return Decimal.add(0.5,0) },

        get desc() {
            let base = this.base
            return `每级增加 <b>M8</b> 的基础值 <b>+${format(base)}</b>。`
        },
        curr: "matter",

        cost: a => a.sumBase(1.1).pow_base(10).mul(1e36).pow_base(10),
        bulk: a => a.log(10).div(1e36).log(10).sumBase(1.1,true).floor().add(1),

        effect(a) {
            a = a.mul(upgradeEffect("M12"))
            let x = a.mul(this.base)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "M10": {
        max: 1,
        unl: ()=>hasUpgrade('M9'),

        desc: `物质生成的指数提升至 <b>1.05</b> 次方。`,
        curr: "matter",

        cost: E('ee200'),
    },
    'M11': {
        unl: ()=>hasUpgrade('M10') && player.dark.unl,

        desc: `每级增加物质生成的指数 <b>^1.1</b>。`,
        curr: "matter",

        cost: a => a.sumBase(1.1).pow_base(1.5).mul(10000).pow_base(10).pow_base(10),
        bulk: a => a.log(10).log(10).div(10000).log(1.5).sumBase(1.1,true).floor().add(1),

        effect(a) {
            a = a.mul(upgradeEffect("M12"))
            let x = Decimal.pow(1.1,a)
            return x
        },
        effDesc: x => formatPow(x),
    },
    'M12': {
        unl: ()=>hasUpgrade('M11'),

        desc: `所有之前的 <b>M*</b> 可重复升级效果 <b>+100%</b> 更强。`,
        curr: "matter",

        cost: a => a.sumBase(1.1).pow_base(1e3).mul(1e27).pow_base(10).pow_base(10),
        bulk: a => a.log(10).log(10).div(1e27).log(1e3).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = a.add(1)
            return x
        },
        effDesc: x => formatMult(x),
    },

    "UM1": {
        unl: ()=>true,

        get base() { return Decimal.add(2, upgradeEffect('UM7',0)) },

        get desc() {
            return `每级增加非自然物质获取 <b>${formatMult(this.base)}</b>。`
        },
        curr: "unnatural",

        cost: a => a.sumBase(1.1).pow_base(10).mul(10),
        bulk: a => a.div(10).log(10).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = Decimal.pow(this.base,a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "UM2": {
        max: 1,
        unl: ()=>hasUpgrade('UM1'),

        desc: `增加基于物质的非自然物质提升物质生成的指数。`,
        curr: "unnatural",

        cost: 1e2,

        effect(a) {
            let x = player.matter.add(1).log10().add(1).log10().add(1).log10().mul(2)
            if (x.gt(1) && hasUpgrade("EM1")) x = x.pow(2);
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "UM3": {
        max: 1,
        unl: ()=>hasUpgrade('UM2'),

        desc: `自动购买 <b>M*</b> 升级，无需消耗货币。`,
        curr: "unnatural",

        cost: 1e3,
    },
    "UM4": {
        max: 1,
        unl: ()=>hasUpgrade('UM3'),

        desc: `增加基于总非自然物质的非自然物质提升物质生成的指数。`,
        curr: "unnatural",

        cost: 1e4,

        effect(a) {
            let x = player.unnatural.total.add(1).log10().div(3)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "UM5": {
        max: 1,
        unl: ()=>player.exotic.unl && hasUpgrade('UM4'),

        desc: `总非自然物质提升奇异物质获取，但以相同速率加速自然物质的增长。`,
        curr: "unnatural",

        cost: 1e9,

        effect(a) {
            let x = player.unnatural.total.add(1).log(1e3).add(1)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "UM6": {
        max: 1,
        unl: ()=>hasUpgrade('UM5'),

        desc: `改进 <b>M6</b> 的效果和成就的提升。`,
        curr: "unnatural",

        cost: 1e12,
    },
    "UM7": {
        unl: ()=>hasUpgrade('UM6'),

        get base() { return 0.5 },

        get desc() {
            let base = this.base
            return `每级增加 <b>UM1</b> 的基础值 <b>+${format(base)}</b>。`
        },
        curr: "unnatural",

        cost: a => a.sumBase(1.1).pow_base(1e3).mul(1e27),
        bulk: a => a.div(1e27).log(1e3).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = Decimal.mul(this.base,a)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "UM8": {
        unl: ()=>hasUpgrade('UM7'),

        desc: `每级延迟 <b>M2</b> 的首次缩放 <b>+10</b>（通常为 10）。`,
        curr: "unnatural",

        cost: a => a.sumBase(1.1).pow_base(10).mul(1e40),
        bulk: a => a.div(1e40).log(10).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = Decimal.mul(10,a)
            return x
        },
        effDesc: x => "+"+format(x,0),
    },
    "UM9": {
        max: 1,
        unl: ()=>hasUpgrade('UM8') && player.dark.unl,

        desc: `<b>UM8</b> 现在以 50% 的速率影响 <b>M3</b> 的缩放。`,
        curr: "unnatural",

        cost: 1e130,
    },
    "UM10": {
        max: 1,
        unl: ()=>hasUpgrade('UM9'),

        desc: `成就的提升现在影响 <b>M6</b> 的基础值。`,
        curr: "unnatural",

        cost: 1e270,
    },
    "UM11": {
        max: 1,
        unl: ()=>hasUpgrade('UM10'),

        desc: `总非自然物质提升以四次方方式改进。`,
        curr: "unnatural",

        cost: E('e3750'),
    },
    "UM12": {
        unl: ()=>hasUpgrade('UM11'),

        desc: `每级平方非自然物质的指数。`,
        curr: "unnatural",

        cost: a => a.sumBase(1.1).pow_base(3).mul(150).pow_base(10).pow_base(10),
        bulk: a => a.log(10).log(10).div(150).log(3).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = Decimal.pow(2,a)
            return x
        },
        effDesc: x => formatPow(x,0),
    },

    "EM1": {
        max: 1,
        unl: ()=>true,

        desc: `<b>UM2</b> 的效果在 <b>+1</b> 以上时平方。`,
        curr: "exotic",

        cost: 1e2,
    },
    "EM2": {
        unl: ()=>hasUpgrade("EM1"),

        get base() { return Decimal.add(2, upgradeEffect("EM8",0)) },

        get desc() {
            return `每级增加奇异物质获取 <b>${formatMult(this.base)}</b>。`
        },
        curr: "exotic",

        cost: a => a.sumBase(1.1).pow_base(10).mul(1e3),
        bulk: a => a.div(1e3).log(10).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = Decimal.pow(this.base,a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "EM3": {
        max: 1,
        unl: ()=>hasUpgrade("EM2"),

        desc: `改进非自然物质获取。`,
        curr: "exotic",

        cost: 5e3,
    },
    "EM4": {
        max: 1,
        unl: ()=>hasUpgrade("EM3"),

        desc: `<span style="font-size: 0.9em;">以受速度影响的速率被动生成物质湮灭时获得的 <b>10%</b> 非自然物质。
        然而，你仍然以相同的速率生成自然物质的增长时间。
        反物质将不再增长，除了时间。</span>`,
        curr: "exotic",

        cost: 1e6,
    },
    "EM5": {
        max: 1,
        unl: ()=>hasUpgrade("EM4"),

        desc: `自动购买 <b>UM*</b> 升级，无需消耗货币。`,
        curr: "exotic",

        cost: 1e7,
    },
    "EM6": {
        max: 1,
        unl: ()=>hasUpgrade("EM5"),

        desc: `奇异物质提升平方。`,
        curr: "exotic",

        cost: 1e9,
    },
    "EM7": {
        unl: ()=>hasUpgrade("EM6") && tmp.dark_penalty[1],

        get base() { return 1 },

        get desc() {
            return `每级延迟第二次黑暗惩罚中物质生成的溢出 <b>${formatMult(this.base)}</b> OoM^3。`
        },
        curr: "exotic",

        cost: a => a.sumBase(1.1).pow_base(2).mul(1e18),
        bulk: a => a.div(1e18).log(2).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = Decimal.mul(this.base,a)
            if (hasUpgrade("DM7")) x = x.sqr();
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "EM8": {
        unl: ()=>hasUpgrade('EM7'),

        get base() { return 0.5 },

        get desc() {
            let base = this.base
            return `每级增加 <b>EM2</b> 的基础值 <b>+${format(base)}</b>。`
        },
        curr: "exotic",

        cost: a => a.sumBase(1.1).pow_base(1e3).mul(1e30),
        bulk: a => a.div(1e30).log(1e3).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = Decimal.mul(this.base,a)
            return x
        },
        effDesc: x => "+"+format(x),
    },

    "DM1": {
        max: 1,
        unl: ()=>true,

        desc: `总非自然物质提供物质生成的指数提升。`,
        curr: "dark",

        cost: 1,

        effect(a) {
            let x = expPow(CURRENCIES.unnatural.total.add(1),1.5)
            return x
        },
        effDesc: x => formatPow(x),
    },
    "DM2": {
        max: 1,
        unl: ()=>hasUpgrade("DM1"),

        desc: `改进 <b>M6</b> 的效果。`,
        curr: "dark",

        cost: 5,
    },
    "DM3": {
        unl: ()=>hasUpgrade("DM2"),

        get base() { return Decimal.add(2, 0) },

        get desc() {
            return `每级增加暗物质获取 <b>${formatMult(this.base)}</b>。`
        },
        curr: "dark",

        cost: a => a.sumBase(1.1).pow_base(10).mul(10),
        bulk: a => a.div(10).log(10).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = Decimal.pow(this.base,a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "DM4": {
        max: 1,
        unl: ()=>hasUpgrade("DM3"),

        desc: `奇异物质的第二次提升现在影响物质生成的指数。奇异物质提升再次平方。`,
        curr: "dark",

        cost: 250,
    },
    "DM5": {
        max: 1,
        unl: ()=>hasUpgrade("DM4"),

        desc: `<span style="font-size: 0.9em;">以受速度影响的速率被动生成非自然物质湮灭时获得的 <b>10%</b> 奇异物质。
        自然和腐化物质将不再增长，除了时间。
        然而，此升级会导致黑暗惩罚。</span>`,
        curr: "dark",

        cost: 1e3,

        on_buy() {
            player.antimatter_time = E(0)
        },
    },
    "DM6": {
        max: 1,
        unl: ()=>hasUpgrade("DM5"),

        desc: `自动购买 <b>EM*</b> 升级，无需消耗货币。`,
        curr: "dark",

        cost: 1e4,
    },
    "DM7": {
        max: 1,
        unl: ()=>hasUpgrade("DM6"),

        desc: `<b>EM7</b> 的效果平方。`,
        curr: "dark",

        cost: 1e5,
    },
    "DM8": {
        max: 54,
        unl: ()=>hasUpgrade("DM7"),

        desc: `每平方级增加物质生成的塔高 <b>+1</b>。`,
        curr: "dark",

        cost: a => a.pow_base(9).mul(1e12),
        bulk: a => a.div(1e12).log(9).floor().add(1),

        effect(a) {
            let x = a.pow(2)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "DM9": {
        max: 1,
        unl: ()=>hasUpgrade("DM8"),

        get desc() { return `进入 <b>物质宇宙</b>，清除所有物质及其特性，并用 <b>元物质</b> 替换物质。
            物质和湮灭标签，以及所有之前的升级和提升都被禁用。
            元物质根据物质计算。你无法撤销！` },
        curr: "dark",

        cost: 1e63,// 1e63,

        on_buy() {
            prevent_save = true
            document.body.style.opacity = 0

            setTimeout(()=>{
                player.meta.unl = true

                player.dark.matter = E(0)
                player.dark.total = E(0)
                resetUpgrades("DM")

                RESETS.dark.doReset()

                updateTemp()

                prevent_save = false
                document.body.style.opacity = 1

                switchTab(2)
            }, 2500)
        },
    },

    "MM1": {
        max: 1,
        unl: ()=>true,

        desc: `每秒生成 <b>0.1</b> 元物质。`,
        curr: "meta",

        cost: E(0),
    },
    'MM2': {
        max: 1,
        unl: ()=>hasUpgrade('MM1'),

        get base() { return Decimal.mul(0.1,upgradeEffect("MM3")) },

        get desc() { return `元物质以 <b>${formatPercent(this.base)}</b> 的速率增加到元物质生成的基础值。` },
        curr: "meta",

        cost: E(1),
    },
    "MM3": {
        unl: ()=>hasUpgrade("MM2"),

        get base() { return Decimal.mul(2,1) },
        get pow() { return Decimal.mul(upgradeEffect("O1"),simpleUpgradeEffect("MM4",1)) },

        get desc() {
            let p = this.pow
            return `每级增加 <b>MM2</b> 的基础值 <b>${formatMult(this.base)}</b>${p == 1 ? "" : `<sup>${format(p,3)}</sup>`}。`
        },
        curr: "meta",

        cost: a => a.pow_base(2).pow_base(1e2),
        bulk: a => a.log(1e2).log(2).floor().add(1),

        effect(a) {
            let x = this.base.pow(a.pow(this.pow))
            return x
        },
        effDesc: x => formatMult(x),
    },
    'MM4': {
        max: 1,
        unl: ()=>hasUpgrade('MM3'),

        get desc() { return `最佳元物质以降低的速率增加 <b>MM2</b> 的等级效果指数。` },
        curr: "meta",

        cost: E('ee5'),

        effect(a) {
            let d = Decimal.div(0.317,upgradeEffect("MM5"))
            let b = player.meta.best.add(10).log10().log10()
            let x = b.div(b.pow(d)).add(1)
            if (hasUpgrade("O3")) x = x.pow(upgradeEffect("O1"));
            if (hasUpgrade("O4")) x = x.pow(upgradeEffect("MM5"));
            return x
        },
        effDesc: x => formatMult(x),
    },
    'MM5': {
        unl: ()=>hasUpgrade('MM4'),

        get base() { return Decimal.mul(2,1) },
        get pow() { return Decimal.mul(1,hasUpgrade("O5")?upgradeEffect("O1"):1) },

        get desc() {
            let p = this.pow
            return `每级使 <b>MM4</b> 的效果 <b>${formatMult(this.base)}</b> 更强${p == 1 ? "" : `<sup>${format(p,3)}</sup>`}。`
        },
        curr: "meta",

        cost: a => a.pow_base(2.5).pow_base(1e3).pow_base(10).pow_base(10),
        bulk: a => a.log(10).log(10).log(1e3).log(2.5).floor().add(1),

        effect(a) {
            let x = this.base.pow(a.pow(this.pow))
            return x
        },
        effDesc: x => formatMult(x),
    },
    "MM6": {
        unl: ()=>hasUpgrade("MM5"),

        get base() { return Decimal.mul(0.1,simpleUpgradeEffect("O8")) },
        get pow() { return Decimal.add(1,upgradeEffect("O6",0)).mul(hasAchievement("ach44")?getAchievementBoost():1) },

        get desc() {
            let p = this.pow
            return `每级增加元物质生成的塔高 <b>+${format(this.base)}</b>${p == 1 ? "" : `<sup>${format(p,3)}</sup>`}。`
        },
        curr: "meta",

        cost: a => Decimal.tetrate(5e2, a.sumBase(1.1).add(7)),
        bulk: a => a.slog(5e2).sub(7).sumBase(1.1,true).add(1).floor(),

        effect(a) {
            let x = this.base.mul(a.pow(this.pow))
            return x
        },
        effDesc: x => "+"+format(x),
    },

    "O1": {
        max: 5,
        unl: ()=>hasUpgrade('MM3'),

        get base() { return Decimal.mul(2,1) },

        get desc() { return `重置所有之前的，但每级增加 <b>MM2</b> 的等级效果指数 <b>${formatMult(this.base)}</b>。` },
        curr: "meta",

        cost(a) { return Decimal.tetrate(Number.MAX_VALUE, a.add(1)) },
        bulk(a) { return a.slog(Number.MAX_VALUE).floor() },

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),

        on_buy() {
            player.meta.matter = E(0)
            player.meta.best = E(0)

            resetUpgrades("MM")
        }
    },
    "O2": {
        max: 1,
        unl: ()=>hasUpgrade('O1'),

        desc: `自动购买 <b>MM*</b> 升级，无需消耗货币。`,
        curr: "meta",

        cost: E('ee100'),
    },
    "O3": {
        max: 1,
        unl: ()=>hasUpgrade('O2'),

        desc: `<b>O1</b> 升级影响 <b>MM4</b> 的强度。`,
        curr: "meta",

        cost: E('eee1000'),
    },
    "O4": {
        max: 1,
        unl: ()=>hasUpgrade('O3'),

        desc: `<b>MM5</b> 升级提升 <b>MM4</b> 的效果。`,
        curr: "meta",

        cost: E('5 PT 3'),
    },
    "O5": {
        max: 1,
        unl: ()=>hasUpgrade('O4'),

        desc: `<b>O1</b> 升级也影响 <b>MM5</b> 的指数。`,
        curr: "meta",

        cost: E('6 TP 2'),
    },
    "O6": {
        max: 18,
        unl: ()=>hasUpgrade("O5"),

        get base() { return Decimal.add(1,upgradeEffect("O7",0)) },
        get pow() { return Decimal.mul(1,1) },

        get desc() {
            let p = this.pow
            return `每级增加 <b>MM2</b> 的等级效果指数 <b>+${format(this.base)}</b>${p == 1 ? "" : `<sup>${format(p,3)}</sup>`}。`
        },
        curr: "meta",

        cost: a => Decimal.tetrate(10, a.pow(2).pow_base(10).mul(1e4)),
        bulk: a => a.slog(10).div(1e4).log10().root(2).add(1).floor(),

        effect(a) {
            let x = this.base.mul(a.pow(this.pow))
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "O7": {
        max: 4,
        unl: ()=>hasUpgrade("O5"),

        get base() { return Decimal.mul(0.5,1) },
        get pow() { return Decimal.mul(1,1) },

        get desc() {
            let p = this.pow
            return `每级增加 <b>O6</b> 的基础值 <b>+${format(this.base)}</b>${p == 1 ? "" : `<sup>${format(p,3)}</sup>`}。`
        },
        curr: "meta",

        cost: a => Decimal.tetrate(10, a.pow_base(2).mul(19).pow_base(10)),
        bulk: a => a.slog(10).div(1e18).log10().div(19).log(2).add(1).floor(),

        effect(a) {
            let x = this.base.mul(a.pow(this.pow))
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "O8": {
        max: 1,
        unl: ()=>hasUpgrade('O7'),

        desc: `<b>MM6</b> 的基础值以降低的速率受到最佳元物质的提升。`,
        curr: "meta",

        cost: E('1e140 TP 1'),

        effect(a) {
            let x = expPow(player.meta.best.max(1).slog(10).add(1),0.65)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "O9": {
        max: 1,
        unl: ()=>hasUpgrade('O8'),

        desc: `<b style="color : gold">打破一切，直到全能...</b>`,
        curr: "meta",

        cost: E('1e308 TP 1'),

        on_buy() {
            prevent_save = true
            document.body.style.opacity = 0

            setTimeout(()=>{
                unlockAchievement("ach46")
                document.body.style.opacity = 1
                el('app').style.display = "none"
                el('the-end').style.display = "block"
                el('the-end').style.opacity = 1

                el('full-time').innerHTML = formatTime(player.time_played)
            }, 2500)
        }
    },
}

const UPG_KEYS = Object.keys(UPGRADES)
const PREFIXES = ["M",'UM','EM',"DM","MM","O"]

function getUpgrades(prefix) { return UPG_KEYS.filter(key => key.split(prefix)[0] == "" && Number(key.split(prefix)[1])) }

const PREFIX_TO_UPGS = (()=>{
    let x = {}
    PREFIXES.forEach(y => {x[y] = getUpgrades(y)})
    return x
})()

const PREFIX_NAMES = {
    "M": "物质",
    "UM": "非自然物质",
    "EM": "奇异物质",
    "DM": "暗物质",
    "MM": "元物质",
    "O": "操作符",
}

function getUpgradeCost(id) {
    let u = UPGRADES[id]

    return Decimal.gt(u.max ?? EINF,1) ? u.cost(player.upgrades[id]) : u.cost
}

function buyUpgrade(id, all = false, auto = false) {
    let u = UPGRADES[id], lvl = player.upgrades[id], max = u.max ?? EINF

    if (tmp.lock_upg.includes(id) || !player.upgs_unl.includes(id) && !u.unl() || lvl.gte(max)) return

    let cost = getUpgradeCost(id), curr = CURRENCIES[u.curr]

    if (!Decimal.isNaN(cost) && curr.amount.gte(cost)) {
        let bulk = player.upgrades[id].add(1)

        if ((all || auto) && Decimal.gt(max, 1)) {
            bulk = bulk.max(u.bulk(curr.amount).min(max))
            cost = u.cost(bulk.sub(1))
        }

        player.upgrades[id] = bulk
        if (!auto) {
            curr.amount = curr.amount.sub(cost).max(0)
            u.on_buy?.()
        }

        if (!player.upgs_unl.includes(id)) player.upgs_unl.push(id);
    }
}

function hasUpgrade(id,l=1) { return player.upgrades[id]?.gte?.(l) }
function upgradeEffect(id,def=1) { return tmp.upgs_effect[id] ?? def }
function simpleUpgradeEffect(id,def=1) { return hasUpgrade(id) ? tmp.upgs_effect[id] ?? def : def }

function updateUpgradesTemp() {
    for (let id in UPGRADES) {
        let u = UPGRADES[id]
        if (u.effect) tmp.upgs_effect[id] = u.effect(player.upgrades[id])
    }

    let auto = []

    if (!player.meta.unl) {
        if (hasUpgrade("UM3")) auto.push(...PREFIX_TO_UPGS['M']);
        if (hasUpgrade("EM5")) auto.push(...PREFIX_TO_UPGS['UM']);
        if (hasUpgrade("DM6")) auto.push(...PREFIX_TO_UPGS['EM']);
    }

    if (hasUpgrade("O2")) auto.push(...PREFIX_TO_UPGS['MM']);

    tmp.auto_upg = auto

    let lock = []

    tmp.lock_upg = lock
}

function resetUpgrades(id,keep=[]) {
    for (let i of PREFIX_TO_UPGS[id]) if (!keep.includes(i)) player.upgrades[i] = E(0)
}

function setupUpgradesHTML() {
    for (let prefix of PREFIXES) {
        let h = ""
        for (let index of PREFIX_TO_UPGS[prefix]) {
            h += `<button onclick="buyUpgrade('${index}')" id="upg-${index}-div"><div id="upg-${index}-desc"></div><div class='upgrade-ID'>${index}</div></button>`
        }
        el('upgrades-' + prefix + '-table').innerHTML = h
    }
}

function updateUpgrades(prefix) {
    for (let index of PREFIX_TO_UPGS[prefix]) {
        let u = UPGRADES[index], lvl = player.upgrades[index], max = u.max ?? EINF, bought = lvl.gte(max)
        let upg_elem = el('upg-' + index + '-div'), unl = player.upgs_unl.includes(index) || u.unl()

        upg_elem.style.display = unl ? "" : "none"

        if (unl) {
            let curr = CURRENCIES[u.curr]

            let h = ""
            if (Decimal.gt(max,1)) h += `<div>[级别 ${format(lvl,0) + (Decimal.lt(max,EINF) ? " / " + format(max,0) : "")}]</div>`;
            h += u.desc

            if (u.effDesc) h += `<br>效果: ${u.effDesc(tmp.upgs_effect[index])}`;
            var cost = getUpgradeCost(index)
            if (!bought) h += `<br>花费: ${format(cost,0)} ${curr.name}`;

            el('upg-' + index + '-desc').innerHTML = h
            upg_elem.className = el_classes({bought, locked: !bought && (tmp.lock_upg.includes(index) || curr.amount.lt(cost))})
        }
    }
}