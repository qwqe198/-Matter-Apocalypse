const el = id => document.getElementById(id); // 获取 DOM 元素
const FPS = 30; // 帧率设置为 30

var player = {}, date = Date.now(), diff = 0; // 玩家数据、当前时间和时间差

// 主循环函数
function loop() {
    updateTemp(); // 更新临时数据
    diff = Date.now() - date; // 计算时间差
    updateHTML(); // 更新 HTML 内容
    calc(diff / 1000); // 计算游戏逻辑
    date = Date.now(); // 更新当前时间
}

// 获取反物质增长
function getAntimatterGrowth(t = player.antimatter_time) {
    t = tmp.dark_penalty[2] ? t.div(10) : t.root(2).div(5); // 根据暗物质惩罚调整时间

    let x = Decimal.tetrate(1e3, t).sub(1).max(0); // 计算反物质增长

    return x;
}

// 获取非自然物质增长
function getAntiUnnaturalGrowth(offset = 0) {
    let t = player.unnatural.anti_time.add(offset); // 添加偏移量

    let x = Decimal.pow(1e4, t.div(10)).scale(1e30, 3, "D"); // 计算非自然物质增长

    return x.sub(1).max(0);
}

// 获取奇异物质增长
function getAntiExoticGrowth(offset = 0) {
    let t = player.exotic.anti_time.add(offset); // 添加偏移量

    let x = Decimal.pow(1e9, t.div(8)); // 计算奇异物质增长

    return x.sub(1).max(0);
}

var tab = 0, stab = [0], tab_name = 'matter'; // 当前选项卡、子选项卡和选项卡名称

