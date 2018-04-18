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
// 用来获取播放源得vkey
export const GUID = 6110246780
// 默认得播放地址,由于key值是异步获取,所以需要一个默认播放地址
export const SONG_PLAY = `http://dl.stream.qqmusic.qq.com/C400003v4UL61IYlTY.m4a?vkey=A02F6E6A5E5DE312947336CBDE1564E1DFFCEB4D13643AD7554FA39396B3294217B9EE2774FB8B6E47C17CC372EBD52E76C44635D7EF2111&guid=6110246780&uin=0&fromtag=66`