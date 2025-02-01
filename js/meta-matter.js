const META_MATTER = {
    prefix: [
        ['', 'unnatural', 'exotic', 'dark', 'red', 'pink', 'purple', 'violet', 'blue', 'cyan', 'green', 'lime', 'yellow', 'orange', 'white', 'fading'],
        ["infinity", "eternity", "reality", "equality", "affinity", "celerity", "identity", "vitality", "immunity", "atrocity"],
    ],
    
    get base() { return 1e3 }, // 基础值为 1000

    formatFull(n) {
        n = E(n) // 将 n 转换为 Decimal 类型

        let h = "", tier = 0 // h 用于存储格式化后的字符串，tier 用于表示层级

        // 如果 n 大于等于 Number.MAX_VALUE
        if (n.gte(Number.MAX_VALUE)) {
            tier = n.slog(Number.MAX_VALUE).floor().toNumber()-1 // 计算层级

            let final = Math.floor(tier/10) // 计算最终的 meta 层级
            if (tier+1 < Number.MAX_SAFE_INTEGER) h += n.iteratedlog(Number.MAX_VALUE, tier+1).format() + " "; // 添加层级数值
            if (final > 0) h += "meta" + (final > 1 ? `<sup>${format(final,0)}</sup>` : "") + "-"; // 添加 meta 前缀
            h += this.prefix[1][tier%10] + " "; // 添加第二组前缀
        } else {
            tier = n.toNumber() // 将 n 转换为数字
            let tier_f = Math.floor(tier) // 取整数部分
            
            let final = Math.floor(tier_f/16) // 计算最终的 final 层级
            if (tier_f < Number.MAX_SAFE_INTEGER) h += Decimal.pow(1e3, tier%1).format() + " "; // 添加小数部分
            if (final > 0) h += "final" + (final > 1 ? `<sup>${format(final,0)}</sup>` : "") + " "; // 添加 final 前缀
            if (tier_f % 16 > 0) h += this.prefix[0][tier_f%16] + " "; // 添加第一组前缀
        }

        return h + "matter" // 返回格式化后的字符串
    },
}

function updateMetaMatterTemp() {
    // 更新临时数据（当前为空）
}

function updateMetaMatterHTML() {
    // 更新 HTML 中的 meta-matter 显示
    el("meta-matter-production").innerHTML = META_MATTER.formatFull(player.meta.best)

    // 更新 MM 和 O 类型的升级
    updateUpgrades("MM")
    updateUpgrades("O")
}