// 选项卡内容定义
const TAB_IDS = {
    'matter': {
        html() {
            updateUpgrades('M'); // 更新物质升级
        },
    },
    'unnatural': {
        name: "非自然物质",

        html() {
            el('unnatural-amount').innerHTML = format(player.unnatural.matter, 0); // 更新非自然物质数量
            el('unnatural-total').innerHTML = format(player.unnatural.total, 0); // 更新非自然物质总量

            el('unnatural-boost').innerHTML = formatMult(tmp.unnatural_boost); // 更新非自然物质加成

            el('anti-unnaturalmatter-amount').innerHTML = hasUpgrade("DM5") ? "" : player.unnatural.total.gte(1e4)
                ? `由于大量非自然物质，你生成了 <h4>${format(getAntiUnnaturalGrowth().min(player.unnatural.total), 0)}</h4> 自然物质！`
                + (hasUpgrade("EM4") ? "" : ` (<h4>${format(getAntiUnnaturalGrowth(tmp.unnatural_speed).min(player.unnatural.total.add(tmp.currency_gain.unnatural)), 0)}</h4> 下次物质湮灭时)`)
                : "";

            el('unnatural-gain').innerHTML = hasUpgrade("EM4") ? formatGain(player.unnatural.matter, tmp.currency_gain.unnatural.mul(CURRENCIES.unnatural.passive)) : `(+${format(tmp.currency_gain.unnatural, 0)}/湮灭)`; // 更新非自然物质增益

            updateUpgrades('UM'); // 更新非自然物质升级
        },
    },
    'exotic': {
        name: "奇异物质",

        html() {
            el('exotic-amount').innerHTML = format(player.exotic.matter, 0); // 更新奇异物质数量
            el('exotic-total').innerHTML = format(player.exotic.total, 0); // 更新奇异物质总量

            let effect = tmp.exotic_boost;

            el('exotic-boost1').innerHTML = formatMult(effect[0]), el('exotic-boost2').innerHTML = formatPow(effect[1], 3); // 更新奇异物质加成

            el('anti-exoticmatter-amount').innerHTML = hasUpgrade("DM5") ? "" : player.exotic.total.gte(1e9)
                ? `由于大量奇异物质，你生成了 <h4>${format(getAntiExoticGrowth().min(player.exotic.total), 0)}</h4> 腐化物质！`
                + (hasUpgrade("DM5") ? "" : ` (<h4>${format(getAntiExoticGrowth(1).min(player.exotic.total.add(tmp.currency_gain.exotic)), 0)}</h4> 下次非自然物质湮灭时)`)
                : "";

            el('exotic-gain').innerHTML = hasUpgrade("DM5") ? formatGain(player.exotic.matter, tmp.currency_gain.exotic.mul(CURRENCIES.exotic.passive)) : `(+${format(tmp.currency_gain.exotic, 0)}/湮灭)`; // 更新奇异物质增益

            updateUpgrades('EM'); // 更新奇异物质升级
        },
    },
    'dark': {
        name: "暗物质",

        html() {
            el('dark-amount').innerHTML = format(player.dark.matter, 0); // 更新暗物质数量
            el('dark-total').innerHTML = format(player.dark.total, 0); // 更新暗物质总量

            el('dark-gain').innerHTML = `(+${format(tmp.currency_gain.dark, 0)}/湮灭)`; // 更新暗物质增益

            let effect = tmp.dark_boost;

            el('dark-boost1').innerHTML = formatMult(effect[0]), el('dark-boost2').innerHTML = formatPow(effect[1], 3); // 更新暗物质加成

            updateDarkPenalties(); // 更新暗物质惩罚

            updateUpgrades('DM'); // 更新暗物质升级
        },
    },
    "options": {
        name: "选项",

        html() {
            NOTATIONS_OPTIONS.forEach((x, i) => {
                el("notation-btn-" + i).innerHTML = x.html; // 更新选项按钮
            });
        },
    },
    "achs": {
        name: "成就",

        html: updateAchievements, // 更新成就
    },
    "auto": {
        name: "自动化",

        html() {
            let au = player.auto_upgs;

            for (let prefix of PREFIXES) {
                let unl = false, upgs = PREFIX_TO_UPGS[prefix];

                if (!player.meta.unl || !["M", "UM", "EM", "DM"].includes(prefix)) for (let index of upgs) if (tmp.auto_upg.includes(index)) {
                    unl = true;
                    break;
                }

                el("auto-upgs-" + prefix + "-div").style.display = el_display(unl);

                if (unl) {
                    for (let index of upgs) {
                        let upg_unl = player.upgs_unl.includes(index), elem = el("auto-upg-" + index + "-btn");

                        elem.style.display = el_display(upg_unl);

                        if (upg_unl) elem.className = el_classes({ bought: !(index in au) || au[index] });
                    }
                }
            }
        },
    },
    "meta": {
        name: "元物质",

        html: updateMetaMatterHTML, // 更新元物质
    },
}

// 选项卡定义
const TABS = [
    {
        unl: () => !player.meta.unl,
        name: "物质",

        stab: "matter",
    }, {
        unl: () => !player.meta.unl && player.unnatural.unl,
        name: "湮灭",

        stab: [
            ["unnatural"],
            ["exotic", () => player.exotic.unl],
            ["dark", () => player.dark.unl],
        ],
    }, {
        unl: () => player.meta.unl,
        name: "元物质",

        stab: "meta",
    }, {
        unl: () => tmp.auto_upg.length > 0,
        name: "自动化",

        stab: "auto",
    }, {
        name: "成就",

        stab: "achs",
    }, {
        name: "选项",

        stab: "options",
    },
]

// 切换选项卡
function switchTab(t, st) {
    tab = t;
    if (st !== undefined) stab[t] = st;

    let s = TABS[t].stab;

    if (Array.isArray(s)) tab_name = s[stab[t] ?? 0][0];
    else tab_name = s;
}

// 获取选项卡通知
function getTabNotification(id) {
    return TAB_IDS[id].notify?.();
}

