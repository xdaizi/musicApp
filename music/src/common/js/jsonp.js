// 封装工具函数jsonp
import originJsonp from 'jsonp'
// 导出一个异步对象
export default function jsonp(url, data, option) {
    url += (url.indexOf('?') < 0 ? '?' : '') + parma(data)
    return new Promise((resolve, reject) => {
        originJsonp(url, option, (err, data) => {
            if (!err) {
                resolve(data)
            } else {
                reject(err)
            }
        })
    })
}
// 封装将data拼接起来到url上,遍历data
/**
 * @param {*} data : 参数
 */
function parma(data) {
    let url = ''
    for (var k in data) {
        let val = data[k] !== undefined ? data[k] : ''
        url += `&${k}=${encodeURIComponent(val)}`
    }
    return url ? url.slice(0) : ''
}