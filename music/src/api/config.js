// 用来定义请求得一些常用配置
// 常用参数
export const commonParams = {
    g_tk: 5381,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    format: 'jsonp'
}
// callback得名字
export const options = {
    param: 'jsonpCallback'
}
// 返回成功得状态码
export const ERR_OK = 0
