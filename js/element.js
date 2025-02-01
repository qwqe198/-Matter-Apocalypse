// 根据布尔值返回 CSS 的 display 属性值
function el_display(bool) { return bool ? "" : "none" }

// 根据对象生成 CSS 类名字符串
function el_classes(data) { return Object.keys(data).filter(x => data[x]).join(" ") }

// 更新 HTML 内容
function updateHTML() {
    // 更新物质数量显示
    el('matter-amount').innerHTML = player.meta.unl ? format(player.meta.matter) : format(player.matter, 0);
    // 更新物质增益显示
    el('matter-gain').innerHTML = player.meta.unl ? player.meta.matter.formatGain(tmp.currency_gain.meta) : player.matter.formatGain(tmp.currency_gain.matter);

    // 更新反物质数量显示
    el('antimatter-amount').innerHTML = (tmp.dark_penalty[2] || !hasUpgrade("EM4")) && player.best_matter.gte(1e3)
        ? `由于大量物质，你生成了 <h4>${format(getAntimatterGrowth().min(player.matter), 0)}</h4> 反物质！`
        : "";

    // 更新物质名称显示
    el('matter-name').innerHTML = player.meta.unl ? "元物质" : "物质";

    // 更新选项卡
    updateTabs();
}

// 更新主题样式
function updateTheme() {
    el('theme_css').href = options.theme != "normal" ? "style/" + options.theme + ".css" : "";
}

// 数字格式化选项
const NOTATIONS_OPTIONS = [
    {
        get html() {
            return "格式化表示法: " + ["科学计数法", "标准", "混合科学计数法", "对数"][player.options.notation];
        },
        click() {
            player.options.notation = (player.options.notation + 1) % 4;
        },
    }, {
        get html() {
            return "数字逗号分隔: " + [3, 6, 9, 12, 15][player.options.comma] + " 位";
        },
        click() {
            player.options.comma = (player.options.comma + 1) % 5;
        },
    }, {
        get html() {
            return "混合科学计数法起始值: " + ["e33", "e63", "e303", "e3003"][player.options.mixed_sc];
        },
        click() {
            player.options.mixed_sc = (player.options.mixed_sc + 1) % 4;
        },
    }, {
        get html() {
            return "主题: " + ["默认 (浅色)", "深色"][player.options.theme];
        },
        click() {
            player.options.theme = (player.options.theme + 1) % 2;

            options.theme = ['normal', 'dark'][player.options.theme];
            updateTheme();
        },
    },
]

// 初始化数字格式化选项
function setupNotations() {
    el('notations').innerHTML = NOTATIONS_OPTIONS.map((x, i) => `<button class="big-btn" id="notation-btn-${i}"></button>`).join("");

    NOTATIONS_OPTIONS.forEach((x, i) => {
        el("notation-btn-" + i).onclick = x.click;
    });
}

// 初始化自动化升级
function setupAutomations() {
    let table = document.getElementById("auto-upgrades");
    let au = player.auto_upgs;
    for (let prefix of PREFIXES) {
        let elem = document.createElement("div");
        elem.id = "auto-upgs-" + prefix + "-div";
        elem.className = "auto-div";
        elem.innerHTML = `<h4>${PREFIX_NAMES[prefix]} 升级</h4><div class="auto-upgs-grid" id="auto-upgs-${prefix}-grid"></div>`;
        table.appendChild(elem);

        let grid = el("auto-upgs-" + prefix + "-grid");
        for (let index of PREFIX_TO_UPGS[prefix]) {
            let upg_grid = document.createElement("button");
            upg_grid.id = "auto-upg-" + index + "-btn";
            upg_grid.innerHTML = index;
            upg_grid.onclick = () => {
                au[index] = index in au && !au[index];
            };
            grid.appendChild(upg_grid);
        }
    }
}

// 初始化 HTML 内容
function setupHTML() {
    setupUpgradesHTML(); // 初始化升级 HTML
    setupTabs(); // 初始化选项卡
    setupNotations(); // 初始化数字格式化选项
    setupAchievements(); // 初始化成就
    setupAutomations(); // 初始化自动化升级
    setupDarkPenalties(); // 初始化暗物质惩罚
}