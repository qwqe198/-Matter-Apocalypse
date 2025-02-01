const Achievements = {
    'ach11': {
        title: `物质维度？`,
        get desc() { return `开始生成物质。` },
        check: () => hasUpgrade("M1"),
    },
    'ach12': {
        title: `哦不，一切都被清除了！`,
        get desc() { return `湮灭物质。` },
    },
    'ach13': {
        title: `Jacorbian-RedSharkian 平衡的缩影`,
        get desc() { return `达到 <b>${format(1e100)}</b> 物质。` },
        check: () => player.matter.gte(1e100),
        get reward() { return `<b>^1.05</b> 物质生成加成。` },
    },
    'ach14': {
        title: `终于有自动化了`,
        get desc() { return `购买 <b>UM3</b> 升级。` },
        check: () => hasUpgrade("UM3"),
    },
    'ach15': {
        title: `湮灭中的湮灭？！`,
        get desc() { return `湮灭非自然物质。` },
    },
    'ach16': {
        title: `通货膨胀永无止境`,
        get desc() { return `达到 <b>${format('ee25')}</b> 物质。` },
        check: () => player.matter.gte('ee25'),
    },

    'ach21': {
        title: `不再湮灭，但代价是什么？`,
        get desc() { return `购买 <b>EM4</b> 升级。` },
        check: () => hasUpgrade("EM4"),
    },
    'ach22': {
        title: `等等，那个反物质很危险`,
        get desc() { return `拥有至少 <b>1 天</b> 的反物质增长（约 <b>${format(getAntimatterGrowth(E(86400)))}</b> 反物质）。` },
        check: () => getAntimatterGrowth().gte(getAntimatterGrowth(E(86400))),
        get reward() { return `<b>双倍</b> 反物质和自然物质增长的时间速度。` },
    },
    'ach23': {
        title: `算了，我不喜欢通货膨胀`,
        get desc() { return `在不购买 <b>M2</b> 升级的情况下达到 <b>${format('ee100')}</b> 物质。` },
        check: () => player.matter.gte('ee100') && !hasUpgrade("M2"),
    },
    'ach24': {
        title: `Jacorbian-RedSharkian 平衡的缩影 II`,
        get desc() { return `达到 <b>${format(1e100)}</b> 总非自然物质。` },
        check: () => player.unnatural.total.gte(1e100),
        get reward() { return `<b>^1.05</b> 非自然物质获取加成。` },
    },
    'ach25': {
        title: `你能停止更多的湮灭吗？`,
        get desc() { return `湮灭奇异物质。` },
    },
    'ach26': {
        title: `呃，我觉得湮灭会变得有用`,
        get desc() { return `在不购买 <b>EM4</b> 升级的情况下湮灭奇异物质。` },
        get reward() { return `在奇异物质湮灭时保留 <b>EM4</b> 升级，并且速度提升 <b>${formatMult(5)}</b> 倍。` },
    },

    'ach31': {
        title: `我对惩罚感到困惑`,
        get desc() { return `触发 <b>第 2 个</b> 暗物质惩罚。` },
        check: () => tmp.dark_penalty[1],
    },
    'ach32': {
        title: `不再有烦人的湮灭了！`,
        get desc() { return `购买 <b>DM5</b> 升级。` },
        check: () => hasUpgrade("DM5"),
    },
    'ach33': {
        title: `Jacorbian-RedSharkian 平衡的缩影 III`,
        get desc() { return `达到 <b>${format(1e100)}</b> 总奇异物质。` },
        check: () => player.exotic.total.gte(1e100),
        get reward() { return `<b>^1.05</b> 奇异物质获取加成。` },
    },
    'ach34': {
        title: `通货膨胀没有尽头`,
        get desc() { return `达到 <b>${format('eee100')}</b> 物质。` },
        check: () => player.matter.gte('eee100'),
    },
    'ach35': {
        title: `<img src="style/bart.png">`,
        get desc() { return `购买 <b>DM8</b> 升级。` },
        check: () => hasUpgrade("DM8"),
        get reward() { return `将反物质增长的时间速度提升 <b>100</b> 倍。你为什么要看这个？` },
    },
    'ach36': {
        title: `你赢了，但代价是什么？`,
        get desc() { return `达到 <b>${format("175 PT 5.741225")}</b> 物质。` },
        check: () => player.matter.gte("175 PT 5.741225"),
    },

    'ach41': {
        title: `“兄弟，这是经典事件”`,
        get desc() { return `进入 <b>物质宇宙</b>。` },
        check: () => player.meta.unl,
    },
    'ach42': {
        title: `无限湮灭？？？`,
        get desc() { return `达到 <b>${format(Number.MAX_VALUE)}</b> 元物质 (<b>${META_MATTER.formatFull(Number.MAX_VALUE)}</b>)。` },
        check: () => player.meta.matter.gte(Number.MAX_VALUE),
        get reward() { return `将元物质生成提升 <b>10</b> 倍。` },
    },
    'ach43': {
        title: `时间与湮灭相关`,
        b: Decimal.tetrate(Number.MAX_VALUE, 2),
        get desc() { return `达到 <b>${format(this.b)}</b> 元物质 (<b>${META_MATTER.formatFull(this.b)}</b>)。` },
        check() { return player.meta.matter.gte(this.b) },
    },
    'ach44': {
        title: `四次方开始造成伤害！`,
        get desc() { return `购买 <b>O6</b> 升级。` },
        check: () => hasUpgrade("O6"),
        get reward() { return `成就加成现在影响 <b>MM6</b> 升级效果的指数。` },
    },
    'ach45': {
        title: `很快会有元元物质吗？`,
        b: Decimal.tetrate(Number.MAX_VALUE, 1e100),
        get desc() { return `达到 <b>${format(this.b)}</b> 元物质 (<b>${META_MATTER.formatFull(this.b)}</b>)。` },
        check() { return player.meta.matter.gte(this.b) },
    },
    'ach46': {
        title: `湮灭大师`,
        get desc() { return `通关游戏。` },
    },
}