// 更新选项卡
function updateTabs() {
    var tab_unlocked = {};

    for (let [i, v] of Object.entries(TABS)) {
        let unl = !v.unl || v.unl(), elem, selected = parseInt(i) == tab, array = Array.isArray(v.stab);
        tab_unlocked[i] = [];

        if (array) {
            if (unl) {
                tab_unlocked[i] = v.stab.filter(x => (!x[1] || x[1]()) && getTabNotification(x[0])).map(x => x[0]);
            }

            elem = el('stab' + i + '-div');

            elem.style.display = el_display(selected);

            if (selected) v.stab.forEach(([x, u], j) => {
                var s_elem = el('stab' + i + '-' + j + '-button');

                s_elem.style.display = el_display(!u || u());
                s_elem.className = el_classes({ "tab-button": true, stab: true, selected: x == tab_name, notify: tab_unlocked[i].includes(x) });
            });
        }

        elem = el('tab' + i + '-button');

        elem.style.display = el_display(unl);
        if (unl) elem.className = el_classes({ "tab-button": true, selected, notify: (array ? tab_unlocked[i].length > 0 : getTabNotification(v.stab)) });
    }

    for (let [i, v] of Object.entries(TAB_IDS)) {
        let unl = tab_name == i, elem = el(i + "-tab");

        if (!elem) continue;

        elem.style.display = el_display(unl);

        if (unl) v.html?.();
    }
}

// 初始化选项卡
function setupTabs() {
    let h = "", h2 = "";

    for (let [i, v] of Object.entries(TABS)) {
        h += `<button class="tab-button" id="tab${i}-button" onclick="switchTab(${i})">${v.name}</button>`;

        if (Array.isArray(v.stab)) {
            h2 += `<div id="stab${i}-div" id="${v.stab[stab[i]]}-tab">
            ${v.stab.map(([x], j) => `<button class="tab-button stab" id="stab${i}-${j}-button" onclick="switchTab(${i},${j})">${TAB_IDS[x].name}</button>`).join("")}
            </div>`;
        }
    }

    el('tabs').innerHTML = h + h2;
}

// 添加通知
function addNotify(message, time = 3) {
    const notify = document.createElement('div');
    notify.classList.add('notify-ctn');
    notify.innerHTML = message;
    el('notify').appendChild(notify);
    setTimeout(() => {
        notify.style.opacity = 0;
        setTimeout(() => {
            notify.remove();
        }, 1000);
    }, time * 1000);
}

// 暗物质惩罚定义
const DARK_PENALTY = [
    {
        unl: () => CURRENCIES.dark.total.gte(1),

        get desc() {
            return [
                `奇异物质的乘数减少 <b>^0.6</b>。`,
                `进一步改善非自然物质获取。`
            ];
        },
    }, {
        unl: () => CURRENCIES.dark.total.gte(100),

        get desc() {
            return [
                `物质生成在超过 <b>${format(tmp.matter_overflow_start)}</b> 时进一步减慢。`,
                `移除 <b>M6</b> 的缩放。`
            ];
        },
    }, {
        unl: () => hasUpgrade("DM5"),

        get desc() {
            return [
                `反物质增长重新出现且不受 <b>M5</b> 影响。物质湮灭会强制奇异物质湮灭以生成暗物质。`,
                `反物质增长时间略微提升暗物质获取。`
            ];
        },
    }, {
        unl: () => hasUpgrade("DM7"),

        get desc() {
            return [
                `奇异物质的基础值在超过 <b>${format(1e100)}</b> 时进一步减慢。`,
                `解锁最终升级。`
            ];
        },
    },
]

// 初始化暗物质惩罚
function setupDarkPenalties() {
    let h = "";

    for (let i in DARK_PENALTY) {
        h += `
        <div class="dark-penalty" id="dark-penalty-${i}">
            <div class="dark-penalty-base" id="dark-penalty-${i}-base">
                
            </div>
        </div>
        `;
    }

    el("dark-penalties").innerHTML = h;
}

// 更新暗物质惩罚
function updateDarkPenalties() {
    let s = ["[-]", "[+]"];

    for (let i in DARK_PENALTY) {
        let P = DARK_PENALTY[i];

        let unl = P.unl();

        el(`dark-penalty-${i}`).style.display = el_display(unl);

        if (unl) el(`dark-penalty-${i}-base`).innerHTML = P.desc.map((x, i) => `<div><b>${s[i]}</b> ${x}</div>`).join("");
    }
}