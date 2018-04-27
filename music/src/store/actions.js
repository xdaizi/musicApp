// 管理相关的actions,以及对mutation进行封装(可能一次性提供多个mutation)
import * as types from './mutation-types'
import { shuffle } from 'common/js/util'
import { getVkey } from 'api/singer'
import { ERR_OK, GUID } from 'api/config'
import { playMode } from 'common/js/config'
// 选择播放.需要提交多个mutation,所以用action封装
export const selectPlay = function({commit, state}, {list, index, url}) {
    commit(types.SET_SEQUENCE_LIST, list)
    commit(types.SET_PLAY_LIST, list)
    commit(types.SET_CURRENT_INDEX, {index, url})
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
    commit(types.SET_INNER_STATE, true)
}
export const setSongList = function({commit, state}, list) {
    commit(types.SET_SEQUENCE_LIST, list)
    commit(types.SET_PLAY_LIST, list)
}
export const setRandomPlay = function({commit, state}, {list, index, url}) {
    if (!list) return
    commit(types.SET_SEQUENCE_LIST, list)
    let templist = shuffle(list)
    commit(types.SET_PLAY_LIST, templist)
    if (state.playList[0].urlFlag) {
        commit(types.SET_CURRENT_INDEX, {index: 0})
    } else {
        _getKey(state.playList[0]).then(res => {
            commit(types.SET_CURRENT_INDEX, {index: 0, url: res})
        })
    }
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
    commit(types.SET_INNER_STATE, true)
    commit(types.SET_PLAY_MODE, playMode.random)
}
/**
 * 封装的带参数得Promise对象 ---- 核心return一个promis对象
 * @param {*} item 需要播放得歌曲
 */
const _getKey = function(item) {
    return new Promise((resolve, reject) => {
        getVkey(item).then(res => {
            let result = ''
            if (res.code === ERR_OK) {
                result = res.data.items[0]['vkey']
                result = 'http://dl.stream.qqmusic.qq.com/C400' + item.mid + '.m4a?vkey=' + result + '&guid=' + GUID + '&uin=0&fromtag=66'
                resolve(result)
            }
        })
    })
}