// 用来获取歌手页面的数据
import jsonp from 'common/js/jsonp'
// 导入公共配置
import {commonParams, options} from './config'
export function getSingers() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
    const data = Object.assign({}, commonParams, {
        channel: 'singer',
        page: 'list',
        key: 'all_all_all',
        pagesize: 100,
        pagenum: 1,
        loginUin: 0,
        hostUin: 0,
        notice: 0,
        platform: 'yqq',
        needNewCode: 0
    })
    return jsonp(url, data, options)
}
