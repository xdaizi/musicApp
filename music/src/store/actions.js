// 管理相关的actions,以及对mutation进行封装(可能一次性提供多个mutation)
import * as types from './mutation-types'
import { shuffle } from 'common/js/util'
import { getVkey } from 'api/singer'
import { ERR_OK, GUID } from 'api/config'
import { playMode } from 'common/js/config'
import { saveSearch, deleteOneHistory, clearHistory } from 'common/js/cache'
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
export const insertSong = function({commit, state}, song) {
    let playlist = state.playList.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    let currentSong = playlist[currentIndex]
    let index = _findIndex(playlist, song)
    // 播放列表中存在
    if (index !== -1) {
        playlist.splice(index, 1)
        currentIndex = index > currentIndex ? currentIndex : (currentIndex - 1)
    }
    playlist.splice(currentIndex + 1, 0, song)
    let sequIndex = _findIndex(sequenceList, song)
    let seuqCurrentIndex = _findIndex(sequenceList, currentSong)
    if (sequIndex !== -1) {
        sequenceList.splice(sequIndex, 1)
        seuqCurrentIndex = sequIndex > seuqCurrentIndex ? seuqCurrentIndex : (seuqCurrentIndex - 1)
    }
    sequenceList.splice(seuqCurrentIndex + 1, 0, song)
    currentIndex++
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_PLAY_LIST, playlist)
    commit(types.SET_CURRENT_INDEX, {index: currentIndex})
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
    commit(types.SET_INNER_STATE, true)
}
// 保存历史记录
export const saveSearchHistory = function({commit}, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}
// 删除一条历史记录
export const deleteHistory = function({commit}, query) {
    commit(types.SET_SEARCH_HISTORY, deleteOneHistory(query))
}
// 清空历史记录
export const clearAllHistory = function({commit}) {
    commit(types.SET_SEARCH_HISTORY, clearHistory())
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
/**
 * 寻找元素所在的item
 * @param {Array} list 歌曲列表
 * @param {*} item 查询得对象
 */
const _findIndex = function(list, item) {
    return list.findIndex(v => {
        return v.id === item.id
    })
}