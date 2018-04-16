// 用来获取歌手页面的数据
import jsonp from 'common/js/jsonp'
// 导入公共配置
import {commonParams, options} from './config'
// 获取歌手列表
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
// 获取歌手的详细信息
/**
 *
 * @param {*} singerId 歌手得id
 */
export function getSingerDetail(singerId) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
    const data = Object.assign({}, commonParams, {
        platform: 'yqq',
        loginUin: 0,
        hostUin: 0,
        needNewCode: 0,
        order: 'listen',
        begin: 0,
        num: 100,
        songstatus: 1,
        singermid: singerId
    })
    return jsonp(url, data, options)
}