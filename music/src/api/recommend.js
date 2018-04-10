// 获取推荐页面得数据方法
import jsonp from 'common/js/jsonp'
// 导入公共配置
import {commonParams, options} from './config'
// 导入axios
import axios from 'axios'
// 轮播图数据
export function getRecommend() {
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
    const data = Object.assign({}, commonParams, {
        platfrom: 'h5',
        uin: 0,
        needNewCode: 1
    })
    return jsonp(url, data, options)
}
// 歌单列表数据
// 由于不能直接访问qq音乐的接口所以需要使用后端代理的方式
export function getSingList() {
    const url = '/api/getSingList'
    const data = Object.assign({}, commonParams, {
        platform: 'yqq',
        hostUin: 0,
        sin: 0,
        ein: 29,
        uin: 0,
        sortId: 5,
        needNewCode: 0,
        categoryId: 10000000,
        rnd: Math.random(),
        format: 'json'
    })
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}