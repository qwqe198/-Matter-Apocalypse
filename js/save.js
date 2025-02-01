const VERSION = 1
const SAVE_ID = "SIGJ2024_save"
var prevSave = "", autosave, prevent_save = false

function getPlayerData() {
    let s = {
        matter: E(0),
        best_matter: E(0),

        antimatter_time: E(0),

        unnatural: {
            unl: false,
            matter: E(0),
            total: E(0),

            anti_time: E(0),
        },

        exotic: {
            unl: false,
            matter: E(0),
            total: E(0),

            anti_time: E(0),
        },

        dark: {
            unl: false,
            matter: E(0),
            total: E(0),
        },

        meta: {
            unl: false,
            matter: E(0),
            best: E(0),
            operator: 0,
        },

        upgrades: {},
        upgs_unl: [],
        auto_upgs: {},
        achievements: [],

        options: {
            notation: 2,
            comma: 2,
            mixed_sc: 1,
            theme: 0,
        },

        time_played: 0,
    }

    for (let k in UPGRADES) s.upgrades[k] = E(0);

    return s
}

function wipe(reload) {
	player = getPlayerData()
    reloadTemp()
	if (reload) {
        save()
        location.reload()
    }
}

function wipeConfirm() {
    if (confirm("确定要重置吗？")) wipe(true)
}

function loadPlayer(load) {
    const DATA = getPlayerData()
    player = deepNaN(load, DATA)
    player = deepUndefinedAndDecimal(player, DATA)

    for (let [id, v] of Object.entries(player.upgrades)) if (!player.upgs_unl.includes(id) && v.gte?.(1)) player.upgs_unl.push(id);
}

function clonePlayer(obj,data) {
    let unique = {}

    for (let k in obj) {
        if (data[k] == null || data[k] == undefined) continue
        unique[k] = Object.getPrototypeOf(data[k]).constructor.name == "Decimal"
        ? E(obj[k])
        : typeof obj[k] == 'object'
        ? clonePlayer(obj[k],data[k])
        : obj[k]
    }

    return unique
}

function deepNaN(obj, data) {
    for (let k in obj) {
        if (typeof obj[k] == 'string') {
            if (data[k] == null || data[k] == undefined ? false : Object.getPrototypeOf(data[k]).constructor.name == "Decimal") if (isNaN(E(obj[k]).mag)) obj[k] = data[k]
        } else {
            if (typeof obj[k] != 'object' && isNaN(obj[k])) obj[k] = data[k]
            if (typeof obj[k] == 'object' && data[k] && obj[k] != null) obj[k] = deepNaN(obj[k], data[k])
        }
    }
    return obj
}

function deepUndefinedAndDecimal(obj, data) {
    if (obj == null) return data
    for (let k in data) {
        if (obj[k] === null) continue
        if (obj[k] === undefined) obj[k] = data[k]
        else {
            if (Object.getPrototypeOf(data[k]).constructor.name == "Decimal") obj[k] = E(obj[k])
            else if (typeof obj[k] == 'object') deepUndefinedAndDecimal(obj[k], data[k])
        }
    }
    return obj
}

function preventSaving() { return prevent_save }

function save(auto=false) {
    if (auto && false) return
    let str = btoa(JSON.stringify(player))
    if (preventSaving() || findNaN(str, true)) return
    if (localStorage.getItem(SAVE_ID) == '') wipe()
    localStorage.setItem(SAVE_ID,str)
    prevSave = str
    addNotify("游戏已保存！")
}

function load(x){
    if(typeof x == "string" & x != ''){
        loadPlayer(JSON.parse(atob(x)))
    } else {
        wipe()
    }
}

function exporty() {
    let str = btoa(JSON.stringify(player))
    save();
    let file = new Blob([str], {type: "text/plain"})
    window.URL = window.URL || window.webkitURL;
    let a = document.createElement("a")
    a.href = window.URL.createObjectURL(file)
    a.download = "SIGJ2024 存档 - "+new Date().toGMTString()+".txt"
    a.click()
}

function export_copy() {
    let str = btoa(JSON.stringify(player))

    let copyText = document.getElementById('copy')
    copyText.value = str
    copyText.style.visibility = "visible"
    copyText.select();
    document.execCommand("copy");
    copyText.style.visibility = "hidden"
}

function importy() {
    loadgame = prompt("粘贴你的存档。警告：将覆盖你当前的存档！")
    if (loadgame != null) {
        let keep = player
        try {
			if (findNaN(loadgame, true)) {
				error("导入错误，因为出现了NaN")
				return
			}
			localStorage.setItem(SAVE_ID, loadgame)
			location.reload()
        } catch (error) {
            error("导入错误")
            player = keep
        }
    }
}

function importy_file() {
    let a = document.createElement("input")
    a.setAttribute("type","file")
    a.click()
    a.onchange = ()=>{
        let fr = new FileReader();
        fr.onload = () => {
            let loadgame = fr.result
            if (findNaN(loadgame, true)) {
				error("导入错误，因为出现了NaN")
				return
			}
            localStorage.setItem(SAVE_ID, loadgame)
			location.reload()
        }
        fr.readAsText(a.files[0]);
    }
}

function checkNaN() {
    let naned = findNaN(player)
    if (naned) {
        warn("游戏数据因"+naned.bold()+"而出现NaN")
        resetTemp()
        loadGame(false, true)
        tmp.start = 1
        tmp.pass = 1
    }
}

function isNaNed(val) {
    return typeof val == "number" ? isNaN(val) : Object.getPrototypeOf(val).constructor.name == "Decimal" ? isNaN(val.mag) : false
}

function findNaN(obj, str=false, data=getPlayerData(), node='player') {
    if (str ? typeof obj == "string" : false) obj = JSON.parse(atob(obj))
    for (let k in obj) {
        if (typeof obj[k] == "number") if (isNaNed(obj[k])) return node+'.'+k
        if (str) {
            if (typeof obj[k] == "string") if (data[k] == null || data[k] == undefined ? false : Object.getPrototypeOf(data[k]).constructor.name == "Decimal") if (isNaN(E(obj[k]).mag)) return node+'.'+k
        } else {
            if (obj[k] == null || obj[k] == undefined ? false : Object.getPrototypeOf(obj[k]).constructor.name == "Decimal") if (isNaN(E(obj[k]).mag)) return node+'.'+k
        }
        if (typeof obj[k] == "object") {
            let node2 = findNaN(obj[k], str, data[k], (node?node+'.':'')+k)
            if (node2) return node2
        }
    }
    return false
}