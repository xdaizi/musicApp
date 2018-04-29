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
export function getSongList(disstid) {
    const url = 'api/getSongList'
    const data = Object.assign({}, commonParams, {
        disstid,
        type: 1,
        json: 1,
        utf8: 1,
        onlysong: 0,
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0,
        loginUin: 0,
        notice: 0,
        format: 'json'
    })
    // return jsonp(url, data, options)
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}