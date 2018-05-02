// 处理本地缓存
import storage from 'good-storage'
// 定义存储search历史记录的key值和最大存放数
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15
export function saveSearch(query) {
    // 取出
    let history = storage.get(SEARCH_KEY, [])
    // 插入
    insearArray(history, query, (item) => {
        return item === query
    }, SEARCH_MAX_LENGTH)
    // 保存
    storage.set(SEARCH_KEY, history)
    return history
}
// 获取本地存储得search记录,页面刷新时初始化仓库中对应的变量
export function loadSearch() {
    return storage.get(SEARCH_KEY, [])
}
/**
 * 将数据插入到数组中
 * @param {Array} arr 数组
 * @param {*} val 插入的值
 * @param {*} fn 处理函数
 * @param {*} maxLength 数组最大长度
 */
function insearArray(arr, val, fn, maxLen) {
    let index = arr.findIndex(fn)
    if (index === 0) return
    // 有重复的先删除
    if (index !== -1) {
        arr.splice(index, 1)
    }
    arr.unshift(val)
    // 超出最大长度则推出
    if (maxLen && arr.length >= maxLen) {
        arr.pop()
    }
}