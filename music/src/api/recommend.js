// 获取推荐页面得数据方法
import jsonp from 'common/js/jsonp'
// 导入公共配置
import {commonParams, options} from './config'
export function getRecommend() {
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
    const data = Object.assign({}, commonParams, {
        platfrom: 'h5',
        uin: 0,
        needNewCode: 1
    })
    return jsonp(url, data, options)
}