// 更新成就显示
function updateAchievements() {
    for (let [id, v] of Object.entries(Achievements)) {
        let n = parseInt(id.split("ach")[1]);

        let ach = el(id + "-div"), unl = player.meta.unl || n < 41;

        ach.style.visibility = unl ? "" : "hidden";

        let h = `<b class="ach-title">${v.title}</b><br class='line'>${v.desc}`;

        if ('reward' in v) h += `<br><i>奖励: ${v.reward}</i>`;

        updateTooltip(ach, h);

        ach.className = el_classes({ tooltip: true, bought: player.achievements.includes(id) });
    }

    el('ach-total').innerHTML = format(player.achievements.length, 0);
    el('ach-boost').innerHTML = formatMult(getAchievementBoost(), 3);
}

// 初始化成就
function setupAchievements() {
    var ach_table = el('achievements');

    for (let [id, v] of Object.entries(Achievements)) {
        let new_ach = document.createElement('button');

        new_ach.id = id + "-div";
        new_ach.innerHTML = 'reward' in v ? "★ " + v.title : v.title;
        new_ach.className = "tooltip";

        ach_table.appendChild(new_ach);
    }
}

// 解锁成就
function unlockAchievement(id) {
    if (!player.achievements.includes(id)) {
        player.achievements.push(id);
        addNotify(`<b>成就已解锁:</b> ${Achievements[id].title}`);
    }
}

// 检查成就
function checkAchievements() {
    for (let [id, v] of Object.entries(Achievements)) {
        if (!player.achievements.includes(id) && v.check?.()) unlockAchievement(id);
    }
}

// 检查是否拥有成就
function hasAchievement(id) {
    return player.achievements.includes(id);
}