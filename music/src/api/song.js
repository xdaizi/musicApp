// 放置歌曲请求的api
import {commonParams} from './config'
import axios from 'axios'
export function getLyric(mid) {
    const url = '/api/lyric'
    const data = Object.assign({}, commonParams, {
        songmid: mid,
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0,
        categoryId: 10000000,
        pcachetime: +new Date(),
        format: 'json'
    })
    return axios.get(url, {
        params: data
    }).then((res) => {
        let ret = res.data
        if (typeof ret === 'string') {
            var reg = /^\w+\(({[^()]+})\)$/
            var matches = ret.match(reg)
            if (matches) {
                ret = JSON.parse(matches[1])
            }
        }
        return Promise.resolve(ret)
    })
}