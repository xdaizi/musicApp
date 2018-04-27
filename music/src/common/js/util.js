// 放置工具类函数
/**
 * 用来打乱数组得顺序,将0-i中的元素和i交换
 * @param {*} list:数组
 */
export function shuffle(list) {
    if (!list || list.length === 0) return list
    let tempList = list.slice(0)
    for (let i = 0, l = tempList.length; i < l; i++) {
        let k = getRandom(0, i)
        let temp = tempList[k]
        tempList[k] = tempList[i]
        tempList[i] = temp
    }
    return tempList
}
/**
 * 获取随机数
 * @param {*} min 下限
 * @param {*} max 上限
 */
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1))
}